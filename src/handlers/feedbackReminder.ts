import { App } from '@slack/bolt';
import Store from '../store';

const feedbackReminderAction = async (bot: App) => {
  const sessionStore = Store.getInstance();

  const allReminders = sessionStore.getAllReminders();

  allReminders.forEach(async reminder => {
    await bot.client.chat.postMessage({
      channel: reminder.userId,
      token: process.env.SLACK_BOT_TOKEN,
      text: `Time to write down some feedback for your colleagues. Don't forget to mention them with @jon.doe in each message.`
    });
  });
};

export default feedbackReminderAction;
