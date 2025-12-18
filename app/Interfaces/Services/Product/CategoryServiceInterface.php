<?php

namespace App\Interfaces\Services\Product;

use App\Core\ServiceResponse;

interface CategoryServiceInterface
{
    /**
     * List public categories
     */
    public function listPublic(array $filters = []): ServiceResponse;

    /**
     * Get category tree
     */
    public function getTree(): ServiceResponse;

    /**
     * Find category by slug
     */
    public function findBySlug(string $slug): ServiceResponse;

    /**
     * List categories for vendor
     */
    public function listForVendor($vendor, int $perPage = 15): ServiceResponse;

    /**
     * Create category for vendor
     */
    public function createCategory($vendor, array $data): ServiceResponse;

    /**
     * Update category for vendor
     */
    public function updateCategory($vendor, $id, array $data): ServiceResponse;

    /**
     * Delete category for vendor
     */
    public function deleteCategory($vendor, $id): ServiceResponse;

    /**
     * Toggle category active status
     */
    public function toggleActive($vendor, $id): ServiceResponse;
}
