import { App } from '@slack/bolt';
import Store from '../store';

const feedbackReminderAction = async (app: App) => {
  const store = Store.getInstance();

  const allReminders = store.getAllReminders();

  allReminders.forEach(async reminder => {
    await app.client.chat.postMessage({
      channel: reminder.userId,
      token: process.env.SLACK_BOT_TOKEN,
      text: `Time to write down some feedback for your colleagues. Don't forget to mention them with @jon.doe in each message.`
    });
  });
};

export default feedbackReminderAction;
