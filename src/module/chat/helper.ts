import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {ChangeEvent, RefObject} from "react";
dayjs.extend(relativeTime);

export interface IOnlineUsers {
  user_id: string;
  last_online: Date | null;
}

export const checkUserOnline = ({
  onlineUsers,
  user_id,
}: {
  onlineUsers: IOnlineUsers[];
  user_id: string;
}) => {
  if (!onlineUsers) return false;
  return onlineUsers.some(
    (user) => user.user_id === user_id && user.last_online === null
  );
};

export const renderUserStatus = ({
  onlineUsers,
  user_id,
}: {
  onlineUsers: IOnlineUsers[];
  user_id: string;
}) => {
  const user = onlineUsers.find((user) => user.user_id === user_id);
  if (user) {
    if (user.last_online) {
      const lastOnline = dayjs(user.last_online).fromNow();
      return `Last online: ${lastOnline}`;
    }
    return "Online";
  }
  return "Offline";
};

export const scrollToBottom = (ref: RefObject<HTMLDivElement>) => {
  setTimeout(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, 30);
};

export function getImageData(event: ChangeEvent<HTMLInputElement>) {
  // FileList is immutable, so we need to create a new one
  const dataTransfer = new DataTransfer();

  // Add newly uploaded images
  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image)
  );

  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(event.target.files![0]);

  return {files, displayUrl};
}

export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export const getLastName = (name: string): string => {
  return name.split(" ").pop() || "";
};
