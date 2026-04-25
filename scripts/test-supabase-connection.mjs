import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

// Print any existing env vars to aid debugging
console.log('process.env NEXT_PUBLIC_SUPABASE_URL=', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('process.env NEXT_PUBLIC_SUPABASE_ANON_KEY=', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '[REDACTED]' : undefined);

// Try multiple locations for .env.local to be robust across CWDs and Windows paths
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const candidates = [path.join(scriptDir, "..", ".env.local"), path.join(process.cwd(), ".env.local"), path.join(scriptDir, ".env.local")];
let envPath = candidates.find((p) => fs.existsSync(p));
if (!envPath) {
  console.warn("No .env.local found at:", candidates);
} else {
  const raw = fs.readFileSync(envPath, "utf8");
  raw.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) {
      const key = m[1].trim();
      let val = m[2];
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

(async () => {
  try {
    console.log("Testing Supabase connection to:", url);
    // Try a simple RPC or table select — using `contacts` as a safe, read-only test used in the app
    const { data, error } = await supabase.from("contacts").select("id").limit(1);
    if (error) {
      console.error("Query error:", error);
      process.exit(2);
    }

    console.log("Query succeeded — sample rows:", data);
    // Also test auth status (list users requires service role; so just ping REST)
    const { data: now, error: timeErr } = await supabase.rpc("now");
    if (timeErr) {
      // Not fatal — some projects may not have an rpc named `now`
      console.log("RPC `now` not available (expected sometimes).", timeErr.message);
    } else {
      console.log("RPC now result:", now);
    }

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(3);
  }
})();
