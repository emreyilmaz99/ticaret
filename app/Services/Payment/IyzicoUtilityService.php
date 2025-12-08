<?php

namespace App\Services\Payment;

/**
 * IyzicoUtilityService
 * 
 * Utility functions for iyzico integration:
 * - Phone number formatting
 * - IBAN validation
 * - Name parsing
 * - Conversation ID generation
 */
class IyzicoUtilityService
{
    /**
     * Generate unique conversation ID for API calls
     */
    public function generateConversationId(): string
    {
        return config('iyzico.conversation_prefix', 'ticaret_') . uniqid() . '_' . time();
    }

    /**
     * Format phone number for iyzico (must start with +90)
     */
    public function formatPhoneNumber(?string $phone): string
    {
        if (empty($phone)) {
            return '+905000000000'; // Default fallback
        }

        // Remove all non-numeric characters
        $phone = preg_replace('/\D/', '', $phone);

        // If starts with 0, remove it
        if (str_starts_with($phone, '0')) {
            $phone = substr($phone, 1);
        }

        // If starts with 90, add +
        if (str_starts_with($phone, '90')) {
            return '+' . $phone;
        }

        // Otherwise, add +90
        return '+90' . $phone;
    }

    /**
     * Validate IBAN format for Turkish banks
     * Turkish IBAN: TR + 2 check digits + 5 bank code + 1 reserved + 16 account number = 26 chars
     */
    public function validateIban(?string $iban): bool
    {
        if (empty($iban)) {
            return false;
        }
        
        // Remove spaces and make uppercase
        $iban = strtoupper(preg_replace('/\s+/', '', $iban));
        
        // Turkish IBAN must be exactly 26 characters: TR + 24 digits
        return strlen($iban) === 26 && preg_match('/^TR\d{24}$/', $iban);
    }

    /**
     * Format IBAN - remove spaces and ensure uppercase
     */
    public function formatIban(?string $iban): ?string
    {
        if (!$iban) {
            return null;
        }

        return strtoupper(preg_replace('/\s+/', '', $iban));
    }

    /**
     * Get first name from full name
     */
    public function getFirstName(string $fullName): string
    {
        $parts = explode(' ', trim($fullName), 2);
        return $parts[0] ?? 'Ad';
    }

    /**
     * Get last name from full name
     */
    public function getLastName(string $fullName): string
    {
        $parts = explode(' ', trim($fullName), 2);
        return $parts[1] ?? 'Soyad';
    }

    /**
     * Sanitize city name for iyzico
     */
    public function sanitizeCity(?string $city): string
    {
        if (empty($city)) {
            return 'Istanbul';
        }

        // Remove special characters, keep only letters and spaces
        $city = preg_replace('/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/', '', $city);
        
        return ucfirst(strtolower(trim($city))) ?: 'Istanbul';
    }

    /**
     * Sanitize address line
     */
    public function sanitizeAddress(?string $address): string
    {
        if (empty($address)) {
            return 'Adres bilgisi yok';
        }

        return trim(substr($address, 0, 255));
    }

    /**
     * Format price for iyzico (2 decimal places, string)
     */
    public function formatPrice(float $price): string
    {
        return number_format($price, 2, '.', '');
    }
}
