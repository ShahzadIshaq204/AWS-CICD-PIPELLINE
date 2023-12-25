<?php
//-------------------------------------------------------------------------
/* Start Module Routes */


Route::get('threedrenders/module','ModuleController@index');
Route::get('threedrenders/module/create','ModuleController@getCreate');
Route::get('threedrenders/module/rebuild/{any}','ModuleController@getRebuild');
Route::get('threedrenders/module/build/{any}','ModuleController@getBuild');
Route::get('threedrenders/module/config/{any}','ModuleController@getConfig');
Route::get('threedrenders/module/sql/{any}','ModuleController@getSql');
Route::get('threedrenders/module/table/{any}','ModuleController@getTable');
Route::get('threedrenders/module/form/{any}','ModuleController@getForm');
Route::get('threedrenders/module/formdesign/{any}','ModuleController@getFormdesign');
Route::get('threedrenders/module/subform/{any}','ModuleController@getSubform');
Route::get('threedrenders/module/subformremove/{any}','ModuleController@getSubformremove');
Route::get('threedrenders/module/sub/{any}','ModuleController@getSub');
Route::get('threedrenders/module/removesub','ModuleController@getRemovesub');
Route::get('threedrenders/module/permission/{any}','ModuleController@getPermission');
Route::get('threedrenders/module/source/{any}','ModuleController@getSource');
Route::get('threedrenders/module/combotable','ModuleController@getCombotable');
Route::get('threedrenders/module/combotablefield','ModuleController@getCombotablefield');
Route::get('threedrenders/module/editform/{any?}','ModuleController@getEditform');
Route::get('threedrenders/module/destroy/{any?}','ModuleController@getDestroy');
Route::get('threedrenders/module/conn/{any?}','ModuleController@getConn');
Route::get('threedrenders/module/code/{any?}','ModuleController@getCode');
Route::get('threedrenders/module/duplicate/{any?}','ModuleController@getDuplicate');

/* POST METHODE */
Route::post('threedrenders/module/create','ModuleController@postCreate');
Route::post('threedrenders/module/saveconfig/{any}','ModuleController@postSaveconfig');
Route::post('threedrenders/module/savesetting/{any}','ModuleController@postSavesetting');
Route::post('threedrenders/module/savesql/{any}','ModuleController@postSavesql');
Route::post('threedrenders/module/savetable/{any}','ModuleController@postSavetable');
Route::post('threedrenders/module/saveform/{any}','ModuleController@postSaveForm');
Route::post('threedrenders/module/savesubform/{any}','ModuleController@postSavesubform');
Route::post('threedrenders/module/formdesign/{any}','ModuleController@postFormdesign');
Route::post('threedrenders/module/savepermission/{any}','ModuleController@postSavePermission');
Route::post('threedrenders/module/savesub/{any}','ModuleController@postSaveSub');
Route::post('threedrenders/module/dobuild/{any}','ModuleController@postDobuild');
Route::post('threedrenders/module/source/{any}','ModuleController@postSource');
Route::post('threedrenders/module/install','ModuleController@postInstall');
Route::post('threedrenders/module/package','ModuleController@postPackage');
Route::post('threedrenders/module/dopackage','ModuleController@postDopackage');
Route::post('threedrenders/module/saveformfield/{any?}','ModuleController@postSaveformfield');
Route::post('threedrenders/module/conn/{any?}','ModuleController@postConn');
Route::post('threedrenders/module/code/{any?}','ModuleController@postCode');
Route::post('threedrenders/module/duplicate/{any?}','ModuleController@postDuplicate');



/* End  Module Routes */
//-------------------------------------------------------------------------

/* Start  Code Routes */
Route::get('threedrenders/code','CodeController@index');
Route::get('threedrenders/code/edit','CodeController@getEdit');
Route::post('threedrenders/code/source','CodeController@PostSource');
Route::post('threedrenders/code/save','CodeController@PostSave');

Route::get('threedrenders/config/email','ConfigController@getEmail');
Route::get('threedrenders/config/security','ConfigController@getSecurity');
Route::post('threedrenders/code/source/:any','ConfigController@postSource');
/* End  Code Routes */

//-------------------------------------------------------------------------
/* Start  Config Routes */
Route::get('threedrenders/config','ConfigController@getIndex');
Route::get('threedrenders/config/email','ConfigController@getEmail');
Route::get('threedrenders/config/security','ConfigController@getSecurity');
Route::get('threedrenders/config/translation','ConfigController@getTranslation');
Route::get('threedrenders/config/log','ConfigController@getLog');
Route::get('threedrenders/config/clearlog','ConfigController@getClearlog');
Route::get('threedrenders/config/addtranslation','ConfigController@getAddtranslation');
Route::get('threedrenders/config/removetranslation/{any}','ConfigController@getRemovetranslation');
// POST METHOD
Route::post('threedrenders/config/save','ConfigController@postSave');
Route::post('threedrenders/config/email','ConfigController@postEmail');
Route::post('threedrenders/config/login','ConfigController@postLogin');
Route::post('threedrenders/config/email','ConfigController@postEmail');
Route::post('threedrenders/config/addtranslation','ConfigController@postAddtranslation');
Route::post('threedrenders/config/savetranslation','ConfigController@postSavetranslation');
/* End  Config Routes */

//-------------------------------------------------------------------------
/* Start  Menu Routes */
Route::get('threedrenders/menu/','MenuController@getIndex');
Route::get('threedrenders/menu/index/{any?}','MenuController@getIndex');
Route::get('threedrenders/menu/destroy/{any?}','MenuController@getDestroy');
Route::get('threedrenders/menu/icon','MenuController@getIcons');

Route::post('threedrenders/menu/save','MenuController@postSave');
Route::post('threedrenders/menu/saveorder','MenuController@postSaveorder');
/* End  Config Routes */

//-------------------------------------------------------------------------
/* Start  Tables Routes */
Route::get('threedrenders/tables','TablesController@index');
Route::get('threedrenders/tables/tableconfig/{any}','TablesController@getTableconfig');
Route::get('threedrenders/tables/mysqleditor','TablesController@getMysqleditor');
Route::get('threedrenders/tables/tableconfig','TablesController@getTableconfig');
Route::get('threedrenders/tables/tablefieldedit/{any}','TablesController@getTablefieldedit');
Route::get('threedrenders/tables/tablefieldremove/{id?}/{id2?}','TablesController@getTablefieldremove');
// POST METHOD
Route::post('threedrenders/tables/tableremove','TablesController@postTableremove');
Route::post('threedrenders/tables/tableinfo/{any}','TablesController@postTableinfo');
Route::post('threedrenders/tables/mysqleditor','TablesController@postMysqleditor');
Route::post('threedrenders/tables/tablefieldsave/{any?}','TablesController@postTablefieldsave');
Route::post('threedrenders/tables/tables','TablesController@postTables');
/* End  Tables Routes */


//-------------------------------------------------------------------------
/* Start Logs Routes */
// -- Get Method --
Route::resource('threedrenders/rac','RacController');
Route::get('threedrenders/rac/show/{any}','RacController@getShow');
Route::get('threedrenders/rac/update/{any?}','RacController@getUpdate');
Route::get('threedrenders/rac/comboselect','RacController@getComboselect');
Route::get('threedrenders/rac/download','RacController@getDownload');
Route::get('threedrenders/rac/search','RacController@getSearch');

// -- Post Method --
Route::post('threedrenders/rac/save','RacController@postSave');
Route::post('threedrenders/rac/filter','RacController@postFilter');
Route::post('threedrenders/rac/delete/{any?}','RacController@postDelete');
/* End  Tables Routes */

Route::resource('threedrenders/form','FormController');
Route::resource('threedrenders/server','ServerController');

/* End  Tables Routes */