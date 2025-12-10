<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'admin_id',
        'note',
        'is_visible_to_vendor',
        'is_visible_to_customer',
    ];

    protected $casts = [
        'is_visible_to_vendor' => 'boolean',
        'is_visible_to_customer' => 'boolean',
    ];

    /**
     * İlişkiler
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
