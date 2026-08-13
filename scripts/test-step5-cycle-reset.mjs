// Step 5: trigger a cycle reset and verify:
//   - the outgoing active list gets saved as a NEW export
//   - the export table is pruned back down to MAX_STORED_EXPORTS (2)
//   - future songs become active (votes reset to 0)
//   - the future table ends up empty
//
// This performs the SAME destructive operations as startNewHitlistCycle()
// in actions/admin.ts (it's a black-box replica, run outside Next so we can
// script it). DO NOT run this against production data casually.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/test-step5-cycle-reset.mjs
//
// Safety: DRY_RUN defaults to true — it will fetch and print what WOULD
// happen without writing anything. Set DRY_RUN=false to actually execute it.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = process.env.DRY_RUN !== "false"; // true unless explicitly "false"

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  console.error("(Match whatever your lib/supabase/admin.ts client actually uses.)");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const TABLE_SONGS = "Hitlist Songs";
const FUTURE_SONGS = "Future Hitlist Songs";
const TABLE_VOTES = "Hitlist Votes";
const TABLE_EXPORTS = "hitlist_exports";
const MAX_STORED_EXPORTS = 2;
const TWO_WEEK_CYCLE_MS = 14 * 24 * 60 * 60 * 1000;

function buildCsv(rows) {
  const headers = ["Title", "", "Artist", "", "Votes"];
  const csvRows = [headers.join(",")];
  for (const row of rows) {
    const title = `"${row.title?.replace(/"/g, '""') || ""}"`;
    const artist = `"${row.artist?.replace(/"/g, '""') || ""}"`;
    csvRows.push(`${title},,${artist},,${row.votes}`);
  }
  return csvRows.join("\n");
}

function formatDateLabel(date, includeYear) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(includeYear ? { year: "numeric" } : {}),
  });
}

function formatExportFilename(start, end) {
  return `Hitlist Votes: ${formatDateLabel(start, false)} - ${formatDateLabel(end, true)}`;
}

let failures = 0;
function check(label, condition, detail = "") {
  console.log(`${condition ? "✅" : "❌"} ${label}${detail ? " — " + detail : ""}`);
  if (!condition) failures++;
}

async function main() {
  console.log(`\nMode: ${DRY_RUN ? "DRY RUN (no writes)" : "LIVE (will mutate data!)"}\n`);

  // --- Snapshot "before" state ---
  const { data: activeBefore, error: activeErr } = await supabase
    .from(TABLE_SONGS)
    .select("title, artist, votes")
    .order("votes", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(20);
  if (activeErr) throw activeErr;

  const { data: futureBefore, error: futureErr } = await supabase
    .from(FUTURE_SONGS)
    .select("title, artist, image_url, spotify_link, sort_order");
  if (futureErr) throw futureErr;

  const { data: exportsBefore, error: exportsErr } = await supabase
    .from(TABLE_EXPORTS)
    .select("id, filename, cycle_start")
    .order("cycle_start", { ascending: false });
  if (exportsErr) throw exportsErr;

  console.log(`Active songs before:  ${activeBefore.length}`);
  console.log(`Future songs before:  ${futureBefore.length}`);
  console.log(`Exports before:       ${exportsBefore.length} ->`, exportsBefore.map(e => e.filename));

  if (DRY_RUN) {
    console.log("\nDry run only — skipping writes. Re-run with DRY_RUN=false to execute and verify.\n");
    return;
  }

  // --- 1. Save the snapshot ---
  if (activeBefore.length > 0) {
    const cycleEnd = new Date();
    const cycleStart = new Date(cycleEnd.getTime() - TWO_WEEK_CYCLE_MS);
    const csv = buildCsv(activeBefore);
    const filename = formatExportFilename(cycleStart, cycleEnd);

    const { error: insertErr } = await supabase.from(TABLE_EXPORTS).insert([{
      filename,
      cycle_start: cycleStart.toISOString(),
      cycle_end: cycleEnd.toISOString(),
      csv_content: csv,
    }]);
    if (insertErr) throw insertErr;
    console.log(`\nInserted new export: "${filename}"`);
  }

  // --- 2. Prune to MAX_STORED_EXPORTS ---
  const { data: allExports, error: listErr } = await supabase
    .from(TABLE_EXPORTS)
    .select("id, filename")
    .order("cycle_start", { ascending: false });
  if (listErr) throw listErr;

  if (allExports.length > MAX_STORED_EXPORTS) {
    const stale = allExports.slice(MAX_STORED_EXPORTS);
    const { error: pruneErr } = await supabase.from(TABLE_EXPORTS).delete().in("id", stale.map(e => e.id));
    if (pruneErr) throw pruneErr;
    console.log(`Pruned ${stale.length} old export(s):`, stale.map(e => e.filename));
  }

  // --- 3. Clear votes + active, migrate future -> active, clear future ---
  await supabase.from(TABLE_VOTES).delete().neq("id", 0);
  await supabase.from(TABLE_SONGS).delete().neq("id", 0);

  if (futureBefore.length > 0) {
    const toInsert = futureBefore.map(s => ({ ...s, votes: 0 }));
    const { error: migrateErr } = await supabase.from(TABLE_SONGS).insert(toInsert);
    if (migrateErr) throw migrateErr;
  }
  await supabase.from(FUTURE_SONGS).delete().neq("id", 0);

  // --- Verify "after" state ---
  const { data: exportsAfter } = await supabase
    .from(TABLE_EXPORTS)
    .select("id, filename")
    .order("cycle_start", { ascending: false });

  const { data: activeAfter } = await supabase
    .from(TABLE_SONGS)
    .select("title, artist, votes");

  const { data: futureAfter } = await supabase
    .from(FUTURE_SONGS)
    .select("id");

  console.log("\n--- Assertions ---");
  check(
    "Export table capped at MAX_STORED_EXPORTS",
    exportsAfter.length <= MAX_STORED_EXPORTS,
    `${exportsAfter.length} rows: ${exportsAfter.map(e => e.filename).join(" | ")}`
  );
  check(
    "Active songs count matches future songs count from before",
    activeAfter.length === futureBefore.length,
    `${activeAfter.length} active vs ${futureBefore.length} future`
  );
  check(
    "All migrated active songs have votes reset to 0",
    activeAfter.every(s => s.votes === 0)
  );
  check(
    "Future table is empty after migration",
    futureAfter.length === 0,
    `${futureAfter.length} rows remain`
  );

  console.log(failures === 0 ? "\nAll checks passed.\n" : `\n${failures} check(s) FAILED.\n`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(err => {
  console.error("Test script error:", err);
  process.exit(1);
});
