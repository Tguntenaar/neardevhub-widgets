import {
  existsSync,
  readFileSync,
  writeFileSync,
  statSync,
  readdirSync,
} from "fs";
import path from "path";
import { ReplacementValues } from "./types";

export function replace({
  ACCOUNT_ID,
  CONTRACT_ID,
  NETWORK_ENV,
}: ReplacementValues) {
  let CREATOR_REPL = "REPL_DEVHUB";
  let CONTRACT_REPL = "REPL_DEVHUB_CONTRACT";

  // Check if account is provided
  if (!ACCOUNT_ID) {
    console.error(
      "Error: Account is not provided. Please provide the account to deploy the widgets to."
    );
    return;
  }

  // Check if network is provided but not contract
  if (NETWORK_ENV === "testnet" && !CONTRACT_ID) {
    console.error(
      "Error: Network is set to testnet but no contract is provided. Please specify a contract to use with testnet."
    );
    return;
  }

  // Update the value in replacements.json
  let REPLACEMENTS_JSON = `replacements.${NETWORK_ENV}.json`;

  if (existsSync(REPLACEMENTS_JSON)) {
    // Replace the value in the JSON file
    let replacements = JSON.parse(readFileSync(REPLACEMENTS_JSON, "utf8"));
    replacements[CREATOR_REPL] = ACCOUNT_ID;
    replacements[CONTRACT_REPL] = CONTRACT_ID;
    writeFileSync(
      `${REPLACEMENTS_JSON}.tmp`,
      JSON.stringify(replacements, null, 2)
    );
  } else {
    console.error(`Error: ${REPLACEMENTS_JSON} file not found.`);
    process.exit(1);
  }

  // Read the content of the .tmp file
  let replacements = JSON.parse(
    readFileSync(`${REPLACEMENTS_JSON}.tmp`, "utf8")
  );

  // Extract all keys (placeholders to be replaced)
  let keys = Object.keys(replacements);

  // Recursively get all .jsx files
  function getAllFiles(
    dirPath: string,
    arrayOfFiles?: Array<string>
  ): Array<string> {
    let files = readdirSync(dirPath);

    let newArray = arrayOfFiles || [];

    files.forEach(function (file) {
      if (statSync(dirPath + "/" + file).isDirectory()) {
        newArray = getAllFiles(dirPath + "/" + file, newArray);
      } else {
        newArray.push(path.join(dirPath, "/", file));
      }
    });

    return newArray;
  }

  let FILES = getAllFiles("build/src").filter((file) => file.endsWith(".jsx"));

  console.log("Making replacements...");

  // Iterate over each .jsx file again for replacements
  FILES.forEach((file) => {
    let content = readFileSync(file, "utf8");
    console.log(file);
    // Iterate over each key to get the replacement value
    keys.forEach((key) => {
      let replace = replacements[key];
      let search = new RegExp(`\\$\\{${key}\\}`, "g");
      content = content.replace(search, replace);
    });
    writeFileSync(file, content);
  });
}
