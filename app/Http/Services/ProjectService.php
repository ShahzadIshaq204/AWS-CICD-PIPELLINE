<?php

namespace App\Http\Services;

use Exception;
use App\Models\Project;
use App\Models\SessionUpload;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class ProjectService{
    public function __construct(){}

    public function createOrGetProject($payload){
        $project = Project::firstWhere('project_ref', $payload['project_ref']);
        if(isset($project)) return $project;

        // create when project not exist
        $project = new Project();
        $project->project_ref = $payload['project_ref'];
        $project->project_name = $payload['project_name'];
        $project->latest_version = 0;
        $project->save();
        return $project;
    }

    public function updateProject($projectId, $payload){
        $project = Project::firstWhere('id', $projectId);
        if(empty($project)){ return false; }

        $project->update($payload);
        return $project;
    }

    // **
    public function getMatchingFiles($fileSessionId, $project){
        if(empty($project)) return [];
       
        $fileSession = SessionUpload::firstWhere('id', $fileSessionId);
        Log::info("fileSessionId". " ".json_encode($fileSession));

        if(empty($fileSession)){ return []; }
        if(empty($fileSession->oldname)){ return []; }

        //get fileName slug
        $fileName = explode(".", $fileSession->oldname)[0];
        $fileNameSplited = explode("-", $fileName);
        if(count($fileNameSplited) > 1){ unset($fileNameSplited[count($fileNameSplited) - 1]);} //remove last element
        $fileNameSlug = implode("-", $fileNameSplited);

        // todo add matching algo 
        Log::info("fileNameSlug"." ".$fileNameSlug);
        $filesMatching = SessionUpload::where('project_id', $project->id)
                                    // ->where('oldname', 'like', $fileNameSlug.'%')
                                    ->where('id', '!=', $fileSession->id)
                                    ->orderBy('oldname', 'desc')
                                    ->get();
        
        return $filesMatching->toArray();
    }
    public function getMatchingFilesByProjectId($payload){
        $projectRef = $payload['project_ref'];
        $uploadedFiles = $payload['uploaded_files'];
        $project = Project::firstWhere('project_ref', $projectRef);

        $filesSessionIds = collect($uploadedFiles)->pluck('id');
        $filesSessionsUpload = SessionUpload::whereIn('id', $filesSessionIds)->get();

        $filesSessionsUpload->map(function ($file) use ($project) {
            $file->matched_files = $this->getMatchingFiles($file->id, $project);
        });

        return ['project' => $project, 'uploaded_files' => $filesSessionsUpload];
    }

    // **
    public function addProjectSession($payload){
        DB::beginTransaction();
        try {
            $result = $this->linkFilesToProject($payload);
        } catch (Exception $e) {
            DB::rollBack();
            return false;
        }

        DB::commit();
        return $result;
    }
    public function linkFilesToProject($payload){
        $projectData = $payload['project'];
        $uploadedFiles = $payload['uploaded_files'];

        // create project 
        if(isset($projectData['project_ref'])){
            $filesSessionsUpload = collect([]);
            $project = $this->createOrGetProject($projectData);
            // add project to files sessions
            collect($uploadedFiles)->map(function ($file) use ($project, $filesSessionsUpload) {
                $sessionUpload = SessionUpload::where('id', $file["id"])->first();
                if(isset($sessionUpload)){
                    $sessionUpload->update([ 'project_id' => $project->id, 'before_upload_file_id' => $file["before_upload_file_id"] ]);
                    $filesSessionsUpload->push($sessionUpload);
                }
            });
            return ['project' => $project, 'uploaded_files' => $filesSessionsUpload];
        }else{
            $filesSessionIds = collect($uploadedFiles)->pluck('id');
            $filesSessionsUpload = SessionUpload::whereIn('id', $filesSessionIds)->get();
            // $filesSessionsUpload->map(function ($file) {
            //     $file->update(['project_id' => null, 'before_upload_file_id' => null ]);
            // });
            return ['project' => null, 'uploaded_files' => $filesSessionsUpload];
        }
    }


}
