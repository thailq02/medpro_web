"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import apiConversation, {
  IConversationBody,
  IConversationWithLastMessage,
} from "@/apiRequest/ApiConversation";
import ApiUploadImage from "@/apiRequest/ApiUploadImage";
import {AppContext} from "@/app/(home)/AppProvider";
import {CirclePlusIcon, SpinnerIcon} from "@/components/Icon";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import socket from "@/lib/socket";
import {
  IOnlineUsers,
  checkUserOnline,
  getImageData,
  renderUserStatus,
  scrollToBottom,
} from "@/module/chat/helper";
import {FaceIcon, ImageIcon, PaperPlaneIcon} from "@radix-ui/react-icons";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import clsx from "clsx";
import dayjs from "dayjs";
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import Image from "next/image";
import {
  FormEvent,
  UIEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Chat.module.scss";

interface IConversationProps {
  userSelected: IConversationWithLastMessage;
  onlineUsers: IOnlineUsers[];
  messages: IConversationBody[];
  setMessages: (
    value:
      | IConversationBody[]
      | ((prev: IConversationBody[]) => IConversationBody[])
  ) => void;
  username: string;
}

export default function ConversationPage({
  userSelected,
  onlineUsers,
  messages,
  setMessages,
  username,
}: IConversationProps) {
  const {user} = useContext(AppContext);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isTextareaScrolled, setIsTextareaScrolled] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [openImageUpload, setOpenImageUpload] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [preview, setPreview] = useState<string>("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);

  useEffect(() => {
    const adjustTextareaHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        setIsTextareaScrolled(textarea.scrollHeight >= 53);
      }
    };
    if (textareaRef.current) {
      textareaRef.current.addEventListener("input", adjustTextareaHeight);
    }
    return () => {
      if (textareaRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        textareaRef.current.removeEventListener("input", adjustTextareaHeight);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "a" && event.ctrlKey) {
        event.preventDefault();
        if (textareaRef.current) {
          textareaRef.current.select();
        }
      } else if (
        event.key === "Backspace" &&
        textareaRef.current?.selectionStart === 0 &&
        textareaRef.current?.selectionEnd === textareaRef.current.value.length
      ) {
        setValue("");
        textareaRef.current.style.height = "auto";
        setIsTextareaScrolled(false);
      }
    };
    if (textareaRef.current) {
      textareaRef.current.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      if (textareaRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        textareaRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

  const usenameSelected = username ? username : userSelected?.username;

  const {data: userByUsername} = useQuery({
    queryKey: [QUERY_KEY.GET_USER_BY_USERNAME, usenameSelected],
    queryFn: () => apiAuthRequest.getUserByUsername(usenameSelected),
    enabled: !!usenameSelected,
  });

  const {
    data: conversations,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      QUERY_KEY.GET_CONVERSATION_BY_RECEIVER_ID,
      {receiver_id: userByUsername?.payload?.data?._id as string},
    ],
    queryFn: ({pageParam}) => {
      return apiConversation.getByReceiverId({
        receiver_id: userByUsername?.payload?.data?._id as string,
        params: {limit: 10, page: pageParam},
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (
        lastPage.payload.meta.total_page === lastPage.payload.meta.current_page
      ) {
        return undefined;
      }
      return (lastPage.payload.meta.current_page as number) + 1;
    },
    enabled: !!userByUsername?.payload?.data?._id,
  });

  useEffect(() => {
    if (!user || !user._id) return;
    socket.on("receive_message", (data: {payload: IConversationBody}) => {
      console.log(data);
      const {payload} = data;
      setMessages((message) => [...message, payload]);
      scrollToBottom(chatContainerRef);
    });
    socket.on("connect_error", (err: any) => {
      console.log(err.data);
    });
    socket.on("disconnect", (reason) => {
      console.log(reason);
    });
    return () => {
      socket.disconnect();
    };
  }, [setMessages, user]);

  useEffect(() => {
    if (!conversations) return;
    const newConversations = conversations.pages
      ?.map((conversation) => {
        return conversation.payload.data;
      })
      .flat();
    setMessages((prevConversations) => {
      const mergedConversations = [
        ...prevConversations,
        ...newConversations,
      ].reverse();
      const uniqueConversations = Array.from(
        new Map(mergedConversations.map((msg) => [msg._id, msg])).values()
      );
      return uniqueConversations;
    });
    if (isFirstLoad && chatContainerRef) {
      scrollToBottom(chatContainerRef);
      setIsFirstLoad(false);
    }
  }, [conversations, isFirstLoad, setMessages]);

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    if (file) {
      formData.append("image", file);
      const uploadPhoto = await ApiUploadImage.uploadImage(formData);
      setOpenImageUpload(false);
      setImageUrl(uploadPhoto.payload.data[0].url as string);
    }
  };

  const handleUploadImageOpen = () => {
    setOpenImageUpload((preve) => !preve);
  };

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value || imageUrl) {
      const conversation = {
        content: value.trim(),
        sender_id: user?._id,
        receiver_id: userByUsername?.payload?.data?._id,
        imgUrl: imageUrl,
      };
      socket.emit("send_message", {
        payload: conversation,
      });
      setValue("");
      setImageUrl("");
      setPreview("");
      setEmojiPickerOpen(false);
      setMessages((message) => [
        ...message,
        {
          ...conversation,
          _id: new Date().getTime().toString(),
        },
      ]);
      scrollToBottom(chatContainerRef);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        setIsTextareaScrolled(false);
      }
    }
  };

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    if (element.scrollTop === 0 && hasNextPage) {
      fetchNextPage();
      setTimeout(() => {
        chatContainerRef.current?.scrollTo({top: 1, behavior: "smooth"});
      }, 0);
    }
  };

  return (
    <div className={styles.main}>
      <nav className={styles.nav}>
        <div className={styles.navAvatar}>
          <Image
            src={
              userByUsername?.payload?.data?.avatar || "/img/avatar/avatar.jpg"
            }
            alt="avatar"
            width={150}
            height={150}
          />
          {checkUserOnline({
            onlineUsers,
            user_id: userByUsername?.payload?.data?._id as string,
          }) && (
            <div className={styles.circle}>
              <div className={styles.online}></div>
            </div>
          )}
        </div>
        <div>
          <h3 className={styles.name}>{userByUsername?.payload?.data?.name}</h3>
          <p className={styles.msg}>
            {renderUserStatus({
              onlineUsers,
              user_id: userByUsername?.payload?.data?._id as string,
            })}
          </p>
        </div>
      </nav>
      <div
        className={styles.messageDisplay}
        onScroll={handleScroll}
        ref={chatContainerRef}
      >
        {status === "pending" ? (
          <p>Loading....</p>
        ) : status === "error" ? (
          <p>Error: {error.message}</p>
        ) : (
          <>
            {isFetchingNextPage && (
              <div className="flex items-center justify-center">
                <SpinnerIcon className="size-5 animate-spin" />
              </div>
            )}
            <div className="flex flex-col gap-2 py-2 mx-2">
              {messages.map((conversation) => (
                <div
                  className={clsx(
                    "p-1 py-1 rounded w-fit max-w-[380px] md:max-w-sm lg:max-w-md",
                    user?._id === conversation?.sender_id
                      ? "ml-auto bg-teal-100"
                      : "bg-white"
                  )}
                  key={conversation._id}
                >
                  <div className="w-full relative">
                    {conversation.imgUrl && (
                      <Image
                        src={conversation?.imgUrl}
                        alt="Avatar"
                        className="size-full object-scale-down"
                        width={1000}
                        height={1000}
                      />
                    )}
                  </div>
                  <p className="px-2">{conversation.content}</p>
                  <p className="text-xs ml-auto w-fit">
                    {dayjs(conversation.created_at).format("hh:mm")}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className={styles.footer}>
        <div className="flex items-center justify-between">
          <div
            className={clsx(
              "flex items-center",
              (preview || isTextareaScrolled) && "self-end"
            )}
          >
            <div className="relative">
              <button
                onClick={handleUploadImageOpen}
                className="flex justify-center items-center size-11 rounded-full"
              >
                <CirclePlusIcon className="size-6" />
              </button>

              {openImageUpload && (
                <div
                  className="bg-white shadow rounded absolute bottom-14 w-36 p-2
                  z-[9999]"
                >
                  <form>
                    <label
                      htmlFor="uploadImage"
                      className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                    >
                      <div className="text-primary">
                        <ImageIcon className="size-5" />
                      </div>
                      <p>Image</p>
                    </label>
                    <input
                      type="file"
                      id="uploadImage"
                      onChange={(e) => {
                        const {files, displayUrl} = getImageData(e);
                        handleUploadImage(files[0]);
                        setPreview(displayUrl);
                      }}
                      className="hidden"
                    />
                  </form>
                </div>
              )}
            </div>
          </div>
          <form onSubmit={send} className="w-full flex items-center">
            <div className={styles.inputMsg}>
              <div className="flex flex-1 flex-col w-full max-h-[250px]">
                {preview && (
                  <Avatar className="size-24 border border-black rounded-sm">
                    <AvatarImage src={preview} />
                    <AvatarFallback>TH</AvatarFallback>
                  </Avatar>
                )}
                <textarea
                  ref={textareaRef}
                  placeholder="Aa"
                  dir="auto"
                  rows={1}
                  className={styles.messageBox}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div
                className={clsx(
                  "relative",
                  (isTextareaScrolled || preview) && "self-end"
                )}
              >
                <FaceIcon
                  className="size-6 cursor-pointer"
                  onClick={() => setEmojiPickerOpen((prev) => !prev)}
                />
                <EmojiPicker
                  // reactionsDefaultOpen={true}
                  open={emojiPickerOpen}
                  className="!absolute !bottom-0 !right-9"
                  onEmojiClick={(e) => setValue((prev) => prev + e.emoji)}
                  lazyLoadEmojis={true}
                  skinTonesDisabled={true}
                  previewConfig={{
                    showPreview: false,
                  }}
                  width={300}
                  emojiStyle={EmojiStyle.FACEBOOK}
                />
              </div>
            </div>
            <button
              type="submit"
              className={clsx(
                "flex items-center justify-center mr-3 p-2 cursor-pointer",
                (preview || isTextareaScrolled) && "self-end"
              )}
            >
              <PaperPlaneIcon className="size-5 text-textSecondary" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
