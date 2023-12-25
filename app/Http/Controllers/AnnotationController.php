<?php

namespace App\Http\Controllers;

use App\Models\Annotation;
use App\Models\AnnotationFile;
use App\Models\Project;
use App\Models\SessionUpload;
use Auth;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;
use Input;
use Redirect;
use Session;
use URL;
use Validator;

class AnnotationController extends Controller
{

    static $per_page = '10';
    public $module = 'session_upload';
    protected $layout = "layouts.main";
    protected $data = array();

    public function __construct()
    {

    }


    public function index(Request $request, string $sessionId)
    {

        $this->data['pages'] = 'layouts.default.template.annotations';
        $sessionUpload = SessionUpload::with('annotations','files','before_upload')->where('session_id', $sessionId)->get();
       
        $this->data['sessionId'] = $sessionId;
        $isSubmited=$this->isSubmited($sessionId);

        $this->data['isSubmited']=($isSubmited!="");
        $this->data['submitedDate']=$isSubmited;
        $this->data['sessionUpload'] = $sessionUpload;
        $this->data['project'] = null;

        $proof = array();
        if (count($sessionUpload) > 0) {
            $proof = $sessionUpload[0];
            $this->data['project'] = Project::firstWhere('id', $proof->project_id);
        }

        $this->data['proof'] = $proof;
        Log::info("SessionUpload " . json_encode($sessionUpload));
        return view('layouts.default.index', $this->data);
    }

    /**
     * @param Request $request
     * @return Application|Factory|RedirectResponse|View
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required',
            'sessionId'=>'required',
        ]);

        $data = [
            "status" => 0,
            "data" => array()
        ];
        $IsCreated=Annotation::create($request->all());
        $data = [
            "status" => ($IsCreated) ? 1 : 0,
            "currentData"=>$IsCreated,
            "data" => $this->getAllAccount($request->input('sessionId'))
        ];

        return $data;
        //return response()->json($this->getAllAccount());
    }

    public function update(Request $request, Annotation $annotation)
    {

        $request->validate([
            'id' => 'required',
            'content' => 'required',
        ]);

        $data = [
            "status" => 0,
            "data" => array()
        ];


        if ($request->input('id') != null and $request->input('sessionId') != null) {
            $sessionId = $request->input('sessionId');


            $IsUpdated = $annotation::where('id', $request->input('id'))->update($request->only(['content']));
            $data = [
                "status" => ($IsUpdated) ? 1 : 0,
                "data" => $this->getAllAccount($sessionId)
            ];


        }

        return response()->json(
            $data
        );


    }

    public function getAllAccount(string $id)
    {
        return SessionUpload::with('annotations','files', 'before_upload')->where('session_id', $id)->get();
    }

    public function updateDrawing(Request $request, Annotation $annotation)
    {

        $request->validate([
            'session_upload_id' => 'required',
            'content' => 'required',
        ]);

        $data = [
            "status" => 0,
            "data" => array(),
            "currentJson"=>""
        ];

        if ($request->input('sessionId') != null and $request->input('session_upload_id') != null) {
            $sessionId = $request->input('sessionId');

                $IsUpdated=$annotation::updateOrCreate(['session_upload_id'=>$request->input('session_upload_id'), 'type'=>2],$request->only('content') );
                $data = [
                    "status" => ($IsUpdated) ? 1 : 0,
                    "data" => $this->getAllAccount($sessionId),
                    "currentJson"=>$IsUpdated
                ];


            }



        return response()->json(
            $data
        );


    }

    /**
     * @param Request $request
     * @return Application|Factory|View
     */
    public function destroy(Request $request)
    {
        $data = [
            "status" => 0,
            "data" => array()
        ];
        if ($request->input('id') != null and $request->input('sessionId') != null) {

            $IsDeleted = Annotation::destroy($request->input('id'));
            $data = [
                "status" => $IsDeleted,
                "data" => $this->getAllAccount($request->input('sessionId'))
            ];


        }

        return response()->json(
            $data
        );

    }

    /**
     * @param Request $request
     * @return Application|JsonResponse|RedirectResponse|Redirector
     */
    public function addAnnotation(Request $request)
    {
        if (!Auth::check()) {
            return redirect('user/login');
        }
        $request->validate([
            'files' => 'required|max:4096'
        ]);


        /**
         * TODO:   return all data
         */
        return response()->json([]);

    }

    //whene the ressource route is implemented use show for get request

    /**
     * @param Request $request
     * @param string $id
     * @param string|null $session_id
     * @return Application|RedirectResponse|Redirector
     */
    public function deleteAnnotationFile(Request $request, string $id)
    {
        if (!Auth::check()) {
            return redirect('user/login');
        }

        $annotationFile = AnnotationFile::find($id);

        Storage::delete($annotationFile->file);

        return AnnotationFile::deleteFile($id);
    }

    public function show(Request $request, $sessionUploadId = null)
    {

        $annotations = SessionUpload::with('annotations')->where('session_id', $sessionUploadId)->get();
        return response()->json($annotations->toArray());
    }

    public function addFile(Request $request, $annotation_id=null)
    {

        if($request->ajax() == true )
        {
            header('Content-Type: application/json');
        }
        $request->validate([
            'files' => 'required|max:4096'
        ]);

        $FileUploader = new FileUploader('files', array(
            'maxSize' => null,
            'fileMaxSize' => null,
            'extensions' => ['jpg', 'png', 'jpeg','pdf','zip','docx','xlsx','doc','xls'],
            'required' => true,
            'uploadDir' => public_path() . '/uploads/proofs/annoationsfiles/',
            'title' => md5(uniqid()),
            'replace' => false,
            'listInput' => true,
            'files' => null
        ));

        // call to upload the files
        $data = $FileUploader->upload();
        $sessionUpload = new AnnotationFile();
        // change file's public data
        if (!empty($data['files'])) {
            $item = $data['files'][0];


            //save Into DB


            $sessionUpload->filePath = $item['name'];
            $sessionUpload->size = $item['size'];
            $sessionUpload->sizeT = $item['size2'];
            $sessionUpload->name = $item['title'];
            $sessionUpload->oldname = $item['old_name'];
            $sessionUpload->type = $item['type'];
            $sessionUpload->annotation_id = $annotation_id;
            $sessionUpload->save();

            // Add file thumbs 
            $orgFile=public_path().'/uploads/proofs/annoationsfiles/'.$item['name'] ;
            $destFile=public_path().'/uploads/proofs/annoationsfiles/thumbs/'.$item['name'] ;
            $extension = pathinfo($orgFile, PATHINFO_EXTENSION);
            \SiteHelpers::cropImage(243, 160, $orgFile ,  $extension,	$destFile )	;

            $session=\DB::table('tb_annotations')
                ->where('id', $annotation_id)
                ->first();
            $data['files'][0] = array(
                'title' => $item['title'],
                'name' => $item['name'],
                'size' => $item['size'],
                'size2' => $item['size2'],
                'sessionData'=>$this->getAllAccount($session->session_upload_id),
                'data' => array(
                    'listProps' => array(
                        'id' => $sessionUpload->id,
                    )
                )
            );
        }
        return response()->json(
            $data
        );

    }

    /**
     * @param Request $request
     * @param string $id
     * @param string|null $session_id
     * @return Application|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function deleteFile(Request $request, string $id)
    {
        //the ID is the file name not the unique id

        if (!Auth::check()) {
            return redirect('user/login');
        }

        if($request->ajax() == true )
        {
            header('Content-Type: application/json');
        }
        //get the file
        $sessionUpload = AnnotationFile::where('name',$id)->orWhere('filePath', $id)->first();

        //delete physical file
        $filePath=public_path().'/uploads/proofs/annoationsfiles/'.$sessionUpload->filePath;
        $thumbPath=public_path().'/uploads/proofs/annoationsfiles/thumbs/'.$sessionUpload->filePath;
        if(file_exists($filePath)) unlink($filePath);
        if(file_exists($thumbPath)) unlink($thumbPath);

        // delete from database
        return AnnotationFile::with('files')->where('id', $sessionUpload->id)->delete();
    }

    //TODO add model
    private function getSessionId($sessionId){
        $s=\DB::table('tb_session_upload')->where('session_id', $sessionId)->first();
        if(isset($s->id)) return $s->id;
        return 0;
    }
    public function submitModifications(Request $request){
        $request->validate([
            'sessionId' => 'required',

        ]);

        $a=\DB::table('tb_submited_sessions')
            ->updateOrInsert(['session_id'=>$this->getSessionId($request->input('sessionId'))], ['session_id'=>$this->getSessionId($request->input('sessionId'))]);

       //Send Email

        $to = 'jeff.alaoui@voxelworlds.com';

        $subject ="FeedBack Submited for project #".$request->input('sessionId');
        $data['subject'] =  $subject;
        $data['project'] =  $request->input('sessionId');
        $data['link']=\URL::to('annotations/getproject/'.$request->input('sessionId'));
        $data['email'] = $to;

        if(config('threedrenders.cnf_mail') =='swift')
        {

            \Mail::send('user.emails.submitfeedback', $data, function ($message) use ($data)  {

                $message->to($data['email'])->subject($data['subject']);
            });


        }  else {


            $message = view('user.emails.submitfeedback', $data);
            $headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
            $headers .= 'From: '.config('threedrenders.cnf_appname').' <'.config('threedrenders.cnf_email').'>' . "\r\n";
            mail($to, $subject, $message, $headers);
        }

        return Redirect()->back()->with('message','The link was sent <br> <small class=\'text-primary h6\'>'.\URL::to('annotations/getproject/'.$request->input('sessionId')).'</small>')->with('status','success')->with('title','<span class="text-primary h1">Thank You!</span>');
    }

    private function isSubmited($id){

        $a=\DB::table('tb_submited_sessions')
            ->where('session_id',$this->getSessionId($id))
        ->first();

        if(isset($a->id)) return $a->created_at;
        return "";
    }
}
