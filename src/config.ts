import * as dotenv from "dotenv";

const config = dotenv.config().parsed!;

if (config) {
  Object.keys(config).forEach(key => {
    process.env[key] = config[key];
  });
}

export namespace Config {
  export namespace Notion {
    export const TOKEN: string = process.env.NOTION_TOKEN!;
  }
  export namespace Slack {
    export const BOT_TOKEN: string = process.env.SLACK_BOT_TOKEN!;
    // Socket Mode only
    export const APP_TOKEN: string = process.env.SLACK_APP_TOKEN!;
    export const SIGNING_SECRET: string = process.env.SLACK_SIGNING_SECRET!;
    export const PORT: number = Number(process.env.PORT) || 5000;
    export const SOCKET_MODE: boolean = !!APP_TOKEN;
  }
}
