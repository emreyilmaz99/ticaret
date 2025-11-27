<?php

namespace App\Repositories;

use App\Models\Vendor;
use Illuminate\Support\Facades\DB;

class VendorRepository extends EloquentBaseRepository
{
    public function __construct(Vendor $model)
    {
        parent::__construct($model);
    }

    // Vendor specific queries can be added here

    /**
     * Paginate vendors using Query Builder to avoid Eloquent model hydration for large lists.
     * Returns a LengthAwarePaginator of stdClass rows (lighter weight than Eloquent models).
     *
     * @param int $perPage
     * @param array $filters
     * @param array $select
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginateOptimized(int $perPage = 15, array $filters = [], array $select = ['id','name','email','created_at'])
    {
        $table = $this->model->getTable();

        $query = DB::table($table)->select($select);

        if (! empty($filters)) {
            foreach ($filters as $key => $value) {
                // support simple where = filters; users can extend for complex filters
                $query->where($key, $value);
            }
        }

        return $query->paginate($perPage);
    }
}
