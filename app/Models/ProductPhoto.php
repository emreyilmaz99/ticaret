<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductPhoto extends Model
{
    use HasFactory;

    protected $table = 'product_photos';

    protected $fillable = [
        'product_id', 'path', 'url', 'alt', 'sort_order'
    ];

    protected $appends = ['file_path'];

    public function getFilePathAttribute()
    {
        // Eğer url tam URL ise direkt döndür
        if ($this->url && filter_var($this->url, FILTER_VALIDATE_URL)) {
            return $this->url;
        }
        
        // Eğer url slash ile başlıyorsa (örn: /storage/...), URL base'i ekle
        if ($this->url && str_starts_with($this->url, '/')) {
            return url($this->url);
        }
        
        // path varsa storage'a ekle
        if ($this->path) {
            return url('storage/' . $this->path);
        }
        
        return null;
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
