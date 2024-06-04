import {io } from 'socket.io-client';

const userServerSocket = io(`${process.env.NEXT_PUBLIC_BACK_URL}/users`,  { transports : ['websocket'], autoConnect: false, withCredentials: true });

export default userServerSocket;