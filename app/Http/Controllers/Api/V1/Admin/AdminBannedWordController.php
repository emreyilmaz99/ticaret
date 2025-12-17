<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\BulkDestroyBannedWordsRequest;
use App\Http\Requests\Api\V1\Admin\BulkStoreBannedWordsRequest;
use App\Http\Requests\Api\V1\Admin\StoreBannedWordRequest;
use App\Http\Requests\Api\V1\Admin\TestBannedWordsRequest;
use App\Http\Requests\Api\V1\Admin\UpdateBannedWordRequest;
use App\Http\Resources\Api\V1\Admin\BannedWordResource;
use App\Models\BannedWord;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;

class AdminBannedWordController extends Controller
{
    use ResponseHttp;
    /**
     * GET /api/v1/admin/banned-words
     * List all banned words
     */
    public function index(Request $request)
    {
        $query = BannedWord::query()
            ->when($request->has('search'), function ($q) use ($request) {
                $search = $request->input('search');
                $q->where('word', 'like', "%{$search}%");
            })
            ->when($request->has('is_regex'), function ($q) use ($request) {
                $q->where('is_regex', $request->boolean('is_regex'));
            })
            ->orderBy('word');

        if ($request->boolean('all')) {
            $bannedWords = $query->get();
            return $this->success(
                BannedWordResource::collection($bannedWords),
                'Banned words listed'
            );
        }

        $bannedWords = $query->paginate($request->integer('per_page', 50));
        return $this->paginated(
            BannedWordResource::collection($bannedWords),
            'Banned words listed'
        );
    }

    /**
     * POST /api/v1/admin/banned-words
     * Create a new banned word
     */
    public function store(StoreBannedWordRequest $request)
    {
        $validated = $request->validated();

        $bannedWord = BannedWord::create([
            'word' => strtolower(trim($validated['word'])),
            'is_regex' => $validated['is_regex'] ?? false,
            'pattern' => $validated['pattern'] ?? null,
        ]);

        return $this->success(
            new BannedWordResource($bannedWord),
            'Yasaklı kelime eklendi.',
            201
        );
    }

    /**
     * PUT /api/v1/admin/banned-words/{id}
     * Update a banned word
     */
    public function update(UpdateBannedWordRequest $request, int $id)
    {
        $bannedWord = BannedWord::findOrFail($id);
        $validated = $request->validated();

        $bannedWord->update([
            'word' => strtolower(trim($validated['word'])),
            'is_regex' => $validated['is_regex'] ?? false,
            'pattern' => $validated['pattern'] ?? null,
        ]);

        return $this->success(
            new BannedWordResource($bannedWord),
            'Yasaklı kelime güncellendi.'
        );
    }

    /**
     * DELETE /api/v1/admin/banned-words/{id}
     * Delete a banned word
     */
    public function destroy(int $id)
    {
        $bannedWord = BannedWord::findOrFail($id);
        $bannedWord->delete();

        return $this->success(
            null,
            'Yasaklı kelime silindi.',
            200
        );
    }

    /**
     * POST /api/v1/admin/banned-words/bulk
     * Bulk create banned words
     */
    public function bulkStore(BulkStoreBannedWordsRequest $request)
    {
        $validated = $request->validated();

        $words = array_unique(array_map(function ($word) {
            return strtolower(trim($word));
        }, $validated['words']));

        // Var olan kelimeleri filtrele
        $existingWords = BannedWord::whereIn('word', $words)->pluck('word')->toArray();
        $newWords = array_diff($words, $existingWords);

        $created = 0;
        foreach ($newWords as $word) {
            if (!empty($word)) {
                BannedWord::create(['word' => $word, 'is_regex' => false]);
                $created++;
            }
        }

        return $this->success(
            [
                'created' => $created,
                'skipped' => count($existingWords),
            ],
            "{$created} yasaklı kelime eklendi."
        );
    }

    /**
     * DELETE /api/v1/admin/banned-words/bulk
     * Bulk delete banned words
     */
    public function bulkDestroy(BulkDestroyBannedWordsRequest $request)
    {
        $validated = $request->validated();

        $deleted = BannedWord::whereIn('id', $validated['ids'])->delete();

        return $this->success(
            ['deleted' => $deleted],
            "{$deleted} yasaklı kelime silindi."
        );
    }

    /**
     * GET /api/v1/admin/banned-words/stats
     * Get banned words statistics
     */
    public function stats()
    {
        $stats = [
            'total' => BannedWord::count(),
            'regex' => BannedWord::where('is_regex', true)->count(),
            'simple' => BannedWord::where('is_regex', false)->count(),
        ];

        return $this->success($stats, 'Statistics retrieved');
    }

    /**
     * POST /api/v1/admin/banned-words/test
     * Test text against banned words
     */
    public function test(TestBannedWordsRequest $request)
    {
        $validated = $request->validated();

        $text = $validated['text'];
        $normalizedText = mb_strtolower($text, 'UTF-8');
        $foundWords = [];

        $bannedWords = BannedWord::all();

        foreach ($bannedWords as $bannedWord) {
            if ($bannedWord->is_regex) {
                // Regex pattern matching
                $pattern = $bannedWord->pattern ?: '/' . preg_quote($bannedWord->word, '/') . '/iu';
                if (@preg_match($pattern, $normalizedText)) {
                    $foundWords[] = $bannedWord->word;
                }
            } else {
                // Simple string matching
                $normalizedBannedWord = mb_strtolower($bannedWord->word, 'UTF-8');
                if (str_contains($normalizedText, $normalizedBannedWord)) {
                    $foundWords[] = $bannedWord->word;
                }
            }
        }

        return $this->success(
            [
                'banned' => !empty($foundWords),
                'words' => array_unique($foundWords),
                'count' => count(array_unique($foundWords)),
            ],
            'Test completed'
        );
    }
}
