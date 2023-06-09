import { typescript } from "projen";
import { deepMerge } from "projen/lib/util";

export interface FooProjectOptions
  extends typescript.TypeScriptProjectOptions {
  /** The directory in which source files reside */
  readonly srcdir: string;

  /**
   * Setup Tailwind as a PostCSS plugin
   */
  readonly tailwind: boolean;
}

export class FooProject extends typescript.TypeScriptAppProject {
  /** The directory in which source files reside */
  public readonly srcdir: string;

  /**
   * Setup Tailwind as a PostCSS plugin
   */
  public readonly tailwind: boolean;

  constructor(options: FooProjectOptions) {
    const defaultOptions = {
      srcdir: "src",
      eslint: false,
      minNodeVersion: "16.20.0",
      jest: false,
      devDeps: [
        "@sveltejs/adapter-auto",
        "@sveltejs/kit",
        "svelte",
        "tslib",
        "vite",
        "svelte-check",
      ],
    };
    super(
      deepMerge([
        defaultOptions,
        options,
        { sampleCode: false },
      ]) as typescript.TypeScriptProjectOptions
    );

    this.srcdir = options.srcdir ?? "src";
    this.tailwind = options.tailwind ?? true;

    this.package.addField("type", "module");
    const devTask = this.tasks.addTask("dev");
    this.tasks.removeTask("build");
    const buildTask = this.tasks.addTask("build");
    devTask.exec("vite dev");
    buildTask.exec("vite build");

    const checkTask = this.tasks.addTask("check");

    checkTask.exec(
      "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"
    );

    if (this.tailwind) {
      this.addDevDeps("postcss");
      this.addDevDeps("autoprefixer");
      this.addDevDeps("tailwindcss");
    }
  }
}
