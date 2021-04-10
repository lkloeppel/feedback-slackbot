import { GenericMessageEvent, Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';
import Store from '../store';

const chatMessageHandler: Middleware<SlackEventMiddlewareArgs<'message'>> = async ({
  message,
  client
}) => {
  if (message.channel_type === 'im') {
    const sessionStore = Store.getInstance();

    const chatMessage = message as GenericMessageEvent;

    const mentionedUsers = (chatMessage.text.match(/<@[A-Z0-9]*>/g) ?? []).map(u =>
      u.replace('<@', '').replace('>', '')
    );

    const uniqueMentionedUsers = [...new Set(mentionedUsers)];

    if (uniqueMentionedUsers.length === 0) {
      sessionStore.addFeedback(chatMessage.user, undefined, chatMessage.text);
    } else {
      uniqueMentionedUsers.forEach(receiver => {
        sessionStore.addFeedback(chatMessage.user, receiver, chatMessage.text);
      });
    }

    client.reactions.add({
      channel: message.channel,
      name: 'white_check_mark',
      timestamp: message.event_ts
    });
  }
};

export default chatMessageHandler;
