<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Project extends Model  {

    protected $table = 'tb_projects';
    protected $primaryKey = 'id';

    protected $fillable = [
        'project_ref',
        'project_name',
        'latest_version',
    ];
}
