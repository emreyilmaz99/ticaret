<?php

namespace App\Repositories;

use App\Models\BannedWord;
use App\Repositories\Interfaces\BannedWordRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BannedWordRepository implements BannedWordRepositoryInterface
{
    public function __construct(
        protected BannedWord $model
    ) {}

    /**
     * Get filtered banned words with pagination
     */
    public function getFiltered(array $filters): LengthAwarePaginator|Collection
    {
        $query = $this->model->query()
            ->when($filters['search'] ?? null, fn($q, $search) => 
                $q->where('word', 'like', "%{$search}%")
            )
            ->when(isset($filters['is_regex']), fn($q) => 
                $q->where('is_regex', $filters['is_regex'])
            )
            ->orderBy('word');

        if ($filters['all'] ?? false) {
            return $query->get();
        }

        return $query->paginate($filters['per_page'] ?? 50);
    }

    /**
     * Create new banned word
     */
    public function create(array $data): BannedWord
    {
        return $this->model->create([
            'word' => strtolower(trim($data['word'])),
            'is_regex' => $data['is_regex'] ?? false,
            'pattern' => $data['pattern'] ?? null,
        ]);
    }

    /**
     * Find banned word by ID
     */
    public function find(int $id): ?BannedWord
    {
        return $this->model->find($id);
    }

    /**
     * Update banned word
     */
    public function update(int $id, array $data): BannedWord
    {
        $bannedWord = $this->model->findOrFail($id);
        
        $bannedWord->update([
            'word' => strtolower(trim($data['word'])),
            'is_regex' => $data['is_regex'] ?? false,
            'pattern' => $data['pattern'] ?? null,
        ]);

        return $bannedWord->fresh();
    }

    /**
     * Delete banned word
     */
    public function delete(int $id): bool
    {
        $bannedWord = $this->model->findOrFail($id);
        return $bannedWord->delete();
    }

    /**
     * Bulk create banned words
     */
    public function bulkCreate(array $words): void
    {
        $data = collect($words)->map(fn($word) => [
            'word' => strtolower(trim($word)),
            'is_regex' => false,
            'pattern' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ])->toArray();

        $this->model->insert($data);
    }

    /**
     * Check if word exists
     */
    public function exists(string $word): bool
    {
        return $this->model->where('word', strtolower(trim($word)))->exists();
    }

    /**
     * Get all banned words for checking (word, is_regex, pattern)
     */
    public function getAllForChecking(): array
    {
        return $this->model
            ->select('word', 'is_regex', 'pattern')
            ->get()
            ->toArray();
    }
}
