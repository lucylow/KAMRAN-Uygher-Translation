import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const strict = process.argv.includes("--strict");
const requiredFiles = [
  "app.config.ts",
  "eas.json",
  "assets/images/icon.png",
  "assets/images/splash-icon.png",
  "assets/images/favicon.png",
  "docs/app-store/metadata.md",
  "docs/app-store/privacy-policy.md",
  "docs/app-store/release-checklist.md",
  "docs/app-store/device-test-matrix.md",
  "docs/app-store/release-manifest.json",
];

const failures = [];
const warnings = [];
const read = (file) => readFileSync(join(root, file), "utf8");

for (const file of requiredFiles) {
  if (!existsSync(join(root, file)))
    failures.push(`Missing required release file: ${file}`);
}

const config = read("app.config.ts");
const packageJson = JSON.parse(read("package.json"));
const easJson = JSON.parse(read("eas.json"));
const privacyDraft = read("docs/app-store/privacy-policy.md");
const releaseManifest = JSON.parse(
  read("docs/app-store/release-manifest.json"),
);

for (const placeholder of [
  "TO_BE_REPLACED",
  "REPLACE_WITH_SUPPORT_EMAIL",
  "REPLACE_WITH_PUBLIC_PRIVACY_POLICY_URL",
]) {
  if (config.includes(placeholder) || privacyDraft.includes(placeholder)) {
    const message = `Owner action required before submission: replace ${placeholder}`;
    if (strict) failures.push(message);
    else warnings.push(message);
  }
}

for (const required of [
  "KAMRAN Translate",
  "com.app.kamran",
  "version:",
  "buildNumber:",
  "privacyManifests",
  "NSMicrophoneUsageDescription",
  "NSCameraUsageDescription",
  "expo-camera",
]) {
  if (!config.includes(required))
    failures.push(`Expo config is missing expected release field: ${required}`);
}

const version = config.match(/version:\s*"([^"]+)"/)?.[1];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  failures.push(
    `Expo version must use semantic numeric form, received: ${version ?? "missing"}`,
  );
}

const buildNumber = config.match(/buildNumber:\s*"([^"]+)"/)?.[1];
const bundleIdentifier = config.match(/bundleIdentifier:\s*env\.iosBundleId/)
  ? "com.app.kamran"
  : undefined;
if (!buildNumber || !/^\d+$/.test(buildNumber) || Number(buildNumber) < 1) {
  failures.push(
    `iOS buildNumber must be a positive integer, received: ${buildNumber ?? "missing"}`,
  );
}

const manifestPairs = [
  ["appName", "KAMRAN Translate"],
  ["slug", "kamran"],
  ["iosBundleIdentifier", bundleIdentifier],
  ["version", version],
  ["iosBuildNumber", buildNumber],
  ["orientation", "portrait"],
];
for (const [key, expected] of manifestPairs) {
  if (releaseManifest[key] !== expected)
    failures.push(
      `Release manifest mismatch for ${key}: expected ${expected ?? "missing"}`,
    );
}
if (releaseManifest.supportsTablet !== false)
  failures.push("Release manifest must declare supportsTablet as false");
if (releaseManifest.requiredPermissions?.microphone !== true)
  failures.push("Release manifest must declare microphone permission usage");
if (releaseManifest.requiredPermissions?.camera !== true)
  failures.push("Release manifest must declare camera permission usage");

if (
  !easJson.build?.production ||
  easJson.build.production.autoIncrement !== true
) {
  failures.push("eas.json production profile must enable autoIncrement");
}
if (!easJson.submit?.production)
  failures.push("eas.json must define a production submit profile");

function pngDimensions(file) {
  const buffer = readFileSync(join(root, file));
  if (
    buffer.readUInt32BE(0) !== 0x89504e47 ||
    buffer.toString("ascii", 1, 4) !== "PNG"
  )
    return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

for (const [file, expected] of [
  ["assets/images/icon.png", 1024],
  ["assets/images/splash-icon.png", 1024],
]) {
  const dimensions = pngDimensions(file);
  if (
    !dimensions ||
    dimensions.width !== expected ||
    dimensions.height !== expected
  ) {
    failures.push(`${file} must be a ${expected}x${expected} PNG`);
  }
}

for (const script of [
  "check",
  "lint",
  "test",
  "ios:preflight",
  "ios:preflight:strict",
  "eas:build:preview",
  "eas:build:production",
  "eas:submit:production",
]) {
  if (!packageJson.scripts?.[script])
    failures.push(`package.json is missing validation script: ${script}`);
}

if (failures.length) {
  console.error("iOS release preflight failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `iOS release preflight passed${strict ? " in strict mode" : ""} for project configuration and required release files.`,
);
for (const warning of warnings) console.warn(`WARNING: ${warning}`);
console.log(
  "Manual gates remain: replace support/privacy placeholders, run a physical-device TestFlight pass, and complete App Store Connect metadata and privacy declarations.",
);
