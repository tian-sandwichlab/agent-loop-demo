import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const sha = execSync("git rev-parse HEAD").toString().trim();
writeFileSync("dist/version.txt", `${sha}\n`);
