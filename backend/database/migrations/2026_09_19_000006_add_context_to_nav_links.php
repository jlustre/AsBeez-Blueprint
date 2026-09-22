<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * One navigation registry now serves more than one workspace, so each link has
 * to say which one it belongs to — otherwise the member profile would render
 * the vendor's "Manage Your Store" grid.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('nav_links', function (Blueprint $table) {
            $table->string('context')->default('vendor')->after('id');
            $table->index(['context', 'group', 'position']);
        });
    }

    public function down(): void
    {
        Schema::table('nav_links', function (Blueprint $table) {
            $table->dropIndex(['context', 'group', 'position']);
            $table->dropColumn('context');
        });
    }
};
