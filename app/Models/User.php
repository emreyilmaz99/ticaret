<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'identity_number',
        'avatar',
        'birth_date',
        'gender',
        'is_active',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'birth_date' => 'date',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Get all addresses for the user.
     */
    public function addresses()
    {
        return $this->hasMany(UserAddress::class);
    }

    /**
     * Get the default address for the user.
     */
    public function defaultAddress()
    {
        return $this->hasOne(UserAddress::class)->where('is_default', true);
    }

    /**
     * Get the avatar URL.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if (!$this->avatar) {
            return null;
        }
        
        if (str_starts_with($this->avatar, 'http')) {
            return $this->avatar;
        }
        
        return asset('storage/' . $this->avatar);
    }

    /**
     * Kullanıcının favorileri
     */
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * Kullanıcının favori ürünleri
     */
    public function favoriteProducts()
    {
        return $this->belongsToMany(Product::class, 'favorites')->withTimestamps();
    }

    /**
     * Ürünün favorilerde olup olmadığını kontrol et
     */
    public function hasFavorited(string $productId): bool
    {
        return $this->favorites()->where('product_id', $productId)->exists();
    }

    /**
     * Kullanıcının sepeti
     */
    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    /**
     * Kullanıcının siparişleri
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
