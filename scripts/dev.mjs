import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const processes = [
  spawn(
    process.execPath,
    [resolve(root, "node_modules/vite/bin/vite.js"), "dev"],
    { cwd: root, stdio: "inherit" },
  ),
  spawn(process.execPath, ["--import", "tsx", "src/index.ts"], {
    cwd: resolve(root, "server"),
    stdio: "inherit",
  }),
];

let shuttingDown = false;

function stopProcesses(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of processes) {
    if (child.exitCode === null && !child.killed) child.kill(signal);
  }
}

for (const child of processes) {
  child.on("error", (error) => {
    console.error("Failed to start development process:", error);
    process.exitCode = 1;
    stopProcesses("SIGTERM");
  });
  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    if (code !== 0) {
      console.error(`Development process stopped (${signal || `exit code ${code}`}).`);
      process.exitCode = code ?? 1;
      stopProcesses("SIGTERM");
    }
  });
}

process.on("SIGINT", () => stopProcesses("SIGINT"));
process.on("SIGTERM", () => stopProcesses("SIGTERM"));
