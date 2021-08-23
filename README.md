# Notion Unfurl bot

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/trackrecords/slack-notion-unfurl-bot/tree/master)

## 手順

1. 必要な node_modules のインストール

   ```
   npm i -g yarn
   yarn install
   ```

1. http://api.slack.com/apps?new_app=1 にアクセスして Slack アプリの作成
   - *manifest.yaml の内容をコピーすると以降の手順を省略可能*
   - FYI: [Create and configure apps with manifests](https://api.slack.com/reference/manifests)
1. `App Credentials` の `Signing Secret` をコピーしておく
1. `OAuth % Permissions` に移動、 `Bot Token Scopes` に以下を追加

   - `links:read`
   - `links:write`
1. `Socket Mode` に移動、`Enable Socket Mode` をオンに FYI: [Slack ソケットモードの最も簡単な始め方
](https://qiita.com/seratch/items/1a460c08c3e245b56441)

1. `Install App` に移動、 `Install to Workspace` ボタンからアプリをインストール

   - `Bot User OAuth Access Token` をコピーしておく

1. Notion のトークンの取得

   - 参考: [トークンの取得方法 / How to get your token](https://www.notion.so/How-to-get-your-token-d7a3421b851f406380fb9ff429cd5d47)

1. コピーしていたものを環境変数としてセット *(.env を使う際は `cp _env .env` 後に値をセット)*

   - `SLACK_BOT_TOKEN`: `Bot User OAuth Access Token`
   - `SLACK_SIGNING_SECRET`: `Signing Secret`
   - `SLACK_APP_TOKEN`: `Socket Mode`
   - `NOTION_TOKEN`: 上記で取得した Notion の token

1. bot の起動

   ```
   yarn build && yarn start
   ```

1. bot へのリクエストの forward (Socket Mode ではない場合のみ)

   - [ngrok](https://ngrok.com/) などを利用
     ```
     ngrok http 3000
     ```
     `https://xxxxxxxxxxxx.ngrok.io` のような URL が発行されるためそれをコピーしておく

1. 再び Slack アプリの設定画面に戻り `Event Subscriptions` に移動、チェックボックスを有効化して以下の設定を追加 (Socket Mode ではない場合のみ)

    - `Request URL` に ngrok などが発行した URL + `/slack/events` を入力 (例: https://xxxxxxxxxxxx.ngrok.io/slack/events)
    - `Subscribe to bot events` に `link_shared` を追加
    - `App unfurl domains` に `notion.so` を追加

1. 再インストールする旨のバナーが出てくるのでリンクから再インストールの実行
