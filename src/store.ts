import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Feedback, FeedbackReminder } from './types';

dayjs.extend(utc);

class Store {
  private static instance: Store;

  private reminders: FeedbackReminder[] = [{ userId: 'U01BMRH0UCC' }];

  private feedbackEntries: Feedback[] = [
    {
      giverId: 'U01BMRH0UCC',
      receiverId: 'U01U2E39QTW',
      text: '<@U01U2E39QTW> is amazing',
      timestamp: '2021-04-10T13:29:06Z'
    },
    {
      giverId: 'U01BMRH0UCC',
      receiverId: 'U01U2E39QTW',
      text: '<@U01U2E39QTW> and <@U01B8TY16GN> are good',
      timestamp: '2021-04-10T13:31:21Z'
    },
    {
      giverId: 'U01BMRH0UCC',
      receiverId: 'U01B8TY16GN',
      text: '<@U01U2E39QTW> and <@U01B8TY16GN> are good',
      timestamp: '2021-04-10T13:31:21Z'
    },
    {
      giverId: 'U01BMRH0UCC',
      receiverId: 'U01U2E39QTW',
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor <@U01U2E39QTW>',
      timestamp: '2021-04-10T13:32:07Z'
    },
    {
      giverId: 'U01BMRH0UCC',
      receiverId: undefined,
      text: 'Nice message',
      timestamp: '2021-04-10T13:33:34Z'
    },
    {
      giverId: 'U01BMRH0UCC',
      receiverId: undefined,
      text: 'Test',
      timestamp: '2021-04-10T13:35:33Z'
    }
  ];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  doesReminderExist(userId: string) {
    return !!this.reminders.find(s => s.userId === userId);
  }

  addReminder(userId: string) {
    if (!this.doesReminderExist(userId)) {
      this.reminders.push({
        userId
      });
    }
  }

  getFeedbackEntries(giverId: string, receiverId: string) {
    return this.feedbackEntries.filter(f => f.receiverId === receiverId && f.giverId === giverId);
  }

  getAllFeedbackEntriesForUser(giverId: string) {
    return this.feedbackEntries.filter(f => f.giverId === giverId);
  }

  getAllReminders() {
    return this.reminders;
  }

  addFeedback(giverId: string, receiverId: string, text: string) {
    this.feedbackEntries.push({
      giverId,
      receiverId,
      text,
      timestamp: dayjs().utc().format()
    });
  }

  removeReminder(userId: string) {
    if (this.doesReminderExist(userId)) {
      this.reminders.splice(this.reminders.findIndex(r => r.userId === userId));
    }
  }

  static getInstance() {
    if (!Store.instance) {
      Store.instance = new Store();
    }

    return Store.instance;
  }
}

export default Store;
