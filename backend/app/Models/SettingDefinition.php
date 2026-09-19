<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['key', 'group', 'label', 'hint', 'type', 'options', 'default_value', 'position'])]
class SettingDefinition extends Model
{
    public const TYPE_BOOL = 'bool';
    public const TYPE_SELECT = 'select';
    public const TYPE_NUMBER = 'number';
    public const TYPE_TEXT = 'text';

    protected function casts(): array
    {
        return [
            'options' => 'array',
            'position' => 'integer',
        ];
    }
}
