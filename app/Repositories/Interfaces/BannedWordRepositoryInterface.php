<?php

namespace App\Repositories\Interfaces;

use App\Models\BannedWord;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface BannedWordRepositoryInterface
{
    /**
     * Get filtered banned words with pagination
     */
    public function getFiltered(array $filters): LengthAwarePaginator|Collection;

    /**
     * Create new banned word
     */
    public function create(array $data): BannedWord;

    /**
     * Find banned word by ID
     */
    public function find(int $id): ?BannedWord;

    /**
     * Update banned word
     */
    public function update(int $id, array $data): BannedWord;

    /**
     * Delete banned word
     */
    public function delete(int $id): bool;

    /**
     * Bulk create banned words
     */
    public function bulkCreate(array $words): void;

    /**
     * Check if word exists
     */
    public function exists(string $word): bool;

    /**
     * Get all banned words for checking (word, is_regex, pattern)
     */
    public function getAllForChecking(): array;
}
