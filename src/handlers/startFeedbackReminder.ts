import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt';
import Store from '../store';

const startFeedbackReminderCommand: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  client
}) => {
  await ack();

  const store = Store.getInstance();

  if (store.doesReminderExist(command.user_id)) {
    await client.chat.postMessage({
      channel: command.user_id,
      text: 'There is already a reminder in place to provide regular feedback'
    });

    return;
  }

  store.addReminder(command.user_id);

  await client.chat.postMessage({
    channel: command.user_id,
    text: 'Regular reminder created successfully '
  });
};

export default startFeedbackReminderCommand;
