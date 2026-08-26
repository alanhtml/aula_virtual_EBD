<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['status' => 'online', 'message' => 'Aula Virtual API Working']);
});
