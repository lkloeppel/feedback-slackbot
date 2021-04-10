import { App } from '@slack/bolt';
import stopFeedbackCommand from './handlers/stopFeedbackReminder';
import startFeedbackCommand from './handlers/startFeedbackReminder';
import getFeedbackCommand from './handlers/getFeedback';
import getFeedbackForUserAction from './handlers/getFeedbackForUser';
import chatMessageHandler from './handlers/chatMessage';

const bot = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});

bot.message(chatMessageHandler);
bot.command('/start-feedback-reminder', startFeedbackCommand);
bot.command('/stop-feedback-reminder', stopFeedbackCommand);
bot.command('/get-feedback', getFeedbackCommand);
bot.action('get-feedback-for-user', getFeedbackForUserAction);

// cron.schedule('*/10 * * * *', () => feedbackReminderAction(bot));

(async () => {
  // Start your app
  await bot.start(Number(process.env.PORT) || 3000);
})();
