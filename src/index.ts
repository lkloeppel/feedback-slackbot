import { App } from '@slack/bolt';
import cron from 'node-cron';
import stopFeedbackCommand from './handlers/stopFeedbackReminder';
import startFeedbackCommand from './handlers/startFeedbackReminder';
import printFeedbackCommand from './handlers/printFeedback';
import getFeedbackForUserAction from './handlers/getFeedbackForUser';
import chatMessageHandler from './handlers/chatMessage';
import feedbackReminderAction from './handlers/feedbackReminder';

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});

app.message(chatMessageHandler);
app.command('/start-feedback-reminder', startFeedbackCommand);
app.command('/stop-feedback-reminder', stopFeedbackCommand);
app.command('/print-feedback', printFeedbackCommand);
app.action('get-feedback-for-user', getFeedbackForUserAction);

// https://crontab.guru/#0_14_*_*_FRI
cron.schedule('0 14 * * FRI', () => feedbackReminderAction(app), {
  timezone: 'Australia/Melbourne'
});

(async () => {
  const port = Number(process.env.PORT) || 3000;

  // Start your app
  await app.start(port);
  // eslint-disable-next-line no-console
  console.log(`Feedback Bot is running on ${port}!`);
})();
