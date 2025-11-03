export const RecordingMode = {
  Transcript: "transcript",
  ScreenRecording: "screen_recording",
} as const;

export type RecordingMode = (typeof RecordingMode)[keyof typeof RecordingMode];

export const RecordingStatus = {
  Initiated: "initiated",
  Active: "active",
  Stopped: "stopped",
  Saved: "saved",
  Aborted: "aborted",
  FailedToStart: "failedToStart",
  FailedToStop: "failedToStop",
  NotificationSucceed: "notification_succeeded",
} as const;

export type RecordingStatus =
  (typeof RecordingStatus)[keyof typeof RecordingStatus];
