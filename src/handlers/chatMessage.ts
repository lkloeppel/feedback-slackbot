import { GenericMessageEvent, Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';
import Store from '../store';

const chatMessageHandler: Middleware<SlackEventMiddlewareArgs<'message'>> = async ({
  message,
  client
}) => {
  // We should only handle messages which are send as direct message
  if (message.channel_type === 'im') {
    const chatMessage = message as GenericMessageEvent;

    const mentionedUsers = (chatMessage.text.match(/<@[A-Z0-9]*>/g) ?? []).map(u =>
      u.replace('<@', '').replace('>', '')
    );

    const uniqueMentionedUsers = [...new Set(mentionedUsers)];

    const sessionStore = Store.getInstance();

    if (uniqueMentionedUsers.length === 0) {
      sessionStore.addFeedback(chatMessage.text, chatMessage.user);
    } else {
      uniqueMentionedUsers.forEach(receiver => {
        sessionStore.addFeedback(chatMessage.text, chatMessage.user, receiver);
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
