# CIS2253 Cyber Ethics Jeopardy

A modern classroom game with **six cyber ethics categories, 30 questions, four teams, daisyUI styling, instructor scoring and a Slack Socket Mode buzzer**.

## Current deployment status
- The complete **source code is committed** to GitHub.
- **GitHub Pages must be enabled** in your repository settings before the site is publicly accessible.
- **Slack buzzing is not yet active** until the separate backend is configured and deployed with your private tokens.

## Step 1 — Finish Slack installation
In Slack App Management > OAuth & Permissions click **Install to CIS2253**, then **Allow**. Save the `xoxb-` Bot User OAuth Token privately.

Existing slash command: `/buzz`. **Also create** a second slash command:
- Command: `/team`
- Description: `Register a Jeopardy team`
- Usage hint: `1, 2, 3, or 4`

Both commands work through Socket Mode, so no Request URL is necessary. Confirm Interactivity is enabled. Reinstall if Slack prompts for approval or new commands do not appear.

Invite the bot to the desired class channel with `/invite @Cyber Ethics Buzzer`.

## Step 2 — Publish the game on GitHub Pages
In **Repository > Settings > Pages** select **Source: GitHub Actions**. The included workflow `.github/workflows/pages.yml` publishes the static site.

Expected URL once successful:

https://dragasakisn-beep.github.io/cis2253-cyber-ethics-jeopardy/

Check the Actions tab for the **Deploy GitHub Pages** workflow. If Pages reports a deployment failure, verify that GitHub Actions is enabled in repository settings.

## Step 3 — Deploy the Slack backend
1. In Render choose **New > Blueprint**, connect this GitHub repository and select `render.yaml`. Alternatively create a Node Web Service, root directory `backend`, build `npm install`, start `npm start`.
2. Set these **private environment variables** on Render:
   - `SLACK_APP_TOKEN`: your existing `xapp-` app-level Socket Mode token.
   - `SLACK_BOT_TOKEN`: the `xoxb-` token after installing the app.
   - `SLACK_SIGNING_SECRET`: find under Slack app > Basic Information > App Credentials.
   - `SLACK_CHANNEL_ID`: the class Slack channel ID (begins with `C`). In Slack, open channel details and use Copy Channel ID.
   - `INSTRUCTOR_KEY`: a long random secret. The blueprint can generate one; locate it in Render's Environment settings.
   - `FRONTEND_ORIGIN`: `https://dragasakisn-beep.github.io`
3. Deploy. Visit `https://YOUR-SERVICE.onrender.com/health` to verify it reports `ok: true`.
4. On the GitHub Pages game, enter the Render HTTPS URL and your private instructor key; select **Connect**. The key stays only in the instructor browser memory and is not saved by the game.

**Do not upload credentials into GitHub or paste them into a public chat.**

## Step 4 — Run the classroom game
1. Rename the four teams on the Jeopardy board; select **Sync teams**.
2. Select **Post BUZZ IN button to Slack**. The bot posts an interactive button in your class channel.
3. Each student joins a team once by entering `/team 1`, `/team 2`, `/team 3`, or `/team 4` in the class channel.
4. The instructor selects a question to arm the round automatically.
5. Students type `/buzz` or press the Slack button.
6. The first request **received and processed by the backend** wins; the instructor dashboard highlights that student's team.
7. The instructor reveals the answer, awards or deducts points, and selects the next question.

## Security and classroom reliability
- Slack events are authenticated through Slack Bolt; the instructor API requires `INSTRUCTOR_KEY`.
- The bot is restricted to the configured classroom channel.
- Scores and used questions are stored in the instructor browser's local storage; Slack team assignments and current buzzer state live in backend memory.
- Backend restarts erase round and team registration data; game scores persist in the instructor's browser.
- **Do not run multiple backend instances** without a shared datastore.
- Render's free hosting can sleep after inactivity and interrupt Socket Mode; pre-warm and test the service before class. An always-on service is preferable for time-critical competition.
- Slack and network latency mean winning is determined by server receipt order, not physical tap time.

## Repository files
- `index.html`, `style.css`, `questions.js`, `game.js` — GitHub Pages frontend
- `backend/server.js`, `backend/package.json` — Slack Socket Mode backend
- `backend/.env.example` — credential names only; dummy examples, not real secrets
- `render.yaml` — Render blueprint
- `.github/workflows/pages.yml` — GitHub Pages deployment
