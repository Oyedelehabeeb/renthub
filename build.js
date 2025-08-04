// build.js - A build helper for Vercel deployment
import { spawn } from "child_process";
import process from "process";

// Execute vite build using spawn
const build = spawn("npx", ["vite", "build"], {
  stdio: "inherit",
  shell: true,
});

build.on("error", (err) => {
  console.error("Failed to start build process:", err);
  process.exit(1);
});

build.on("close", (code) => {
  process.exit(code);
});
