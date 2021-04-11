import { App } from '@slack/bolt';
import stopFeedbackCommand from './handlers/stopFeedbackReminder';
import startFeedbackCommand from './handlers/startFeedbackReminder';
import getFeedbackCommand from './handlers/getFeedback';
import getFeedbackForUserAction from './handlers/getFeedbackForUser';
import chatMessageHandler from './handlers/chatMessage';

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_app_TOKEN
});

app.message(chatMessageHandler);
app.command('/start-feedback-reminder', startFeedbackCommand);
app.command('/stop-feedback-reminder', stopFeedbackCommand);
app.command('/get-feedback', getFeedbackCommand);
app.action('get-feedback-for-user', getFeedbackForUserAction);

// cron.schedule('*/10 * * * *', () => feedbackReminderAction(app));

(async () => {
  const port = Number(process.env.PORT) || 3000;

  // Start your app
  await app.start(port);
  console.log(`Feedback Bot is running on ${port}!`);
})();
