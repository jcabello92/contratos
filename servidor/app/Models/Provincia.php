<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Provincia extends Model
{
    public $timestamps = false;

    protected $connection = 'mariadb';
    protected $table = 'provincias';
    protected $fillable = [
        'nombre',
        'region'
    ];
}