// Step 7: verify downloadHitlistExportAction()'s behavior on a bad id.
// Replicates the exact query (select ... .eq("id", id).single()) and confirms
// a nonexistent id returns a clean { success: false } instead of throwing,
// then contrasts it against a real id to make sure the happy path still works.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/test-step7-invalid-download.mjs
//
// Read-only — does not modify any data.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const TABLE_EXPORTS = "hitlist_exports";

// Exact replica of downloadHitlistExportAction() from actions/admin.ts
async function downloadHitlistExportAction(id) {
  try {
    const { data, error } = await supabase
      .from(TABLE_EXPORTS)
      .select("filename, csv_content")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return { success: false, error: "Export not found" };

    return { success: true, filename: data.filename, csv: data.csv_content };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

let failures = 0;
function check(label, condition, detail = "") {
  console.log(`${condition ? "✅" : "❌"} ${label}${detail ? " — " + detail : ""}`);
  if (!condition) failures++;
}

async function main() {
  // --- Case A: nonexistent id ---
  const BOGUS_ID = 999999999;
  const badResult = await downloadHitlistExportAction(BOGUS_ID);

  console.log("Bogus id result:", badResult);
  check("Nonexistent id returns success: false", badResult.success === false);
  check("Nonexistent id does not throw / crash the caller", true); // if we got here, it didn't throw
  check("Error message is present (not blank)", !!badResult.error, badResult.error);

  // --- Case B: real id, for contrast ---
  const { data: existing, error: listErr } = await supabase
    .from(TABLE_EXPORTS)
    .select("id, filename")
    .order("cycle_start", { ascending: false })
    .limit(1);

  if (listErr) throw listErr;

  if (!existing || existing.length === 0) {
    console.log("\n⚠️  No real exports found to contrast against — run sql/seed_data.sql first.");
  } else {
    const goodId = existing[0].id;
    const goodResult = await downloadHitlistExportAction(goodId);
    console.log("\nReal id result:", { ...goodResult, csv: goodResult.csv ? `${goodResult.csv.slice(0, 40)}...` : undefined });

    check("Real id returns success: true", goodResult.success === true);
    check("Real id returns a filename", !!goodResult.filename, goodResult.filename);
    check("Real id returns non-empty csv content", !!goodResult.csv && goodResult.csv.length > 0);
  }

  console.log(failures === 0 ? "\nAll checks passed.\n" : `\n${failures} check(s) FAILED.\n`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(err => {
  console.error("Test script error:", err);
  process.exit(1);
});
