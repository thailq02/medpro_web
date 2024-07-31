"use client";
import {
  IConversationBody,
  IConversationWithLastMessage,
} from "@/apiRequest/ApiConversation";
import {AppContext} from "@/app/(home)/AppProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import socket from "@/lib/socket";
import {
  IOnlineUsers,
  checkUserOnline,
  normalizeString,
} from "@/module/chat/helper";
import {MagnifyingGlassIcon} from "@radix-ui/react-icons";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import dynamic from "next/dynamic";
import Image from "next/image";
import {useRouter, useSearchParams} from "next/navigation";
import {useContext, useEffect, useState} from "react";
import styles from "./Chat.module.scss";
const ConversationPage = dynamic(
  () => import("@/module/chat/ConversationPage"),
  {ssr: false}
);

dayjs.extend(relativeTime);

export default function ChatPage() {
  const {user} = useContext(AppContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const username = searchParams.get("username");
  const [onlineUsers, setOnlineUsers] = useState<IOnlineUsers[]>([]);
  const [messages, setMessages] = useState<IConversationBody[]>([]);
  const [userSelected, setUserSelected] =
    useState<IConversationWithLastMessage | null>(null);
  const [allUser, setAllUser] = useState<IConversationWithLastMessage[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  // useEffect(() => {
  //   socket.connect();
  // }, []);

  useEffect(() => {
    if (!user || !user._id) return;
    socket.on("online_users", (data: IOnlineUsers[]) => {
      console.log("online_users", data);
      setOnlineUsers(data);
    });
  }, [user]);

  useEffect(() => {
    if (!user || !user._id) return;
    socket.emit("sidebar", user._id);
    socket.on("conversation", (data: IConversationWithLastMessage[]) => {
      setAllUser(data);
    });
  }, [user]);
  const filteredUsers = allUser.filter((user) =>
    normalizeString(user.name).includes(normalizeString(searchValue.trim()))
  );

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.sideBar}>
            <h2 className={styles.title}>Đoạn chat</h2>
            <div className={styles.search}>
              <MagnifyingGlassIcon className="w-6 h-6 flex-shrink-0" />
              <input
                type="search"
                placeholder="Search Messenger"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className={styles.chatContainer}>
              {filteredUsers.map((user) => (
                <div
                  className={clsx(
                    styles.chatBox,
                    (user.username === userSelected?.username ||
                      user.username === username) &&
                      styles.active
                  )}
                  key={user?._id}
                  role="button"
                  onClick={() => {
                    setUserSelected(user);
                    if (userSelected?.username !== user.username) {
                      setMessages([]);
                    }
                    if (searchParams) {
                      router.push("/chat");
                    }
                  }}
                >
                  <TooltipProvider delayDuration={100}>
                    <div className={styles.avatar}>
                      <Image
                        src={user?.avatar || "/img/avatar/avatar.jpg"}
                        alt="avatar"
                        width={150}
                        height={150}
                      />
                      {checkUserOnline({
                        onlineUsers,
                        user_id: user?._id as string,
                      }) && (
                        <div className={styles.circle}>
                          <div className={styles.online}></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h3 className={styles.name}>{user?.name}</h3>
                        </TooltipTrigger>
                        <TooltipContent>{user?.name}</TooltipContent>
                      </Tooltip>
                      <p className={styles.msg}>
                        {user?.lastMessage?.sender_id !== user._id
                          ? user?.lastMessage?.imgUrl &&
                            user?.lastMessage?.content === ""
                            ? "Bạn vừa gửi một hình ảnh"
                            : `Bạn: ${user?.lastMessage?.content}`
                          : user?.lastMessage?.imgUrl &&
                            user?.lastMessage?.content === ""
                          ? `${user?.name} vừa gửi một hình ảnh`
                          : user?.lastMessage?.content}
                      </p>
                    </div>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
          {(userSelected || username) && (
            <ConversationPage
              userSelected={userSelected as IConversationWithLastMessage}
              onlineUsers={onlineUsers}
              messages={messages}
              setMessages={setMessages}
              username={username || ""}
            />
          )}
        </div>
      </div>
    </>
  );
}
