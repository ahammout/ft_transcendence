import { io } from "socket.io-client";

const gameSocket = io(`${process.env.NEXT_PUBLIC_BACK_URL}/game`,  { transports : ['websocket'], autoConnect: false, withCredentials: true });

export default gameSocket;