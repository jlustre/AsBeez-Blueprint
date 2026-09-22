<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

#[Fillable(['slug', 'copy_key', 'href', 'image_path', 'position', 'is_active'])]
class HomeSlide extends Model
{
    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function imageUrl(): ?string
    {
        return $this->image_path ? Storage::disk(Store::MEDIA_DISK)->url($this->image_path) : null;
    }
}
