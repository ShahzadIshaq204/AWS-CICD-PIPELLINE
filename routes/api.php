<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// todo add auth middleware 
Route::get('bo/projects', 'ProjectController@index');
Route::get('bo/users', 'BO\UserController@index');
Route::post('bo/users/edit', 'BO\UserController@update');
Route::post('bo/users', 'BO\UserController@register');
Route::get('bo/sessions', 'BO\UserController@getListSessions');
Route::post('bo/reopen-session', 'BO\UserController@reopenSession');
Route::get('bo/all-users', 'BO\UserController@allUsers');
Route::post('bo/password/update', 'BO\UserController@updatePassword');


Route::middleware('auth:api')->get('/user', function (Request $request) {
    //return $request->user();

});
Route::get('services/info', 'Services\SiteController@info');

Route::get('services/cruds', 'Services\SiteController@cruds');
Route::group(['middleware' => 'threedrendersauth'], function () {
	Route::get('services/profile', 'Services\SiteController@profile');
	Route::post('services/saveprofile', 'Services\SiteController@Saveprofile');
	Route::get('services/notification', 'Services\SiteController@notification');
	include('services.php');
});

