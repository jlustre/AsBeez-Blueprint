<?php

namespace Database\Seeders\Support;

use GdImage;

/**
 * Draws on-brand placeholder artwork for seeded stores.
 *
 * Generated with GD rather than downloaded, so seeding stays offline,
 * deterministic and free of binary blobs committed to the repository. The
 * output is real PNG bytes written to the store_media disk through the same
 * path convention the upload endpoint uses, so removing an image through the
 * UI cleans it up correctly.
 */
class PlaceholderImage
{
    /** AsBeez palette, matching the frontend theme tokens. */
    private const HONEY = [0xF7, 0xB9, 0x28];
    private const AMBER = [0xE8, 0x9B, 0x0C];
    private const CHARCOAL = [0x24, 0x24, 0x24];
    private const CREAM = [0xFF, 0xF8, 0xE7];

    /**
     * A wide banner: honey gradient, honeycomb lattice, darkened lower edge so
     * the overlaid buttons the page draws on top stay readable.
     */
    public static function banner(int $width = 1600, int $height = 400, int $variant = 0): string
    {
        $image = imagecreatetruecolor($width, $height);

        self::verticalGradient($image, $width, $height, self::shift(self::HONEY, $variant), self::shift(self::AMBER, $variant));
        self::honeycomb($image, $width, $height, 56, self::CREAM, 22);
        self::bottomShade($image, $width, $height);

        return self::toPng($image);
    }

    /** A catalog or hero cover: honey gradient, honeycomb, darkened lower edge. */
    public static function cover(int $width = 800, int $height = 600, int $variant = 0): string
    {
        $image = imagecreatetruecolor($width, $height);

        self::verticalGradient($image, $width, $height, self::shift(self::HONEY, $variant), self::shift(self::AMBER, $variant));
        self::honeycomb($image, $width, $height, 48, self::CREAM, 18);
        self::bottomShade($image, $width, $height);

        return self::toPng($image);
    }

    /** A square mark: charcoal honeycomb cell on a honey field. */
    public static function logo(int $size = 400, int $variant = 0): string
    {
        $image = imagecreatetruecolor($size, $size);

        $background = imagecolorallocate($image, ...self::shift(self::HONEY, $variant));
        imagefilledrectangle($image, 0, 0, $size, $size, $background);

        self::honeycomb($image, $size, $size, 44, self::CREAM, 16);

        $centre = $size / 2;
        $charcoal = imagecolorallocate($image, ...self::CHARCOAL);
        $honey = imagecolorallocate($image, ...self::shift(self::HONEY, $variant));

        // Outer cell, then an inner cut-out: reads as a hive cell at any size
        // and needs no font file, which keeps this portable.
        self::hexagon($image, $centre, $centre, $size * 0.33, $charcoal);
        self::hexagon($image, $centre, $centre, $size * 0.17, $honey);

        return self::toPng($image);
    }

    /* ---------------------------------------------------------------- */

    /** Nudges a colour per store so sibling stores are visually distinct. */
    private static function shift(array $rgb, int $variant): array
    {
        if ($variant === 0) {
            return $rgb;
        }

        return [
            max(0, min(255, $rgb[0] - $variant * 26)),
            max(0, min(255, $rgb[1] - $variant * 6)),
            max(0, min(255, $rgb[2] + $variant * 44)),
        ];
    }

    private static function verticalGradient(GdImage $image, int $width, int $height, array $from, array $to): void
    {
        for ($y = 0; $y < $height; $y++) {
            $ratio = $y / max(1, $height - 1);

            $colour = imagecolorallocate(
                $image,
                (int) round($from[0] + ($to[0] - $from[0]) * $ratio),
                (int) round($from[1] + ($to[1] - $from[1]) * $ratio),
                (int) round($from[2] + ($to[2] - $from[2]) * $ratio),
            );

            imageline($image, 0, $y, $width, $y, $colour);
        }
    }

    /** Tiles hexagon outlines across the canvas. */
    private static function honeycomb(GdImage $image, int $width, int $height, int $radius, array $rgb, int $alphaPercent): void
    {
        $colour = imagecolorallocatealpha($image, $rgb[0], $rgb[1], $rgb[2], (int) round(127 - 127 * $alphaPercent / 100));

        $stepX = $radius * 1.5;
        $stepY = $radius * sqrt(3);
        $row = 0;

        for ($x = -$radius; $x < $width + $radius; $x += $stepX) {
            $offset = $row % 2 === 0 ? 0 : $stepY / 2;

            for ($y = -$radius; $y < $height + $radius; $y += $stepY) {
                self::hexagonOutline($image, $x, $y + $offset, $radius * 0.86, $colour);
            }

            $row++;
        }
    }

    /** Fades the bottom strip toward charcoal for overlay legibility. */
    private static function bottomShade(GdImage $image, int $width, int $height): void
    {
        $band = (int) round($height * 0.6);

        for ($i = 0; $i < $band; $i++) {
            $y = $height - $band + $i;

            // Quadratic ease: a linear ramp leaves a visible seam where the
            // band begins, because the eye picks up the sudden change in slope.
            $progress = ($i / $band) ** 2;
            $alpha = (int) round(127 - 127 * $progress * 0.62);

            $colour = imagecolorallocatealpha($image, ...[...self::CHARCOAL, $alpha]);
            imageline($image, 0, $y, $width, $y, $colour);
        }
    }

    /**
     * @return list<int>
     */
    private static function hexPoints(float $cx, float $cy, float $radius): array
    {
        $points = [];

        for ($i = 0; $i < 6; $i++) {
            $angle = M_PI / 180 * (60 * $i);
            $points[] = (int) round($cx + $radius * cos($angle));
            $points[] = (int) round($cy + $radius * sin($angle));
        }

        return $points;
    }

    private static function hexagon(GdImage $image, float $cx, float $cy, float $radius, int $colour): void
    {
        imagefilledpolygon($image, self::hexPoints($cx, $cy, $radius), $colour);
    }

    private static function hexagonOutline(GdImage $image, float $cx, float $cy, float $radius, int $colour): void
    {
        imagesetthickness($image, 2);
        imagepolygon($image, self::hexPoints($cx, $cy, $radius), $colour);
    }

    private static function toPng(GdImage $image): string
    {
        imagealphablending($image, true);

        ob_start();
        imagepng($image, null, 6);
        $bytes = (string) ob_get_clean();

        imagedestroy($image);

        return $bytes;
    }
}
