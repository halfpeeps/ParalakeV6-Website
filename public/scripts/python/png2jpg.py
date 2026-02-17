#!/usr/bin/env python3
"""
Recursively convert PNGs to JPGs unless they use transparency.
Configured entirely via constants below.

Requires:
    pip install pillow
"""

from pathlib import Path
import os
from PIL import Image


# =============================================================================
# CONFIGURATION
# =============================================================================

# Root folder to search
ROOT_DIR = Path(r"C:\Users\samue\Documents\Github\Paralake-V6-Development-Archive\public\images_excluded")

# Blacklisted folders (relative paths OR folder names)
# Examples:
#   "ui/icons" → skips that subtree
#   "node_modules" → skips any folder with that name anywhere
BLACKLIST = {
    "10In-Game-Art",
    "20Misc"
}

# JPEG settings
JPEG_QUALITY = 92
JPEG_OPTIMIZE = True
JPEG_PROGRESSIVE = True

# Behaviour
DELETE_ORIGINAL_PNG = True
OVERWRITE_EXISTING_JPG = False
DRY_RUN = False  # True = simulate only


# =============================================================================
# IMPLEMENTATION
# =============================================================================

def norm_rel_path(p: Path) -> str:
    return str(p).replace("\\", "/").strip("/")


def is_under_blacklist(rel_dir: Path) -> bool:
    rel_norm = norm_rel_path(rel_dir)

    # Match full relative paths
    for b in BLACKLIST:
        b_norm = norm_rel_path(Path(b))
        if "/" in b_norm:
            if rel_norm == b_norm or rel_norm.startswith(b_norm + "/"):
                return True

    # Match folder names anywhere in path
    parts = set(rel_dir.parts)
    for b in BLACKLIST:
        if "/" not in b and b in parts:
            return True

    return False


def png_uses_transparency(img: Image.Image) -> bool:
    if img.mode == "P":
        if "transparency" in img.info:
            return True
        img = img.convert("RGBA")

    if img.mode in ("RGBA", "LA"):
        alpha = img.getchannel("A")
        lo, hi = alpha.getextrema()
        return lo < 255 or hi < 255

    return False


def convert_png_to_jpg(src: Path, dst: Path):
    with Image.open(src) as im:
        if im.mode != "RGB":
            im = im.convert("RGB")

        im.save(
            dst,
            "JPEG",
            quality=JPEG_QUALITY,
            optimize=JPEG_OPTIMIZE,
            progressive=JPEG_PROGRESSIVE,
        )


def main():
    root = ROOT_DIR.resolve()

    if not root.exists():
        print(f"ERROR: ROOT_DIR does not exist: {root}")
        return

    converted = 0
    skipped_alpha = 0
    skipped_existing = 0
    errors = 0

    for dirpath, dirnames, filenames in os.walk(root):
        dirpath = Path(dirpath)
        rel_dir = dirpath.relative_to(root)

        # prune blacklisted dirs
        dirnames[:] = [
            d for d in dirnames
            if not is_under_blacklist(rel_dir / d)
        ]

        if is_under_blacklist(rel_dir):
            continue

        for filename in filenames:
            if not filename.lower().endswith(".png"):
                continue

            src = dirpath / filename
            rel = src.relative_to(root)
            dst = src.with_suffix(".jpg")

            try:
                if dst.exists() and not OVERWRITE_EXISTING_JPG:
                    skipped_existing += 1
                    print(f"[skip exists] {rel}")
                    continue

                with Image.open(src) as im:
                    if png_uses_transparency(im):
                        skipped_alpha += 1
                        print(f"[skip alpha ] {rel}")
                        continue

                print(f"[convert    ] {rel}")

                if not DRY_RUN:
                    convert_png_to_jpg(src, dst)
                    converted += 1

                    if DELETE_ORIGINAL_PNG:
                        src.unlink()

            except Exception as e:
                print(f"[error      ] {rel} → {e}")
                errors += 1

    print("\n--- Summary ---")
    print(f"Converted: {converted}")
    print(f"Skipped (alpha): {skipped_alpha}")
    print(f"Skipped (exists): {skipped_existing}")
    print(f"Errors: {errors}")


if __name__ == "__main__":
    main()