declare module "replace-in-files";

declare function replaceInFiles(params: {
  files: string[];
  from: string;
  to: () => void;
});
