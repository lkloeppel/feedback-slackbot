import {
  BlockAction,
  ButtonAction,
  Middleware,
  MrkdwnElement,
  SlackActionMiddlewareArgs
} from '@slack/bolt';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Store from '../store';

dayjs.extend(utc);

const getFeedbackForUserAction: Middleware<
  SlackActionMiddlewareArgs<BlockAction<ButtonAction>>
> = async ({ body, payload, ack, client }) => {
  await ack();

  const receiverId = payload.value;

  const giverId = body.user.id;

  const sessionStore = Store.getInstance();

  const feedback = sessionStore.getFeedbackEntries(giverId, receiverId);

  const name = receiverId ? `for <@${receiverId}>` : '';

  if (!feedback || feedback.length === 0) {
    await client.chat.postMessage({
      channel: giverId,
      text: `No feedback was collected ${name}`
    });

    return;
  }

  const feedbackMessages: MrkdwnElement[] = feedback.map(f => {
    return {
      type: 'mrkdwn',
      text: `*${dayjs.utc(f.timestamp).local().format('DD/MM/YYYY hh:mm a')}:*\n${f.text}`
    };
  });

  await client.chat.postMessage({
    channel: giverId,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Your collected feedback ${name}`
        }
      },
      {
        type: 'section',
        fields: feedbackMessages
      }
    ],
    text: `Your collected feedback ${name}`
  });
};

export default getFeedbackForUserAction;
