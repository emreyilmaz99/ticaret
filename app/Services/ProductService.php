<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Vendor;
use App\Models\Tag;
use App\Models\ProductVariant;
use App\Models\Media;
use App\Repositories\ProductRepository;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    protected ProductRepository $repo;

    public function __construct(ProductRepository $repo)
    {
        $this->repo = $repo;
    }

    public function createForVendor(Vendor $vendor, array $data): Product
    {
        // ensure vendor ownership
        $data['vendor_id'] = $vendor->id;
        // vendor-created products default to pending
        $data['status'] = $data['status'] ?? 'pending';

        // extract relations
        $tags = $data['tags'] ?? null;
        unset($data['tags']);
        $variants = $data['variants'] ?? null;
        unset($data['variants']);
        $images = $data['images'] ?? null;
        unset($data['images']);

        // create product
        // ensure slug exists and is unique
        $baseSlug = isset($data['slug']) && $data['slug'] ? Str::slug($data['slug']) : Str::slug($data['name'] ?? 'product');
        $slug = $baseSlug;
        $suf = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $suf;
            $suf++;
        }
        $data['slug'] = $slug;

        $product = $this->repo->create($data);

        // attach tags (accept array of ids or names)
        if (! empty($tags) && is_array($tags)) {
            $tagIds = [];
            foreach ($tags as $t) {
                if (is_numeric($t)) {
                    $tag = Tag::find($t);
                    if ($tag) $tagIds[] = $tag->id;
                    continue;
                }
                $name = (string) $t;
                $slug = Str::slug($name);
                $tag = Tag::firstOrCreate(['slug' => $slug], ['name' => $name]);
                $tagIds[] = $tag->id;
            }
            if (! empty($tagIds)) {
                $product->tags()->sync($tagIds);
            }
        }

        // create variants
        if (! empty($variants) && is_array($variants)) {
            foreach ($variants as $v) {
                $vData = array_filter([
                    'sku' => $v['sku'] ?? null,
                    'title' => $v['title'] ?? null,
                    'unit_id' => $v['unit_id'] ?? null,
                    'price' => $v['price'] ?? null,
                    'stock' => isset($v['stock']) ? (int)$v['stock'] : 0,
                    'weight' => $v['weight'] ?? null,
                    'length' => $v['length'] ?? null,
                    'width' => $v['width'] ?? null,
                    'height' => $v['height'] ?? null,
                    'metadata' => $v['metadata'] ?? null,
                ], function ($val) { return $val !== null; });
                $vData['product_id'] = $product->id;
                ProductVariant::create($vData);
            }
        }

        // store images and create media records
        if (! empty($images) && is_array($images)) {
            foreach ($images as $file) {
                if (! $file) continue;
                $path = $file->store('products', 'public');
                $url = Storage::url($path);
                Media::create([
                    'model_type' => Product::class,
                    'model_id' => $product->id,
                    'collection' => 'images',
                    'path' => $path,
                    'url' => $url,
                ]);
            }
        }

        return $product->refresh();
    }

    public function updateForVendor(Vendor $vendor, Product $product, array $data): Product
    {
        // prevent changing vendor_id
        unset($data['vendor_id']);
        return $this->repo->update($product, $data);
    }

    public function listForVendor(Vendor $vendor, int $perPage = 15)
    {
        return $this->repo->listForVendor($vendor->id, $perPage);
    }

    public function deleteForVendor(Vendor $vendor, Product $product): void
    {
        $this->repo->delete($product);
    }
}
