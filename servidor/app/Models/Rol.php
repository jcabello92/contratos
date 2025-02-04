<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    public $timestamps = false;

    protected $connection = 'mariadb';
    protected $table = 'roles';
    protected $fillable = [
        'nombre',
        'estado'
    ];
}