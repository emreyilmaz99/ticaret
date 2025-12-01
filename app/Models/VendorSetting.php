<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorSetting extends Model
{
    protected $fillable = [
        'vendor_id',
        'setting_key',
        'setting_value',
        'value_type',
    ];

    protected $casts = [
        'setting_value' => 'string',
    ];

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Get the typed value based on value_type
     */
    public function getTypedValueAttribute()
    {
        return match ($this->value_type) {
            'boolean' => filter_var($this->setting_value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $this->setting_value,
            'json' => json_decode($this->setting_value, true),
            default => $this->setting_value,
        };
    }

    /**
     * Set the value with automatic type detection
     */
    public function setTypedValue($value): void
    {
        if (is_bool($value)) {
            $this->value_type = 'boolean';
            $this->setting_value = $value ? '1' : '0';
        } elseif (is_int($value)) {
            $this->value_type = 'integer';
            $this->setting_value = (string) $value;
        } elseif (is_array($value)) {
            $this->value_type = 'json';
            $this->setting_value = json_encode($value);
        } else {
            $this->value_type = 'string';
            $this->setting_value = (string) $value;
        }
    }
}
