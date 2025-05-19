import { Timestamp } from "google/protobuf/timestamp";

export const dateToTimestamp = (date: Date): Timestamp => {
  const seconds = Math.floor(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
};

export const timestampToDate = (timestamp: Timestamp) => {
  return new Date(timestamp.seconds * 1_000 + timestamp.nanos / 1_000_000);
};

export const millisecondsToSeconds = (ms: number) => Math.floor(ms / 1_000);
export const secondsToMilliseconds = (seconds: number) => seconds * 1_000;
