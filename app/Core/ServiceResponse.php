<?php

namespace App\Core;

/**
 * Simple ServiceResponse container used to standardize service outputs.
 *
 * Usage (fluent):
 *  return (new ServiceResponse())
 *      ->setSuccess(true)
 *      ->setStatusCode(200)
 *      ->setMessage('OK')
 *      ->setData(['data'=>...,'meta'=>...]);
 */
class ServiceResponse
{
    protected bool $success = true;
    protected int $statusCode = 200;
    protected string $message = '';
    protected $data = null;

    public function isSuccess(): bool
    {
        return $this->success;
    }

    public function setSuccess(bool $success): static
    {
        $this->success = $success;
        return $this;
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function setStatusCode(int $code): static
    {
        $this->statusCode = $code;
        return $this;
    }

    public function getMessage(): string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;
        return $this;
    }

    public function getData()
    {
        return $this->data;
    }

    public function setData($data): static
    {
        $this->data = $data;
        return $this;
    }
}
