<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\SessionUpload;
use Auth;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\View\View;
use Input;
use Redirect;
use Session;
use Symfony\Component\Mime\Header\HeaderInterface;
use URL;
use Validator;

class SessionUploadController extends Controller
{

    static $per_page = '10';
    public $module = 'session_upload';
    protected $layout = "layouts.main";
    protected $data = array();

    public function __construct()
    {
        parent::__construct();
        $this->model = new SessionUpload();

        //  $this->info = $this->model->makeInfo( $this->module);
        $this->data = array(
            'pageTitle' => 'Proofs Upload',
            'pageNote' => '',
            'pageModule' => 'session_upload',
            'return' => self::returnUrl()

        );

    }

    public function getLoggedUser(Request $request){
        if (!Auth::check()) return null;
        return Account::with("role")->firstWhere("id", auth()->user()->id)->toArray();
    }

    /**
     * @param Request $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
	public function createSession( Request $request )
	{
        if(!\Auth::check()) return Redirect(''); //TODO: test connexion

        if (!$request->session()->has('session_id')) {
	        $request->session()->put('session_id', Str::uuid());
        }
	    $this->data['session_id'] = $request->session()->get('session_id');
        $this->data['pages'] = 'layouts.default.template.upload';
        $this->data['isDark'] =true;
        $page = 'layouts.default.index';
        return view( $page, $this->data);
	}

    /**
     * @param Request $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
	public function deleteSession(Request $request)
	{
        if(!\Auth::check()) return Redirect(''); //TODO: test connexion
        if ($request->session()->has('session_id')) {
            $request->session()->forget('session_id');
            unset($this->data['session_id']);
        }
		return Redirect('account');
	}

    /**
     * @param Request $request
     * @return Application|\Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function addFile(Request $request)
    {
        if (!Auth::check()) {
            return redirect('user/login');
        }
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
            'extensions' => ['jpg', 'png', 'jpeg'],
            'required' => true,
            'uploadDir' => public_path() . '/uploads/proofs/',
            'title' => md5(uniqid()),
            'replace' => false,
            'listInput' => true,
            'files' => null
        ));

        // call to upload the files
        $data = $FileUploader->upload();
        $sessionUpload = new SessionUpload();
        // change file's public data
        if (!empty($data['files'])) {
            $item = $data['files'][0];

            //save Into DB
            $sessionId = $request->session()->get('session_id');

            $sessionUpload->filePath = $item['name'];
            $sessionUpload->size = $item['size'];
            $sessionUpload->sizeT = $item['size2'];
            $sessionUpload->name = $item['title'];
            $sessionUpload->oldname = $item['old_name'];
            $sessionUpload->type = $item['type'];
            $sessionUpload->session_id = $sessionId;

            $sessionUpload->userId = Session::get('uid');
            $sessionUpload->save();

            // Add file thumbs 
            $orgFile=public_path().'/uploads/proofs/'.$item['name'] ;
            $destFile=public_path().'/uploads/proofs/thumbs/'.$item['name'] ;
            $extension = pathinfo($orgFile, PATHINFO_EXTENSION);
            \SiteHelpers::cropImage(243, 160, $orgFile ,  $extension,	$destFile )	;


            $data['files'][0] = array(
                'id' => $sessionUpload->id,
                'project_id' => $sessionUpload->project_id,
                'before_upload_file_id' => $sessionUpload->before_upload_file_id,
                'version' => $sessionUpload->version,
                'filename' => $sessionUpload->oldname,
                'title' => $item['title'],
                'name' => $item['name'],
                'size' => $item['size'],
                'size2' => $item['size2'],
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
    public function deleteFile(Request $request, string $id, string $session_id = null)
    {
        //the ID is the file name not the unique id

        if (!Auth::check()) {
            return redirect('user/login');
        }
        if (!$session_id) {
            $session_id = Session::get('session_id');
        }
        if($request->ajax() == true )
        {
            header('Content-Type: application/json');
        }
        //get the file
        $sessionUpload = SessionUpload::getFile($id, $session_id);

        //delete physical file
        $filePath=public_path().'/uploads/proofs/'.$sessionUpload->filePath;
        $thumbPath=public_path().'/uploads/proofs/thumbs/'.$sessionUpload->filePath;
        if(file_exists($filePath)) unlink($filePath);
        if(file_exists($thumbPath)) unlink($thumbPath);

        // delete from database
        return SessionUpload::destroy($sessionUpload->id);
    }


    public function getFilesList(Request $request, $sessionId = null)
    {
        if($request->ajax() == true )
        {
            header('Content-Type: application/json');
        }
        if (!Auth::check()) {
            return redirect('user/login');
        }
        $preloadedFiles = array();
        if (!$sessionId && Session::get('session_id')) {
            $sessionId = Session::get('session_id');
        }
        $rows = SessionUpload::getFilesBySession($sessionId);
        foreach ($rows as $row) {
            $preloadedFiles[] = array(
                'id' => $row->id,
                'project_id' => $row->project_id,
                'before_upload_file_id' => $row->before_upload_file_id,
                'version' => $row->version,
                'filename' => $row->oldname,
                'name' => $row->name,
                'type' => $row->type,
                'size' => $row->size,
                'extension'=>'jpg',
                'file' => URL::to('uploads/proofs/thumbs/' . $row->filePath),
                'data' => array(
                    'readerForce' => true,
                    'url' => URL::to('uploads/proofs/thumbs/' . $row->filePath),
                    'date' => $row->created_at,
                    'isMain' => 0,
                    'listProps' => array(
                        'id' => $row->id,
                    )
                ),
            );
        }
        return response()->json($preloadedFiles);
    }
}
