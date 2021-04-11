import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Feedback, FeedbackReminder } from './types';

dayjs.extend(utc);

class Store {
  private static instance: Store;

  private reminders: FeedbackReminder[] = [];

  private feedbackEntries: Feedback[] = [];

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

  removeReminder(userId: string) {
    if (this.doesReminderExist(userId)) {
      this.reminders.splice(this.reminders.findIndex(r => r.userId === userId));
    }
  }

  getAllReminders() {
    return [...this.reminders];
  }

  getFeedbackEntries(giverId: string, receiverId: string) {
    return [
      ...this.feedbackEntries.filter(f => f.receiverId === receiverId && f.giverId === giverId)
    ];
  }

  getAllFeedbackEntriesForUser(giverId: string) {
    return [...this.feedbackEntries.filter(f => f.giverId === giverId)];
  }

  addFeedback(giverId: string, receiverId: string, text: string) {
    this.feedbackEntries.push({
      giverId,
      receiverId,
      text,
      timestamp: dayjs().utc().format()
    });
  }

  static getInstance() {
    if (!Store.instance) {
      Store.instance = new Store();
    }

    return Store.instance;
  }
}

export default Store;
