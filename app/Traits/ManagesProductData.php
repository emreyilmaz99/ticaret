<?php

namespace App\Traits;

use App\Repositories\Interfaces\TagRepositoryInterface;
use App\Repositories\Interfaces\ProductPhotoRepositoryInterface;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

trait ManagesProductData
{
    /**
     * Generate unique slug for product
     */
    protected function generateUniqueSlug(string $name, ?string $customSlug = null): string
    {
        $baseSlug = $customSlug ? Str::slug($customSlug) : Str::slug($name);
        $slug = $baseSlug;
        $suffix = 1;
        
        while ($this->repo->existsBySlug($slug)) {
            $slug = $baseSlug . '-' . $suffix;
            $suffix++;
        }
        
        return $slug;
    }

    /**
     * Handle image uploads and create photo records
     */
    protected function handleImageUploads(string $productId, array $images, string $productName): void
    {
        foreach ($images as $file) {
            if (!$file) continue;
            
            $path = $file->store('products', 'public');
            
            $this->photoRepo->create([
                'product_id' => $productId,
                'path' => $path,
                'url' => Storage::url($path),
                'alt' => $productName,
            ]);
        }
    }

    /**
     * Sync tags for product (handles both IDs and names)
     */
    protected function syncProductTags($product, $tags): void
    {
        if (empty($tags)) {
            return;
        }

        // Convert string to array
        if (is_string($tags)) {
            $tags = array_map('trim', explode(',', $tags));
        }

        if (!is_array($tags)) {
            return;
        }

        $tagIds = [];
        
        foreach ($tags as $tag) {
            $tag = trim($tag);
            if (!$tag) continue;

            // Handle numeric ID
            if (is_numeric($tag)) {
                $tagModel = $this->tagRepo->findById($tag);
                if ($tagModel) {
                    $tagIds[] = $tagModel->id;
                }
                continue;
            }

            // Handle tag name
            $name = (string) $tag;
            $slug = Str::slug($name);
            $tagModel = $this->tagRepo->firstOrCreateBySlug($slug, ['name' => $name]);
            $tagIds[] = $tagModel->id;
        }

        if (!empty($tagIds)) {
            $this->repo->syncTags($product->id, $tagIds);
        }
    }

    /**
     * Validate vendor ownership
     */
    protected function validateVendorOwnership($product, $vendor): void
    {
        if ($product->vendor_id !== $vendor->id) {
            throw new \Exception('Bu ürün size ait değil');
        }
    }

    /**
     * Extract variant data from request, removing null values
     */
    protected function extractVariantData(array $variantInput): array
    {
        $data = [
            'sku' => $variantInput['sku'] ?? null,
            'title' => $variantInput['title'] ?? null,
            'unit_id' => $variantInput['unit_id'] ?? null,
            'price' => $variantInput['price'] ?? null,
            'stock' => isset($variantInput['stock']) ? (int)$variantInput['stock'] : 0,
            'weight' => $variantInput['weight'] ?? null,
            'length' => $variantInput['length'] ?? null,
            'width' => $variantInput['width'] ?? null,
            'height' => $variantInput['height'] ?? null,
            'metadata' => $variantInput['metadata'] ?? null,
        ];

        return array_filter($data, fn($val) => $val !== null);
    }

    /**
     * Create variants for product
     */
    protected function createVariants(string $productId, array $variants): void
    {
        foreach ($variants as $variantData) {
            $data = $this->extractVariantData($variantData);
            $data['product_id'] = $productId;
            $this->variantRepo->create($data);
        }
    }

    /**
     * Create default variant for simple product
     */
    protected function createDefaultVariant(string $productId, array $defaultData): void
    {
        $variantData = [
            'product_id' => $productId,
            'title' => 'Default',
            'sku' => $defaultData['sku'] ?? null,
            'price' => $defaultData['price'] ?? null,
            'stock' => isset($defaultData['stock']) ? (int)$defaultData['stock'] : 0,
            'weight' => $defaultData['weight'] ?? null,
            'length' => $defaultData['length'] ?? null,
            'width' => $defaultData['width'] ?? null,
            'height' => $defaultData['height'] ?? null,
            'unit_id' => $defaultData['unit_id'] ?? null,
        ];

        $variantData = array_filter($variantData, fn($val) => $val !== null);
        $this->variantRepo->create($variantData);
    }

    /**
     * Update simple product variant (price, stock, etc)
     */
    protected function updateSimpleProductVariant($product, array $updateData): void
    {
        $variantData = [];
        
        if (isset($updateData['price'])) $variantData['price'] = $updateData['price'];
        if (isset($updateData['stock'])) $variantData['stock'] = (int)$updateData['stock'];
        if (isset($updateData['sku'])) $variantData['sku'] = $updateData['sku'];
        if (isset($updateData['unit_id'])) $variantData['unit_id'] = $updateData['unit_id'];

        if (empty($variantData)) {
            return;
        }

        $variant = $this->variantRepo->getFirstForProduct($product->id);
        
        if ($variant) {
            $this->variantRepo->update($variant->id, $variantData);
        } else {
            // Create default variant if missing
            $variantData['product_id'] = $product->id;
            $variantData['title'] = 'Default';
            $this->variantRepo->create($variantData);
        }
    }

    /**
     * Update or create variants for product
     */
    protected function updateVariants($product, array $variants): void
    {
        foreach ($variants as $variantInput) {
            $variantData = $this->extractVariantData($variantInput);

            if (isset($variantInput['id'])) {
                // Update existing variant
                $existing = $this->variantRepo->findById($variantInput['id']);
                if ($existing && $existing->product_id == $product->id) {
                    $this->variantRepo->update($existing->id, $variantData);
                }
            } else {
                // Create new variant
                $variantData['product_id'] = $product->id;
                $this->variantRepo->create($variantData);
            }
        }
    }

    /**
     * Sanitize category_id (convert empty string to null)
     */
    protected function sanitizeCategoryId(?string $categoryId): ?int
    {
        if ($categoryId === '' || $categoryId === null) {
            return null;
        }
        
        return (int) $categoryId;
    }
}
