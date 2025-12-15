<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\BannedWord;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminBannedWordController extends Controller
{
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

        $bannedWords = $request->boolean('all') 
            ? $query->get() 
            : $query->paginate($request->integer('per_page', 50));

        return response()->json([
            'success' => true,
            'data' => $bannedWords,
        ]);
    }

    /**
     * POST /api/v1/admin/banned-words
     * Create a new banned word
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'word' => 'required|string|max:100|unique:banned_words,word',
            'is_regex' => 'boolean',
            'pattern' => 'nullable|string|max:255',
        ], [
            'word.required' => 'Yasaklı kelime zorunludur.',
            'word.unique' => 'Bu kelime zaten yasaklı listesinde.',
            'word.max' => 'Kelime en fazla 100 karakter olabilir.',
        ]);

        $bannedWord = BannedWord::create([
            'word' => strtolower(trim($validated['word'])),
            'is_regex' => $validated['is_regex'] ?? false,
            'pattern' => $validated['pattern'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Yasaklı kelime eklendi.',
            'data' => $bannedWord,
        ], 201);
    }

    /**
     * PUT /api/v1/admin/banned-words/{id}
     * Update a banned word
     */
    public function update(Request $request, int $id)
    {
        $bannedWord = BannedWord::findOrFail($id);

        $validated = $request->validate([
            'word' => [
                'required',
                'string',
                'max:100',
                Rule::unique('banned_words', 'word')->ignore($bannedWord->id),
            ],
            'is_regex' => 'boolean',
            'pattern' => 'nullable|string|max:255',
        ]);

        $bannedWord->update([
            'word' => strtolower(trim($validated['word'])),
            'is_regex' => $validated['is_regex'] ?? false,
            'pattern' => $validated['pattern'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Yasaklı kelime güncellendi.',
            'data' => $bannedWord,
        ]);
    }

    /**
     * DELETE /api/v1/admin/banned-words/{id}
     * Delete a banned word
     */
    public function destroy(int $id)
    {
        $bannedWord = BannedWord::findOrFail($id);
        $bannedWord->delete();

        return response()->json([
            'success' => true,
            'message' => 'Yasaklı kelime silindi.',
        ]);
    }

    /**
     * POST /api/v1/admin/banned-words/bulk
     * Bulk create banned words
     */
    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'words' => 'required|array|min:1',
            'words.*' => 'string|max:100',
        ]);

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

        return response()->json([
            'success' => true,
            'message' => "{$created} yasaklı kelime eklendi.",
            'data' => [
                'created' => $created,
                'skipped' => count($existingWords),
            ],
        ]);
    }

    /**
     * DELETE /api/v1/admin/banned-words/bulk
     * Bulk delete banned words
     */
    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:banned_words,id',
        ]);

        $deleted = BannedWord::whereIn('id', $validated['ids'])->delete();

        return response()->json([
            'success' => true,
            'message' => "{$deleted} yasaklı kelime silindi.",
        ]);
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

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * POST /api/v1/admin/banned-words/test
     * Test text against banned words
     */
    public function test(Request $request)
    {
        $validated = $request->validate([
            'text' => 'required|string|max:5000',
        ], [
            'text.required' => 'Test edilecek metin zorunludur.',
            'text.max' => 'Metin en fazla 5000 karakter olabilir.',
        ]);

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

        return response()->json([
            'success' => true,
            'data' => [
                'banned' => !empty($foundWords),
                'words' => array_unique($foundWords),
                'count' => count(array_unique($foundWords)),
            ],
        ]);
    }
}
