<?php

namespace App\Interfaces\Services\Review;

use App\Models\BannedWord;

interface BannedWordServiceInterface
{
    public function checkForBannedWords(string $text): array;
    public function getBannedWordsList(): array;
    public function addBannedWord(string $word, bool $isRegex = false, ?string $pattern = null): BannedWord;
    public function removeBannedWord(int $id): bool;
}
