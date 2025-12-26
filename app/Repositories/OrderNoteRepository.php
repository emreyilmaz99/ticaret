<?php

namespace App\Repositories;

use App\Models\OrderNote;
use Illuminate\Database\Eloquent\Collection;

class OrderNoteRepository
{
    public function __construct(
        protected OrderNote $model
    ) {}

    /**
     * Create a new order note
     */
    public function create(array $data): OrderNote
    {
        return $this->model->create($data);
    }

    /**
     * Get notes for an order
     */
    public function getByOrderId(int $orderId): Collection
    {
        return $this->model->where('order_id', $orderId)
            ->with('admin:id,name')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Find note by ID
     */
    public function find(int $id): ?OrderNote
    {
        return $this->model->with('admin:id,name')->find($id);
    }

    /**
     * Delete a note
     */
    public function delete(int $id): bool
    {
        $note = $this->model->find($id);
        return $note ? (bool) $note->delete() : false;
    }
}
