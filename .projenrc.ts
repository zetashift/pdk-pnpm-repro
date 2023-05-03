import { javascript } from "projen";
import { NxMonorepoProject } from "@aws-prototyping-sdk/nx-monorepo";
import { FooProject } from "./FooProject"

const project = new NxMonorepoProject({
  defaultReleaseBranch: "main",
  devDeps: ["@aws-prototyping-sdk/nx-monorepo"],
  name: "foo",
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // packageName: undefined,  /* The "name" in package.json. */
  gitignore: [".direnv", ".devenv"]
});

new FooProject({
  name: "fooy",
  defaultReleaseBranch: "main",
  srcdir: "src",
  tailwind: true,
  outdir: "packages/fooy",
  devDeps: [
    "flowbite", "flowbite-svelte", "classnames", "@popperjs/core"
  ]
})

project.synth();