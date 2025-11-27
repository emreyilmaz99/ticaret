<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Simple admin pages for login and dashboard (uses API endpoints)
Route::get('/admin/login', function () {
    return view('admin.login');
})->name('admin.login');

Route::get('/admin/dashboard', function () {
    return view('admin.dashboard');
})->name('admin.dashboard');
