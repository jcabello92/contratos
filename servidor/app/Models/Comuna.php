<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comuna extends Model
{
    public $timestamps = false;

    protected $connection = 'mariadb';
    protected $table = 'comunas';
    protected $fillable = [
        'nombre',
        'provincia'
    ];
}