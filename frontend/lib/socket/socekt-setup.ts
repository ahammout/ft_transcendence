import {io } from 'socket.io-client';

const serverSocket = io(`${process.env.NEXT_PUBLIC_BACK_URL}/chat`,  { transports : ['websocket'], autoConnect: false });

export default serverSocket;