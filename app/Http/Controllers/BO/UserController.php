<?php

namespace App\Http\Controllers\BO;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Services\BO\UserService;
use App\Models\Account;

class UserController extends Controller{
    private $userBoService;

    // todo use dependency injection instead
    public function __construct()  {
        $this->userBoService = new UserService();
    }

    public function index(Request $request){
        // todo check user is logged
     
        $validatatedData = $request->all();
        $result = $this->userBoService->getListUsers($validatatedData);

        if(!$result) {
            return response()->json(['message' => 'Bad request.'], 400);
        }  
  
        return response()->json($result);
    }

    public function allUsers(Request $request){
        // todo check user is logged
        $result = Account::orderby("created_at", "desc")->get();
        return response()->json($result);
    }

    public function getListSessions(Request $request){
        // todo check user is logged
        $result = $this->userBoService->getListUploadSessions($request);

        if(!$result) {
            return response()->json(['message' => 'Bad request.'], 400);
        }  
  
        return response()->json($result);
    }
    public function reopenSession(Request $request) {
        $result = $this->userBoService
                    ->reopenSession($request->session_id);
		
        if(!$result) {
            return response()->json(['message' => 'Bad request.'], 400);
        }  

        return response()->json(["message" => "Success"]);
	}

    public function register(Request $request) {
	    // todo check user is logged
        // todo add validator rules 
        
		// $rules = array(
		// 	'username'=>'required|alpha|between:3,12|unique:tb_users',
		// 	'firstname'=>'required|alpha_num|min:2',
		// 	'lastname'=>'required|alpha_num|min:2',
		// 	'email'=>'required|email|unique:tb_users',
		// 	'password'=>'required|between:6,12|confirmed',
		// 	'password_confirmation'=>'required|between:6,12'
		// );	
		// $validator = Validator::make($request->all(), $rules);
        
    
        $result = $this->userBoService->registerUser($request);
		
        if(!$result) {
            return response()->json(['message' => 'Bad request.'], 400);
        }  

        return response()->json($result);
	}

    public function update(Request $request) {
        $result = $this->userBoService
                    ->updateUserProfile($request->user_id, $request->all());
		
        if(!$result) {
            return response()->json(['message' => 'Bad request.'], 400);
        }  

        return response()->json($result);
	}

    public function updatePassword(Request $request) {
        $result = $this->userBoService
                ->updatePassword($request->user_id, $request);
		
        if(!$result) {
            return response()->json(['message' => 'Bad request.'], 400);
        }  

        return response()->json($result);
	}

}
