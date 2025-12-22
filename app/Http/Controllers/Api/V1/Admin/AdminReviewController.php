<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\BulkReviewActionRequest;
use App\Http\Requests\Api\V1\Admin\RejectReviewRequest;
use App\Interfaces\Services\Admin\AdminReviewServiceInterface;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;

class AdminReviewController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected AdminReviewServiceInterface $service
    ) {}

    public function index(Request $request)
    {
        $filters = [
            'status' => $request->input('status'),
            'rating' => $request->input('rating'),
            'search' => $request->input('search'),
            'with_trashed' => $request->boolean('with_trashed'),
            'per_page' => $request->integer('per_page', 50),
        ];

        return $this->fromServiceResponse($this->service->list($filters));
    }

    public function bulkApprove(Request $request)
    {
        // Validate using BulkReviewActionRequest
        $formRequest = app(BulkReviewActionRequest::class);
        $formRequest->setContainer(app());
        $formRequest->setRedirector(app('redirect'));
        $formRequest->validateResolved();

        return $this->fromServiceResponse($this->service->bulkApprove($request->input('review_ids')));
    }

    public function bulkReject(Request $request)
    {
        // Validate using BulkReviewActionRequest
        $formRequest = app(BulkReviewActionRequest::class);
        $formRequest->setContainer(app());
        $formRequest->setRedirector(app('redirect'));
        $formRequest->validateResolved();

        return $this->fromServiceResponse(
            $this->service->bulkReject($request->input('review_ids'), $request->input('rejection_reason'))
        );
    }

    public function approve(string $id)
    {
        return $this->fromServiceResponse($this->service->approve($id));
    }

    public function reject(Request $request, string $id)
    {
        // Validate using RejectReviewRequest
        $formRequest = app(RejectReviewRequest::class);
        $formRequest->setContainer(app());
        $formRequest->setRedirector(app('redirect'));
        $formRequest->validateResolved();

        return $this->fromServiceResponse($this->service->reject($id, $request->input('rejection_reason')));
    }

    public function stats()
    {
        return $this->fromServiceResponse($this->service->getStats());
    }

    public function trashed(Request $request)
    {
        return $this->fromServiceResponse($this->service->getTrashed($request->integer('per_page', 50)));
    }
}
