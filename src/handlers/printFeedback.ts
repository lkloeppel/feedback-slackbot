import { Middleware, SlackCommandMiddlewareArgs, KnownBlock } from '@slack/bolt';
import groupBy from 'lodash/groupBy';
import Store from '../store';

const printFeedbackCommand: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  client
}) => {
  await ack();

  const store = Store.getInstance();

  const feedbackEntries = store.getAllFeedbackEntriesForUser(command.user_id);

  if (feedbackEntries.length === 0) {
    await client.chat.postMessage({
      channel: command.user_id,
      text: "You don't have collected any feedback so far"
    });

    return;
  }

  const groupedFeedbackEntries = groupBy(feedbackEntries, f => f.receiverId);

  const users = (await client.users.list()).members as any[];

  const feedbackButtons: KnownBlock[] = [];

  for (const [userId, messages] of Object.entries(groupedFeedbackEntries)) {
    const isNoUserFeedback = userId === 'undefined';

    feedbackButtons.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${
          isNoUserFeedback
            ? '*General Feedback*'
            : `*Feedback for ${users.find(u => u.id === userId)?.real_name}*`
        }\n${messages.length} messages`
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          emoji: true,
          text: 'Get feedback'
        },
        value: isNoUserFeedback ? undefined : userId,
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

export default printFeedbackCommand;
