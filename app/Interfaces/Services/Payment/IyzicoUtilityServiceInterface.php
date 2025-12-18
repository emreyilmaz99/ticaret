<?php

namespace App\Interfaces\Services\Payment;

interface IyzicoUtilityServiceInterface
{
    public function generateConversationId(): string;
    public function formatPhoneNumber(?string $phone): string;
    public function validateIban(?string $iban): bool;
    public function formatIban(?string $iban): ?string;
    public function getFirstName(string $fullName): string;
    public function getLastName(string $fullName): string;
    public function sanitizeCity(?string $city): string;
    public function sanitizeAddress(?string $address): string;
    public function formatPrice(float $price): string;
}
