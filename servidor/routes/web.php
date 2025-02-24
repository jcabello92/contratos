<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/enviar', function () {
    $response = Http::get('http://localhost:8000/api/documentos/id/4');
});
