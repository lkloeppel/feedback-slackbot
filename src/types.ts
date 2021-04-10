export interface FeedbackReminder {
  userId: string;
}

export interface Feedback {
  receiverId?: string;
  giverId: string;
  text: string;
  timestamp: string;
}
