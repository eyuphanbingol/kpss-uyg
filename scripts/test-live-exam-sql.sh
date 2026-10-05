#!/usr/bin/env bash
# Canlı deneme SQL'ini yerel PostgreSQL'de sıfırdan kurup senaryo testlerini çalıştırır.
#   PGHOST=/var/lib/postgresql/livetest PGPORT=5499 scripts/test-live-exam-sql.sh
set -euo pipefail
cd "$(dirname "$0")/.."
DB=live_exam_test
export PGUSER="${PGUSER:-postgres}"
psql -q -d postgres -c "drop database if exists $DB" -c "create database $DB" >/dev/null
run() { PGOPTIONS="-c client_min_messages=warning" psql -q -v ON_ERROR_STOP=1 -d $DB -f "$1" >/dev/null; }
run supabase/tests/supabase-shim.sql
run supabase/schema.sql
run supabase/patch-hardening.sql
run supabase/patch-privilege-lock.sql
run supabase/patch-live-exam.sql
run supabase/patch-live-exam.sql   # iki kez çalıştırmak güvenli olmalı
psql -v ON_ERROR_STOP=1 -d $DB -f supabase/tests/live-exam-test.sql 2>&1 | grep -E "ok  |GEÇTİ|BAŞARISIZ|ERROR|HATA" || true
psql -d $DB -Atc "select 1" >/dev/null
