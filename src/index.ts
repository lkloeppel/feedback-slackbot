import { App } from '@slack/bolt';
import cron from 'node-cron';
import stopFeedbackCommand from './handlers/stopFeedbackReminder';
import startFeedbackCommand from './handlers/startFeedbackReminder';
import getFeedbackCommand from './handlers/getFeedback';
import getFeedbackForUserAction from './handlers/getFeedbackForUser';
import chatMessageHandler from './handlers/chatMessage';
import feedbackReminderAction from './handlers/feedbackReminder';

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_app_TOKEN
});

app.message(chatMessageHandler);
app.command('/start-feedback-reminder', startFeedbackCommand);
app.command('/stop-feedback-reminder', stopFeedbackCommand);
app.command('/get-feedback', getFeedbackCommand);
app.action('get-feedback-for-user', getFeedbackForUserAction);

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
