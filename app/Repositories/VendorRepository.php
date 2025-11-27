<?php

namespace App\Repositories;

use App\Models\Vendor;

class VendorRepository extends EloquentBaseRepository
{
    public function __construct(Vendor $model)
    {
        parent::__construct($model);
    }

    // Vendor specific queries can be added here
}
