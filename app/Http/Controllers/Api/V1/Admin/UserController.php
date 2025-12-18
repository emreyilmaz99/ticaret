<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\BaseAdminController;
use App\Http\Resources\Api\V1\Admin\UserResource;
use App\Interfaces\Services\User\UserServiceInterface;
use Illuminate\Http\Request;

class UserController extends BaseAdminController
{
    protected UserServiceInterface $service;

    public function __construct(UserServiceInterface $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        
        $filters = [
            'search' => $request->query('search'),
            'is_active' => $request->has('is_active') ? filter_var($request->query('is_active'), FILTER_VALIDATE_BOOLEAN) : null,
            'gender' => $request->query('gender'),
            'email_verified' => $request->has('email_verified') ? filter_var($request->query('email_verified'), FILTER_VALIDATE_BOOLEAN) : null,
            'sort_by' => $request->query('sort_by', 'created_at'),
            'sort_order' => $request->query('sort_order', 'desc'),
        ];

        $paginator = $this->service->list($perPage, $filters);

        $collection = UserResource::collection($paginator->getCollection());

        return $this->success([
            'data' => $collection,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function show(int $id)
    {
        $user = $this->service->find($id);
        if (! $user) {
            return $this->error('User not found', 404);
        }

        return $this->success(new UserResource($user));
    }

    public function update(\App\Http\Requests\Api\V1\Admin\UpdateUserRequest $request, int $id)
    {
        $data = $request->validated();
        $user = $this->service->find($id);
        if (! $user) {
            return $this->error('User not found', 404);
        }

        $updated = $this->service->update($id, $data);

        return $this->success(new UserResource($this->service->find($id)),
            'User updated', 200);
    }

    public function destroy(int $id)
    {
        $user = $this->service->find($id);
        if (! $user) {
            return $this->error('User not found', 404);
        }

        $this->service->delete($id);

        return $this->success(null, 'User deleted', 200);
    }

    public function toggleStatus(int $id)
    {
        $user = $this->service->find($id);
        if (! $user) {
            return $this->error('User not found', 404);
        }

        $this->service->toggleStatus($id);
        $updatedUser = $this->service->find($id);

        return $this->success(
            new UserResource($updatedUser),
            $updatedUser->is_active ? 'Kullanıcı aktif edildi' : 'Kullanıcı pasife alındı'
        );
    }

    public function getUserOrders(int $id)
    {
        $user = $this->service->find($id);
        if (! $user) {
            return $this->error('User not found', 404);
        }

        $orders = \App\Models\Order::where('user_id', $id)
            ->select('id', 'order_number', 'status', 'payment_status', 'total', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'total' => (float) $order->total,
                    'created_at' => $order->created_at->format('d.m.Y H:i'),
                ];
            });

        return $this->success(['orders' => $orders]);
    }
}

