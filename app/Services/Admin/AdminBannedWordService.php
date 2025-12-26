<?php

namespace App\Services\Admin;

use App\Core\ServiceResponse;
use App\Interfaces\Services\Admin\AdminBannedWordServiceInterface;
use App\Repositories\BannedWordRepository;
use App\Services\BaseService;

class AdminBannedWordService extends BaseService implements AdminBannedWordServiceInterface
{
    public function __construct(
        protected BannedWordRepository $bannedWordRepository
    ) {}

    public function list(array $filters): ServiceResponse
    {
        try {
            $bannedWords = $this->bannedWordRepository->getFiltered($filters);
            return $this->successResponse($bannedWords, 'Banned words listed');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to list banned words');
        }
    }

    public function create(array $data): ServiceResponse
    {
        try {
            $bannedWord = $this->bannedWordRepository->create($data);
            return $this->successResponse($bannedWord, 'Yasaklı kelime eklendi.', 201);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Yasaklı kelime eklenemedi');
        }
    }

    public function update(int $id, array $data): ServiceResponse
    {
        try {
            $bannedWord = $this->bannedWordRepository->update($id, $data);
            return $this->successResponse($bannedWord, 'Yasaklı kelime güncellendi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Yasaklı kelime güncellenemedi');
        }
    }

    public function delete(int $id): ServiceResponse
    {
        try {
            $this->bannedWordRepository->delete($id);
            return $this->successResponse(null, 'Yasaklı kelime silindi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Yasaklı kelime silinemedi');
        }
    }

    public function bulkCreate(array $words): ServiceResponse
    {
        try {
            $normalizedWords = array_unique(array_map(fn($word) => strtolower(trim($word)), $words));
            
            // Check which words already exist
            $newWords = [];
            $skipped = 0;
            foreach ($normalizedWords as $word) {
                if (!empty($word)) {
                    if ($this->bannedWordRepository->exists($word)) {
                        $skipped++;
                    } else {
                        $newWords[] = $word;
                    }
                }
            }

            // Bulk create new words
            if (!empty($newWords)) {
                $this->bannedWordRepository->bulkCreate($newWords);
            }

            $created = count($newWords);

            return $this->successResponse(
                ['created' => $created, 'skipped' => $skipped],
                "{$created} yasaklı kelime eklendi."
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'Toplu ekleme başarısız');
        }
    }

    public function bulkDelete(array $ids): ServiceResponse
    {
        try {
            $deleted = 0;
            foreach ($ids as $id) {
                if ($this->bannedWordRepository->delete($id)) {
                    $deleted++;
                }
            }

            return $this->successResponse(['deleted' => $deleted], "{$deleted} yasaklı kelime silindi.");
        } catch (\Exception $e) {
            return $this->handleException($e, 'Toplu silme başarısız');
        }
    }

    public function getStats(): ServiceResponse
    {
        try {
            // Get all words and calculate stats
            $allWords = $this->bannedWordRepository->getFiltered(['all' => true]);
            
            $stats = [
                'total' => $allWords->count(),
                'regex' => $allWords->where('is_regex', true)->count(),
                'simple' => $allWords->where('is_regex', false)->count(),
            ];

            return $this->successResponse($stats, 'Statistics retrieved');
        } catch (\Exception $e) {
            return $this->handleException($e, 'İstatistikler alınamadı');
        }
    }

    public function testText(string $text): ServiceResponse
    {
        try {
            $normalizedText = mb_strtolower($text, 'UTF-8');
            $foundWords = [];

            $bannedWords = $this->bannedWordRepository->getFiltered(['all' => true]);

            foreach ($bannedWords as $bannedWord) {
                if ($bannedWord->is_regex) {
                    $pattern = $bannedWord->pattern ?: '/' . preg_quote($bannedWord->word, '/') . '/iu';
                    if (@preg_match($pattern, $normalizedText)) {
                        $foundWords[] = $bannedWord->word;
                    }
                } else {
                    $normalizedBannedWord = mb_strtolower($bannedWord->word, 'UTF-8');
                    if (str_contains($normalizedText, $normalizedBannedWord)) {
                        $foundWords[] = $bannedWord->word;
                    }
                }
            }

            return $this->successResponse([
                'banned' => !empty($foundWords),
                'words' => array_unique($foundWords),
                'count' => count(array_unique($foundWords)),
            ], 'Test completed');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Test başarısız');
        }
    }
}
