import { InlineConfig } from "vite";
import { Render } from "./render";
import { NxxtUserConfig } from "../config";

export interface SSROptions {
  buildOptions: InlineConfig;
  config: NxxtUserConfig;
  runType?: "build" | "dev";
}

export class SSR {
  public buildOptions: InlineConfig;
  public isBuild: boolean = false;
  public config: NxxtUserConfig;

  public constructor({ buildOptions, runType, config }: SSROptions) {
    this.isBuild = runType === "build";
    this.setEnv(runType);
    this.buildOptions = buildOptions;
    this.config = config;
    new Render(this);
  }

  public setEnv(runType: SSROptions["runType"]) {
    process.env.NXXT_RUN_TYPE = runType || "dev";
  }
}
