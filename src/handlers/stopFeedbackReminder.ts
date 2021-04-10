import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt';
import Store from '../store';

const stopFeedbackReminderCommand: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  client
}) => {
  await ack();

  const sessionStore = Store.getInstance();

  if (!sessionStore.doesReminderExist(command.user_id)) {
    await client.chat.postMessage({
      channel: command.user_id,
      text: `You currently do not have an active reminder configured`
    });

    return;
  }

  sessionStore.removeReminder(command.user_id);

  await client.chat.postMessage({
    channel: command.user_id,
    text: `Deleted feedback reminder`
  });
};

export default stopFeedbackReminderCommand;
