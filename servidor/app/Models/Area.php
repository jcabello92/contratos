<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    public $timestamps = false;

    protected $connection = 'mariadb';
    protected $table = 'areas';
    protected $fillable = [
        'nombre',
        'area',
        'estado'
    ];
}