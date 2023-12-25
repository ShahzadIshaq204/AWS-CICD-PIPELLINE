<?php

namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Services\ProjectService;
use App\Models\Project;

class ProjectController extends Controller{
    private $projectService;

    // todo use dependency injection instead
    public function __construct()  {
        $this->projectService = new ProjectService();
    }

    public function index(){
        // todo check user is logged
        $result = Project::orderby("created_at", "desc")->get();
        return response()->json($result);
    }

    public function addProjectSession(Request $request){
        if($request->ajax() == true ){
            header('Content-Type: application/json');
        }

        // todo add validator 
        // todo add transactions   
        // todo check auth
        // if (!Auth::check()) { return redirect('user/login'); }
        // $sessionId = $validatatedData["session_id"];
        // if (!$sessionId && Session::get('session_id')) {  $sessionId = Session::get('session_id'); }

        $validatatedData = $request->all();
        $result = $this->projectService->addProjectSession($validatatedData);

        if(!$result) {
            return response()->json(['message' => 'Bad request.'], 404);
        }  
  
        return response()->json($result);
    }

    public function getMatchingUploadedFiles(Request $request){
        if($request->ajax() == true ){
            header('Content-Type: application/json');
        }

        // todo add validator 
        // todo add transactions   
        // todo check auth
        // if (!Auth::check()) { return redirect('user/login'); }
        // $sessionId = $validatatedData["session_id"];
        // if (!$sessionId && Session::get('session_id')) {  $sessionId = Session::get('session_id'); }

        $validatatedData = $request->all();
        $result = $this->projectService->getMatchingFilesByProjectId($validatatedData);
        return response()->json($result);
    }

}
