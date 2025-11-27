<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory;

    protected $table = 'media';

    protected $fillable = [
        'model_type','model_id','collection','path','url','meta','sort_order'
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function model()
    {
        return $this->morphTo();
    }
}
