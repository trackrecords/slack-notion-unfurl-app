import { App, KnownBlock } from "@slack/bolt";
import Notion from "notion-api-js";
import { toUUID } from "to-uuid";

const notionToken: string = process.env.NOTION_TOKEN!;
const botToken: string = process.env.SLACK_BOT_TOKEN!;

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: botToken,
});

const notion = new Notion({
  token: notionToken,
  options: {},
});

const extractPageIdFromUrl = (url: string) =>
  toUUID(url.match(/notion\.so(?:\/[^/]+)?\/(?:.+\-)?([0-9a-f]+)/)[1]);

// https://api.slack.com/reference/messaging/link-unfurling#slack_app_unfurling
app.event("link_shared", async ({ event }) => {
  const unfurls: { [url: string]: { blocks: KnownBlock[] } } = {};

  await Promise.all(
    event.links.map(async ({ url }) => {
      const id = extractPageIdFromUrl(url);
      const page = await notion.getPageById(id);
      if (!page.Attributes) return;
      const { title, teaser, cover } = page.Attributes;
      const blocks: KnownBlock[] = [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: title || "Notion",
            emoji: true,
          },
        },
      ];
      if (teaser) {
        if (cover) {
          blocks.push({
            type: "section",
            text: {
              type: "mrkdwn",
              text: teaser,
            },
            accessory: {
              type: "image",
              image_url: cover,
              alt_text: title,
            },
          });
        } else {
          blocks.push({
            type: "section",
            text: {
              type: "mrkdwn",
              text: teaser,
            },
          });
        }
      }
      blocks.push({
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Open via <${url.replace(/^https/, "notion")}|Notion App>`,
          },
        ],
      });
      unfurls[url] = { blocks };
    })
  );

  await app.client.chat.unfurl({
    token: botToken,
    channel: event.channel,
    ts: event.message_ts,
    unfurls,
  });
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Notion Unfurl app is running!");
})();
