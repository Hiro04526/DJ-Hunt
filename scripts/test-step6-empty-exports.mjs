// Step 6: verify the "no exports yet" state.
// Clears hitlist_exports, then runs the same query getHitlistExportsAction()
// uses, and confirms it succeeds with an empty array (rather than erroring) —
// that's what drives the "No exports yet." message in export-menu.tsx.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/test-step6-empty-exports.mjs
//
// This DOES delete all rows from hitlist_exports. Re-run seed_data.sql
// afterwards if you want your dummy exports back.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const TABLE_EXPORTS = "hitlist_exports";

let failures = 0;
function check(label, condition, detail = "") {
  console.log(`${condition ? "✅" : "❌"} ${label}${detail ? " — " + detail : ""}`);
  if (!condition) failures++;
}

async function main() {
  console.log("Clearing hitlist_exports...");
  const { error: deleteErr } = await supabase.from(TABLE_EXPORTS).delete().gt("id", 0);
  check("Clearing the table did not error", !deleteErr, deleteErr?.message);

  // Replicates getHitlistExportsAction() exactly
  const { data, error } = await supabase
    .from(TABLE_EXPORTS)
    .select("id, filename, cycle_start, cycle_end, created_at")
    .order("cycle_start", { ascending: false });

  check("Query on empty table succeeds (no error)", !error, error?.message);
  check("Query returns an empty array", Array.isArray(data) && data.length === 0, `got ${data?.length} rows`);

  console.log("\nExpected UI result: export-menu.tsx should render");
  console.log('"No exports yet. One is saved automatically each time a cycle resets."');

  console.log(failures === 0 ? "\nAll checks passed.\n" : `\n${failures} check(s) FAILED.\n`);
  console.log("Tip: run sql/seed_data.sql again to restore dummy exports.\n");
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(err => {
  console.error("Test script error:", err);
  process.exit(1);
});
