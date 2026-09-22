<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One auditable thing an administrator did to a commission rule.
 */
class CommissionRuleAdminEvent extends Model
{
    public const TYPE_NOTE = 'note';

    public const TYPE_STATUS = 'status';

    public const TYPE_CREATED = 'created';

    public const TYPE_UPDATED = 'updated';

    protected $fillable = ['commission_rule_id', 'author_id', 'type', 'body', 'from_status', 'to_status'];

    public function rule(): BelongsTo
    {
        return $this->belongsTo(CommissionRule::class, 'commission_rule_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
