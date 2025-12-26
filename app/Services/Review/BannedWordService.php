<?php

namespace App\Services\Review;

use App\Interfaces\Services\Review\BannedWordServiceInterface;
use App\Models\BannedWord;
use App\Repositories\Interfaces\BannedWordRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class BannedWordService implements BannedWordServiceInterface
{
    public function __construct(
        protected BannedWordRepositoryInterface $repo
    ) {}

    /**
     * Check if text contains banned words
     * 
     * @param string $text
     * @return array ['banned' => bool, 'words' => array, 'message' => string]
     */
    public function checkForBannedWords(string $text): array
    {
        $bannedWords = $this->getBannedWordsList();
        $foundWords = [];

        // Normalize text for Turkish characters
        $normalizedText = mb_strtolower($text, 'UTF-8');

        foreach ($bannedWords as $bannedWord) {
            if ($bannedWord['is_regex']) {
                // TODO: Elasticsearch fuzzy matching for advanced word detection
                // For now, use simple pattern matching
                if ($bannedWord['pattern'] && @preg_match($bannedWord['pattern'], $normalizedText)) {
                    $foundWords[] = $bannedWord['word'];
                }
            } else {
                // Simple string matching
                $normalizedBannedWord = mb_strtolower($bannedWord['word'], 'UTF-8');
                if (str_contains($normalizedText, $normalizedBannedWord)) {
                    $foundWords[] = $bannedWord['word'];
                }
            }
        }

        if (!empty($foundWords)) {
            return [
                'banned' => true,
                'words' => $foundWords,
                'message' => 'Yorumunuz uygunsuz kelimeler içermektedir: ' . implode(', ', $foundWords),
            ];
        }

        return [
            'banned' => false,
            'words' => [],
            'message' => '',
        ];
    }

    /**
     * Get cached banned words list
     * 
     * @return array
     */
    public function getBannedWordsList(): array
    {
        return Cache::remember('banned_words_list', 3600, function () {
            return $this->repo->getAllForChecking();
        });
    }

    /**
     * Add a new banned word
     * 
     * @param string $word
     * @param bool $isRegex
     * @param string|null $pattern
     * @return BannedWord
     */
    public function addBannedWord(string $word, bool $isRegex = false, ?string $pattern = null): BannedWord
    {
        $bannedWord = $this->repo->create([
            'word' => $word,
            'is_regex' => $isRegex,
            'pattern' => $pattern,
        ]);

        // Cache is automatically cleared by BannedWordObserver

        return $bannedWord;
    }

    /**
     * Remove banned word
     * 
     * @param int $id
     * @return bool
     */
    public function removeBannedWord(int $id): bool
    {
        $result = $this->repo->delete($id);
        
        // Cache is automatically cleared by BannedWordObserver

        return $result;
    }

    /**
     * Check if banned word exists
     * 
     * @param string $word
     * @return bool
     */
    public function isBannedWordExists(string $word): bool
    {
        return $this->repo->exists($word);
    }

    /**
     * Test text against banned words (for admin)
     * 
     * @param string $text
     * @return array
     */
    public function testBannedWords(string $text): array
    {
        return $this->checkForBannedWords($text);
    }

}
