import { execSync } from "child_process";
import { watch } from "./watch";

// Function to check if a command is available
function commandExists(command: string) {
  try {
    execSync(`command -v ${command} >/dev/null 2>&1`, {
      stdio: "inherit",
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if bos-loader is installed
if (!commandExists("bos-loader")) {
  // Install bos-loader
  console.log("bos-loader is not installed. Installing...");
  execSync(
    "curl --proto '=https' --tlsv1.2 -LsSf https://github.com/mpeterdev/bos-loader/releases/download/v0.7.1/bos-loader-v0.7.1-installer.sh | sh",
    {
      stdio: "inherit",
    }
  );
}

let ACCOUNT_ID = "devhub.near";
let CONTRACT_ID = "devgovgigs.near";
let NETWORK_ENV = "mainnet";

const args = process.argv.slice(2);

console.log(args);

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case "-a":
    case "--account":
      ACCOUNT_ID = args[++i];
      break;
    case "-c":
    case "--contract":
      CONTRACT_ID = args[++i];
      break;
    case "-n":
    case "--network":
      NETWORK_ENV = args[++i].toLowerCase();
      break;
    default:
      console.error(`Unknown option: ${args[i]}`);
      process.exit(1);
  }
}

if (NETWORK_ENV !== "testnet" && NETWORK_ENV !== "mainnet") {
  console.log("Error! NETWORK can only be testnet or mainnet");
  process.exit(1);
}
console.log(ACCOUNT_ID);
console.log(CONTRACT_ID);
console.log(NETWORK_ENV);

// TODO this is supposed to work async

watch({ ACCOUNT_ID, CONTRACT_ID, NETWORK_ENV });

// Run bos-loader with updated replacements
execSync(`~/.cargo/bin/bos-loader ${ACCOUNT_ID} --path build/src`, {
  stdio: "inherit",
});
