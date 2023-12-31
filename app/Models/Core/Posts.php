<?php namespace App\Models\Core;

use App\Models\Threedrenders;
use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class posts extends Threedrenders  {
	
	protected $table = 'tb_pages';
	protected $primaryKey = 'pageID';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  
		 SELECT tb_pages.* , COUNT(commentID) AS comments FROM tb_pages 
		 LEFT JOIN tb_comments ON tb_comments.pageID = tb_pages.pageID
		";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE tb_pages.pageID IS NOT NULL ";
	}
	
	public static function queryGroup(){
		return " GROUP BY tb_pages.pageID ";
	}
	
	 public static function categories( ) {

        return $categories = \DB::table('tb_categories')
                            ->select('tb_categories.*', \DB::raw('COUNT(pageID) AS total'))
                            ->leftJoin('tb_pages','tb_pages.cid','tb_categories.cid')
                            ->groupBy('tb_categories.cid')
                            ->get();
    }
}
