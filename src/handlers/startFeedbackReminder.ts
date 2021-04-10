import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt';
import Store from '../store';

const startFeedbackReminderCommand: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  client
}) => {
  await ack();

  const sessionStore = Store.getInstance();

  if (sessionStore.doesReminderExist(command.user_id)) {
    await client.chat.postMessage({
      channel: command.user_id,
      text: 'There is already an reminder in place to provide regular feedback'
    });

    return;
  }

  sessionStore.addReminder(command.user_id);

  await client.chat.postMessage({
    channel: command.user_id,
    text: 'Regular reminder created successfully '
  });
};

export default startFeedbackReminderCommand;
