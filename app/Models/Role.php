<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Role extends Model  {

    protected $table = 'tb_groups';
    protected $primaryKey = 'group_id';

    protected $fillable = [
        'name',
        "description"
    ];

}
