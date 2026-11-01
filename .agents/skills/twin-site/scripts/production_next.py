#!/usr/bin/env python3
"""Compatibility entry point; Web Production owns the production state machine."""
from pathlib import Path
import runpy

_CANONICAL = Path(__file__).resolve().parents[2] / "web-production" / "scripts" / "production_next.py"

if __name__ == "__main__":
    runpy.run_path(str(_CANONICAL), run_name="__main__")
else:
    next_action = runpy.run_path(str(_CANONICAL))["next_action"]
