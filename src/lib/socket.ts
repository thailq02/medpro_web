import {ACCESS_TOKEN, isClient} from "@/apiRequest/common";
import {io} from "socket.io-client";

const access_token = isClient ? localStorage?.getItem(ACCESS_TOKEN) : null;

const socket = io(process.env.NEXT_PUBLIC_API_SOCKET as string, {
  auth: {Authorization: `Bearer ${access_token ?? ""}`},
});

export default socket;
