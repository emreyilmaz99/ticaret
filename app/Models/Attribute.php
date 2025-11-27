<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    use HasFactory;

    protected $fillable = ['name','slug','type','is_filterable','is_variation'];

    public function values()
    {
        return $this->hasMany(AttributeValue::class);
    }
}
