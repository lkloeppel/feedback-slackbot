import { Middleware, SlackCommandMiddlewareArgs, KnownBlock } from '@slack/bolt';
import groupBy from 'lodash/groupBy';
import Store from '../store';

const getFeedbackCommand: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  client
}) => {
  await ack();

  const sessionStore = Store.getInstance();

  const feedbackEntries = sessionStore.getAllFeedbackEntriesForUser(command.user_id);

  if (feedbackEntries.length === 0) {
    await client.chat.postMessage({
      channel: command.user_id,
      text: "You don't have provided any feedback so far"
    });

    return;
  }

  const groupedFeedbackEntries = groupBy(feedbackEntries, f => f.receiverId);

  const users = (await client.users.list()).members as any[];

  const feedbackButtons: KnownBlock[] = [];

  for (const [key, value] of Object.entries(groupedFeedbackEntries)) {
    const isNoUserFeedback = key === 'undefined';

    feedbackButtons.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${
          isNoUserFeedback
            ? '*General Feedback*'
            : `*Feedback for ${users.find(u => u.id === key)?.real_name}*`
        }\n${value.length} messages`
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          emoji: true,
          text: 'Get feedback'
        },
        value: isNoUserFeedback ? undefined : key,
        action_id: 'get-feedback-for-user'
      }
    });
  }

  await client.chat.postMessage({
    channel: command.user_id,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: 'Select the user for whom you want to get the feedback',
          emoji: true
        }
      },
      {
        type: 'divider'
      },
      ...feedbackButtons
    ],
    text: 'Get feedback for user'
  });
};

export default getFeedbackCommand;
