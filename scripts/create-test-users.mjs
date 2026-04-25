#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

// Load .env.local
const envPath = path.join(projectRoot, ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [key, ...rest] = trimmed.split("=");
    if (key) {
      envVars[key.trim()] = rest.join("=").trim();
    }
  }
});

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local");
  process.exit(1);
}

if (!SERVICE_ROLE_KEY) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY environment variable not set");
  console.error("   Run: set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const testUsers = [
  {
    email: "admin@khidkee.local",
    password: "admin123456",
    fullName: "Rekha Kumari",
    role: "admin"
  },
  {
    email: "fieldworker@khidkee.local",
    password: "field123456",
    fullName: "Arif Ansari",
    role: "field_worker"
  },
  {
    email: "viewer@khidkee.local",
    password: "view123456",
    fullName: "Neelam Devi",
    role: "view_only"
  }
];

async function createUsers() {
  console.log("🔐 Creating test users in Supabase...\n");

  for (const user of testUsers) {
    try {
      console.log(`Creating user: ${user.email}`);

      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName
        }
      });

      if (error) {
        if (error.message.includes("already exists")) {
          console.log(`  ✓ User already exists (${user.email})`);
        } else {
          console.error(`  ✗ Error: ${error.message}`);
          continue;
        }
      } else {
        console.log(`  ✓ User created with ID: ${data.user.id}`);
      }

      // The team_members record is created by the trigger on auth.users
      console.log(`  ✓ Team member record created via trigger`);
    } catch (err) {
      console.error(`  ✗ Exception: ${err.message}`);
    }
  }

  console.log("\n✅ Test users setup complete!");
  console.log("\nTest accounts:");
  testUsers.forEach((user) => {
    console.log(`  • ${user.email} / ${user.password} (${user.role})`);
  });
}

createUsers().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
