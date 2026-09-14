#!/usr/bin/env python3
"""
Apply local migrations + seed to a hosted Supabase project using the
Management API (no Docker / Supabase CLI / DB password required).

Requires a Supabase personal access token (sbp_...) with project scope.

Usage:
    SUPABASE_ACCESS_TOKEN=sbp_... SUPABASE_PROJECT_REF=xxxxxxxxxxxx \
        python3 supabase/scripts/deploy_migrations.py [--skip-seed]

The token and project ref are read from the environment so they are never
committed. Prints each file as it is applied and stops on the first error.
"""

import json
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path

TOKEN = os.environ.get("SUPABASE_ACCESS_TOKEN", "").strip()
REF = os.environ.get("SUPABASE_PROJECT_REF", "").strip()
SKIP_SEED = "--skip-seed" in sys.argv

if not TOKEN or not REF:
    sys.exit("Set SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF env vars.")

API = f"https://api.supabase.com/v1/projects/{REF}/database/query"
ROOT = Path(__file__).resolve().parents[2]


def run_sql(sql: str, label: str) -> None:
    body = json.dumps({"query": sql}).encode("utf-8")
    req = urllib.request.Request(
        API,
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            resp.read()
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")
        sys.exit(f"\n❌ FAILED at {label}:\nHTTP {e.code} {detail}\n")
    print(f"  ✓ {label}")


def main() -> None:
    migrations = sorted((ROOT / "supabase" / "migrations").glob("*.sql"))
    print(f"==> applying {len(migrations)} migrations to project {REF}")
    for f in migrations:
        run_sql(f.read_text(encoding="utf-8"), f.name)

    if SKIP_SEED:
        print("==> skipped seed (--skip-seed)")
        return

    seed = ROOT / "supabase" / "seed.sql"
    print("==> applying seed")
    run_sql(seed.read_text(encoding="utf-8"), "seed.sql")

    print("\n✅ deployed")


if __name__ == "__main__":
    main()
