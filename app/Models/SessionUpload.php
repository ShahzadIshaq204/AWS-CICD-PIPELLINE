<?php namespace App\Models;

use Illuminate\Contracts\Session\Session;
use Illuminate\Database\Eloquent\Model;

class SessionUpload extends Model  {

    protected $table = 'tb_session_upload';
    protected $primaryKey = 'id';

    protected $fillable = [
        'file_path',
        'session_id',
        'project_id',
        'version',
        'before_upload_file_id',
    ];

    public static function getFilesBySession($id){
        $files=\DB::table('tb_session_upload')
            ->where('session_id', $id)
            ->get();

        return $files;
    }




    public static function getFile($file, $session){
        $files=\DB::table('tb_session_upload')
            ->where(function ($query) use ($file){
                $query->where('name', $file)
                    ->orWhere('filePath', $file);
            })
            ->where('session_id', $session)
            ->first();

        return $files;
    }

    /**
     * Get the annotations from session upload file.
     */
    public function annotations()
    {
        return $this->hasMany(Annotation::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class ,"project_id", "id");
    }

    public function before_upload()
    {
        return $this->belongsTo(SessionUpload::class ,"before_upload_file_id", "id");
    }

    public function author()
    {
        return $this->belongsTo(Account::class ,"userId", "id");
    }

    //before_upload_file_id

    public function files()
    {
        return $this->hasManyThrough(AnnotationFile::class,Annotation::class);
    }
}
