<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BannedWord extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'word',
        'is_regex',
        'pattern',
    ];

    protected $casts = [
        'is_regex' => 'boolean',
    ];
}
