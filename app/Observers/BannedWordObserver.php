<?php

namespace App\Observers;

use App\Models\BannedWord;
use Illuminate\Support\Facades\Cache;

class BannedWordObserver
{
    /**
     * Clear banned words cache
     */
    protected function clearCache(): void
    {
        Cache::forget('banned_words_list');
    }

    /**
     * Handle the BannedWord "created" event.
     */
    public function created(BannedWord $bannedWord): void
    {
        $this->clearCache();
    }

    /**
     * Handle the BannedWord "updated" event.
     */
    public function updated(BannedWord $bannedWord): void
    {
        $this->clearCache();
    }

    /**
     * Handle the BannedWord "deleted" event.
     */
    public function deleted(BannedWord $bannedWord): void
    {
        $this->clearCache();
    }

    /**
     * Handle the BannedWord "restored" event.
     */
    public function restored(BannedWord $bannedWord): void
    {
        $this->clearCache();
    }

    /**
     * Handle the BannedWord "force deleted" event.
     */
    public function forceDeleted(BannedWord $bannedWord): void
    {
        $this->clearCache();
    }
}
