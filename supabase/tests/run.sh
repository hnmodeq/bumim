#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Local RLS test runner (no Docker / Supabase CLI required).
#
# Creates a fresh PostgreSQL database, applies the auth stub, migrations,
# seed data, roles/grants, then runs the RLS test suite. Fails with a non-zero
# exit code if any assertion fails.
#
# Usage:
#   DB_URL=postgresql://bumim:bumim@127.0.0.1:5432/bumim_test bash supabase/tests/run.sh
# ---------------------------------------------------------------------------
set -euo pipefail

DB_URL="${DB_URL:-postgresql://bumim:bumim@127.0.0.1:5432/bumim_test}"
PSQL="psql -v ON_ERROR_STOP=1 -q"

# parse dbname from URL for drop/create
DB_NAME=$(printf '%s' "$DB_URL" | sed -E 's#.*/([^/?]+).*#\1#')
ADMIN_URL=$(printf '%s' "$DB_URL" | sed -E 's#/[^/?]+(\?.*)?$#/postgres\1#')

echo "==> (re)creating test database: $DB_NAME"
psql -v ON_ERROR_STOP=1 -q "$ADMIN_URL" -c "drop database if exists \"$DB_NAME\";" >/dev/null
psql -v ON_ERROR_STOP=1 -q "$ADMIN_URL" -c "create database \"$DB_NAME\";" >/dev/null

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

echo "==> applying auth stub"
$PSQL "$DB_URL" -f "$ROOT/supabase/tests/00_auth_stub.sql" >/dev/null

echo "==> applying migrations"
for f in "$ROOT"/supabase/migrations/*.sql; do
  echo "    - $(basename "$f")"
  $PSQL "$DB_URL" -f "$f" >/dev/null
done

echo "==> applying seed"
$PSQL "$DB_URL" -f "$ROOT/supabase/seed.sql" >/dev/null

echo "==> applying roles/grants"
$PSQL "$DB_URL" -f "$ROOT/supabase/tests/01_roles.sql" >/dev/null

echo "==> running RLS tests"
$PSQL "$DB_URL" -f "$ROOT/supabase/tests/02_rls_tests.sql"

echo ""
echo "✅ ALL TESTS PASSED"
