<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    public $timestamps = false;

    protected $connection = 'mariadb';
    protected $table = 'regiones';
    protected $fillable = [
        'nombre',
        'abreviatura',
        'capital'
    ];
}