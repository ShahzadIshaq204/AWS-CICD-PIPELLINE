<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Annotation extends Model  {
    protected $table = 'tb_annotations';
    protected $primaryKey = 'id';

    protected $fillable = [
        'session_upload_id',
        'type',
        'content',
        'x',
        'y'
    ];



    /**
     * Get the files.
     */
    public function files()
    {
        return $this->hasMany(AnnotationFile::class);
    }
}
