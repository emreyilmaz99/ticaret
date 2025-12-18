<?php

namespace App\Services\Admin;

use App\Core\ServiceResponse;
use App\Http\Resources\Api\V1\Admin\BannedWordResource;
use App\Interfaces\Services\Admin\AdminBannedWordServiceInterface;
use App\Models\BannedWord;
use App\Services\BaseService;

class AdminBannedWordService extends BaseService implements AdminBannedWordServiceInterface
{
    public function list(array $filters): ServiceResponse
    {
        try {
            $query = BannedWord::query()
                ->when(isset($filters['search']), function ($q) use ($filters) {
                    $q->where('word', 'like', "%{$filters['search']}%");
                })
                ->when(isset($filters['is_regex']), function ($q) use ($filters) {
                    $q->where('is_regex', $filters['is_regex']);
                })
                ->orderBy('word');

            if ($filters['all'] ?? false) {
                $bannedWords = $query->get();
                return $this->successResponse(BannedWordResource::collection($bannedWords), 'Banned words listed');
            }

            $bannedWords = $query->paginate($filters['per_page'] ?? 50);
            return $this->successResponse($bannedWords, 'Banned words listed');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to list banned words');
        }
    }

    public function create(array $data): ServiceResponse
    {
        try {
            $bannedWord = BannedWord::create([
                'word' => strtolower(trim($data['word'])),
                'is_regex' => $data['is_regex'] ?? false,
                'pattern' => $data['pattern'] ?? null,
            ]);

            return $this->successResponse(new BannedWordResource($bannedWord), 'Yasaklı kelime eklendi.', 201);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Yasaklı kelime eklenemedi');
        }
    }

    public function update(int $id, array $data): ServiceResponse
    {
        try {
            $bannedWord = BannedWord::findOrFail($id);
            
            $bannedWord->update([
                'word' => strtolower(trim($data['word'])),
                'is_regex' => $data['is_regex'] ?? false,
                'pattern' => $data['pattern'] ?? null,
            ]);

            return $this->successResponse(new BannedWordResource($bannedWord), 'Yasaklı kelime güncellendi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Yasaklı kelime güncellenemedi');
        }
    }

    public function delete(int $id): ServiceResponse
    {
        try {
            $bannedWord = BannedWord::findOrFail($id);
            $bannedWord->delete();

            return $this->successResponse(null, 'Yasaklı kelime silindi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Yasaklı kelime silinemedi');
        }
    }

    public function bulkCreate(array $words): ServiceResponse
    {
        try {
            $normalizedWords = array_unique(array_map(fn($word) => strtolower(trim($word)), $words));
            
            $existingWords = BannedWord::whereIn('word', $normalizedWords)->pluck('word')->toArray();
            $newWords = array_diff($normalizedWords, $existingWords);

            $created = 0;
            foreach ($newWords as $word) {
                if (!empty($word)) {
                    BannedWord::create(['word' => $word, 'is_regex' => false]);
                    $created++;
                }
            }

            return $this->successResponse(
                ['created' => $created, 'skipped' => count($existingWords)],
                "{$created} yasaklı kelime eklendi."
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'Toplu ekleme başarısız');
        }
    }

    public function bulkDelete(array $ids): ServiceResponse
    {
        try {
            $deleted = BannedWord::whereIn('id', $ids)->delete();

            return $this->successResponse(['deleted' => $deleted], "{$deleted} yasaklı kelime silindi.");
        } catch (\Exception $e) {
            return $this->handleException($e, 'Toplu silme başarısız');
        }
    }

    public function getStats(): ServiceResponse
    {
        try {
            $stats = [
                'total' => BannedWord::count(),
                'regex' => BannedWord::where('is_regex', true)->count(),
                'simple' => BannedWord::where('is_regex', false)->count(),
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

            $bannedWords = BannedWord::all();

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
