<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Account extends Model  {

    protected $table = 'tb_users';
    protected $primaryKey = 'id';

    protected $hidden = [
        'password',
        'remember_token',
        'reminder'
    ];

    protected $fillable = [
        'group_id',
        'username',
        'password',
        'email',
        'first_name',
        'last_name',
        'email',
        'avatar',
        'active',
    ];

    public function role(){
        return $this->belongsTo(Role::class ,"group_id", "group_id");
    }

}
