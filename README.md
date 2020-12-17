# Notion Unfurl bot

## 手順

1. 必要な node_modules のインストール

   ```
   npm i -g yarn
   yarn install
   ```

2. http://api.slack.com/apps?new_app=1 にアクセスして Slack アプリの作成
3. `App Credentials` の `Signing Secret` をコピーしておく
4. `OAuth % Permissions` に移動、 `Bot Token Scopes` に以下を追加

   - `links:read`
   - `links:write`

5. `Install App` に移動、 `Install to Workspace` ボタンからアプリをインストール

   - `Bot User OAuth Access Token` をコピーしておく

6. Notion のトークンの取得

   - 参考: [トークンの取得方法 / How to get your token](https://www.notion.so/How-to-get-your-token-d7a3421b851f406380fb9ff429cd5d47)

7. コピーしていたものを環境変数としてセット

   - `SLACK_BOT_TOKEN`: `Bot User OAuth Access Token`
   - `SLACK_SIGNING_SECRET`: `Signing Secret`
   - `NOTION_TOKEN`: 上記で取得した Notion の token

8. bot の起動

   ```
   yarn start
   ```

9. bot へのリクエストの forward

   - [ngrok](https://ngrok.com/) などを利用
     ```
     ngrok http 3000
     ```
     `https://xxxxxxxxxxxx.ngrok.io` のような URL が発行されるためそれをコピーしておく

10. 再び Slack アプリの設定画面に戻り `Event Subscriptions` に移動、チェックボックスを有効化して以下の設定を追加

    - `Request URL` に ngrok などが発行した URL + `/slack/events` を入力 (例: https://xxxxxxxxxxxx.ngrok.io/slack/events)
    - `Subscribe to bot events` に `link_shared` を追加
    - `App unfurl domains` に `notion.so` を追加

11. 再インストールする旨のバナーが出てくるのでリンクから再インストールの実行

12. Notion Unfurl bot を有効化したい チャンネルに bot を invite
