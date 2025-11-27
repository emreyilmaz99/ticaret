<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminVendorAudit extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id', 'vendor_id', 'payout_id', 'action', 'old_values', 'new_values'
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function payout()
    {
        return $this->belongsTo(VendorPayout::class);
    }
}
