import { App, GenericMessageEvent } from '@slack/bolt';

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_app_TOKEN
});

// Listens to all incoming direct messages
app.message(async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there <@${(message as GenericMessageEvent).user}>!`);
});

(async () => {
  const port = Number(process.env.PORT) || 3000;

  // Start your app
  await app.start(port);
  console.log(`Feedback Bot is running on ${port}!`);
})();
