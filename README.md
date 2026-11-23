# CIS2253 Cyber Ethics Jeopardy

A modern daisyUI classroom Jeopardy game with six categories, 30 questions, four teams, instructor scoring, and a Slack Socket Mode buzzer.

## Hosting
GitHub Pages serves the static frontend. Slack tokens and first-buzz processing must run on a separate Node backend (Render or equivalent).

### Slack configuration
- Enable Socket Mode and Interactivity.
- Configure both slash commands `/buzz` and `/team`.
- Bot scopes: `commands` and `chat:write`.
- Install the bot in your classroom Slack channel.
- Never commit Slack access tokens.

### Backend environment variables
`SLACK_APP_TOKEN`, `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `SLACK_CHANNEL_ID`, `INSTRUCTOR_KEY`, `FRONTEND_ORIGIN`.

### Usage
Students enter `/team 1` through `/team 4`, then `/buzz`. An instructor arms each round in the Jeopardy game. The first event received by the server wins; Slack is not guaranteed to be millisecond-fair.

**Deployment:** In GitHub Settings > Pages, set the source to Deploy from a branch, main, root. For Render, deploy the `backend` directory as a Node web service with `npm install` and `npm start`. Set all credentials as private Render environment variables. Free web services can suspend when idle; test before class.
