<?php

namespace App\Http\Services\BO;

use App\User;
use App\Models\Account;
use App\Models\SessionUpload;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserService{
    public function __construct(){}

    public function getListUsers($query){
        // todo add filter , ordering ...
        $users = Account::orderby("created_at", "desc")->paginate(10); 
        return $users;
    }
    
    // todo move to his own services
    public function reopenSession($sessionId){
        DB::table('tb_submited_sessions')
            ->where('session_id', $sessionId)->delete();
        return true;
    }
    public function getListUploadSessions($request){
        $sessionsUpload = SessionUpload::distinct('id');

        // ** filter
        if ($request->has('project_id') && $request->input('project_id')) {
            $sessionsUpload = $sessionsUpload->where("project_id", $request->input('project_id'));
        }
        if ($request->has('user_id') && $request->input('user_id')) {
            $sessionsUpload = $sessionsUpload->where("userId", $request->input('user_id'));
        }
        if ($request->has('submited') && $request->input('submited')) {
            $submitedSessionsIds = DB::table('tb_submited_sessions')->get()->pluck('session_id');
            if($request->input('submited') == "1")
                $sessionsUpload = $sessionsUpload->whereIn("id", $submitedSessionsIds);
            if($request->input('submited') == "-1")
                $sessionsUpload = $sessionsUpload->whereNotIn("id", $submitedSessionsIds); 
        }

        // ** order by              
        if ($request->has('order_with') && $request->has('order_by')) {
            $orderByField = $request->input('order_with');
            $orderBy = $request->input('order_by');
            $sessionsUpload = $sessionsUpload->orderby($orderByField, $orderBy);
        }else{
            $sessionsUpload = $sessionsUpload->orderby("created_at", "desc");
        }  
        
        // ** add join fields and paginate
        $sessionsUpload = $sessionsUpload
            ->groupBy('session_id')
            ->with(["project", "author"])->paginate(10); //->take(10)->get();

        // ** add extra fields 
        $sessionsUpload->map(function ($session) use ($request) {
            $session->files = SessionUpload::where('session_id', $session->session_id)
                                    ->with(["before_upload"])->get(); 

            if($request->input('submited') == "-1"){
                $session->submited_session = null;
            }else{
                $session->submited_session = DB::table('tb_submited_sessions')
                    ->where('session_id', $session->id)->get();  
            }
            $session->session_url = env('APP_URL')."/annotations/getproject/".$session->session_id;                      
        });

        return $sessionsUpload;
    }

    public function updateUserProfile($userId, $payload){
        $user = Account::firstWhere('id', $userId);
        if(empty($user)) return false;

        $user->update($payload);
        return $user;
    }

    public function registerUser($request){
        // todo pass validated data instead

        $code = rand(10000,10000000);			
        $user = new User();
        $user->active = 1; 
        $user->activation = $code;
        $user->username = $request->input('username');
        $user->group_id = $request->input('group_id');
        $user->email = trim($request->input('email'));
        $user->last_name = $request->input('lastname');
        $user->first_name = $request->input('firstname');
        $user->password = Hash::make($request->input('password'));
        $user->save();
	
        return $user;
    }


    public function updatePassword($userId, $request){
        $user = Account::firstWhere('id', $userId);
        if(empty($user)) return false;

        $user->update(["password" => Hash::make($request->password)]);
        return $user;
    }
}
