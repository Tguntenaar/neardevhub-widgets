import { rename, readFileSync } from "fs";
import replaceInFiles from "replace-in-files";
import { replace } from "./replaceFunc";
import { ReplacementValues } from "./types";

const transpiledPathPrefix = "./build/src";

export async function build(replacementValues: ReplacementValues) {
  // Replace Account Contract Network constants
  replace(replacementValues);

  await replaceInFiles({
    files: [`${transpiledPathPrefix}/**/*.jsx`],
    from: /export\s+default\s+function\s+(\w+)\((.*)/gms,
    to: (_match: string, funcName: string, rest: string) =>
      `function ${funcName}(${rest}\nreturn ${funcName}(props, context);`,
  });

  await replaceInFiles({
    files: [`${transpiledPathPrefix}/**/*.jsx`],
    from: /^export /,
    // NOTE: Empty string is ignored, so we use a function workaround it
    to: () => "",
  });

  // WARNING: Don't allow "imports" in includes as this may lead to undefined
  // behavior as replacements are done in parallel and one file may be getting
  // replacements saved while the other file needs to include it, which ends up
  // with empty content includes.
  await new Promise((resolve) => {
    rename(
      `${transpiledPathPrefix}/includes`,
      `${transpiledPathPrefix}/../../includes`,
      () => {
        resolve("");
      }
    );
  });

  const packageJson = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url)).toString()
  );

  // await replaceInFiles({
  //   files: [`${transpiledPathPrefix}/**/*.jsx`],
  //   from: /^/m,
  //   to: `/*\nLicense: ${packageJson.license}\nAuthor: ${packageJson.author}\nHomepage: ${packageJson.homepage}\n*/\n`,
  // });

  await new Promise((resolve) => {
    rename(
      transpiledPathPrefix,
      `${transpiledPathPrefix}/../../${packageJson.name}`,
      () => {
        resolve("");
      }
    );
  });

  console.log("DONE");
}
