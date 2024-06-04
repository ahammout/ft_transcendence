import{ PanelLeft, PanelRight, Settings, LogOut, Trash2, UserRoundPlus, PenLine, ImagePlus, UserRoundMinus, MessageSquareOff, SendHorizontal, Laugh}from 'lucide-react'
import {AppDispatch} from '@/lib/redux/store'
import { useDispatch, useSelector } from "react-redux";
import { setLeftMenuState, setRightMenuState, setModalVisibility, setType, setChannel, setSettingState } from '@/lib/redux/reducers/GlobalState'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react';
import serverSocket from '@/lib/socket/socekt-setup';
import axios from 'axios';
import InputEmoji from "react-input-emoji";
import Link from 'next/link';
import userServerSocket from "@/lib/socket/user-namespace";
import { useRouter } from "next/navigation";


const DirectChatSpace = (props: any) => {
    const dispatch = useDispatch<AppDispatch>();
    const RightMenuState = useSelector((state: any) => state.GlobalState.RightMenuState);
    const LeftMenuState = useSelector((state: any) => state.GlobalState.LeftMenuState);

    const isVisible = useSelector((state: any) => state.GlobalState.ModalVisibility);
    const ChannelInfo = useSelector((state: any) => state.GlobalState.RouteInfo);
    const Channel = useSelector((state: any) => state.GlobalState.Channel);
    const [userdata, setUserData] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [Messages, setMessages] = useState<any[]>([{}]);
    const [message, setMessage] = useState("");
    const [blockList, setBlockList] = useState<any[]>([])
    const router = useRouter()
    const [blockingState, setBlockingState] = useState(false);


    const chatContainerRef = useRef(null); // Ref for the chat container

    useEffect(() => {
      if (chatContainerRef.current) {
        (chatContainerRef.current as HTMLElement).scrollTop = (chatContainerRef.current as HTMLElement).scrollHeight;
      }
    }, [Messages]);

    useEffect(()=>{
        if (!serverSocket.connected){
            serverSocket.connect();
        }
    }, [])

    const fetchUser = async () => {
        try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/users`, {
            withCredentials: true,
        });
        setUserData(response.data);

        } catch (error) {
            console.error(error);
        }
    }

    const fetchChannel = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/${ChannelInfo.DirectId}`, {
                withCredentials: true,
            });
            if (response.data.status === '500'){
                router.push(`/chat`)
            }
            if (!response.data || response.data.status === '404'){
                router.push(`/chat`)
            }
            dispatch(setChannel(response.data?.data));
            setMessages(response.data?.data.Messages);
            setIsLoading(false);
        } catch (error){
            console.error('Error fetching channel data', error);
        }
    }

    useEffect(() => {
        fetchBlockList();
        fetchChannel();
        fetchUser();
    }, [])

    const hadndleSubmition = async (e: any) => {
        e.preventDefault();

        if (!serverSocket.connected){
            serverSocket.connect();
        }
        let m = message.trim();
        if (m) {
            serverSocket.emit("join", ChannelInfo.DirectId)
            serverSocket.emit("createMessage", { channelId: Channel.id, userId: userdata.id, text: message});
            setMessage("");
        }
    }

    const handleInput = (emoji: any ) => {
        setMessage(emoji);
    }

    const handleEnter = (event: any) => {
        if (!serverSocket.connected){
            serverSocket.connect();
        }
        if (event.key === "Enter") {
            event.preventDefault();
        }
        let m = message.trim();
        if (m) {
            serverSocket.emit("join", ChannelInfo.DirectId)
            serverSocket.emit("createMessage", { channelId: Channel.id, userId: userdata.id, text: message});
            setMessage("");
        }
    }

    const ToggleHandling = (id: string) => {
        dispatch(setModalVisibility(!isVisible))
        dispatch(setType(id))
    }

    const fetchBlockList = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/block_list`, {
                withCredentials: true,
            });
            if (response.data.status === "101"){
                setBlockList(response.data.data)
                return (response.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchBlockList2 = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/block_list`, {
                withCredentials: true,
            });
            if (response.data.status === "101"){
                return (response.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(()=>{
    const addNewMessage = async (newMessage: any) => {
        let newblocklist = await fetchBlockList2();
        const isBlocked = newblocklist.includes(newMessage.senderId);
        if (!isBlocked)
        setMessages((messages: any) => [...messages, newMessage]);
    };
    serverSocket.emit("join", ChannelInfo.DirectId)
        serverSocket.on(`message/${ChannelInfo.DirectId}`, (MessageBody: any) => {
            addNewMessage(MessageBody);
        })
        return (() => {
            serverSocket.off()
         })
    }, [blockList])

    // const toggleEverything = () => {
    //     dispatch(setSettingState(false))
    // }

    const formattedDate = (dateTimeString: any) => {
        const date = new Date(dateTimeString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
      
        // Padding single digits with leading zero
        const pad = (num: any) => (num < 10 ? "0" + num : num);
      
        return `${pad(day)}/${pad(month)}/${year} at ${pad(hours)}:${pad(minutes)}`;
      };

    //******************************************** End of Estabilish connetion to WebSocket Server ********************************************************/
    if (isLoading) {
        return (
            <div className='flex flex-col w-full h-full border-4 border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-blue-50 items-center justify-center'>
                <header className="flex items-center justify-between w-full h-12 p-10 px-4 text-black border-b-2 bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200"></header>
                <div className="relative flex justify-center flex-row items-center space-x-1 w-[99%] h-full text-black  rounded-lg border-2">
                    <h1 className='flex lg:text-lg md:text-lg sm:text-md font-bold text-slate-500 shadow-lg ml-5 items-center justify-center'>
                        Loading...
                    </h1>
                </div>
            </div>
        )
    }

    const handleProfileClick = (nickname: any)  => {
        router.push(`../../User/dashboard/${nickname}`)
    }

    return (
        <div className='flex flex-col w-full h-full border-4 border-blue-200 rounded-lg'>
            <header className="flex items-center justify-between w-full h-12 p-10 px-4 text-black border-b-2 bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200">
                <button onClick={() => dispatch(setLeftMenuState(!LeftMenuState))} className="p-1 rounded-md h-fit w-fit md:hidden"><PanelLeft size={30}/></button>
                <div className='justify-center lg:text-4xl'>
                    <div className='flex flex-row space-x-4'>
                    <Image src={Channel?.members[0]?.member?.id === userdata.id?  Channel?.members[1]?.member?.avatar: Channel?.members[0]?.member?.avatar } width={100000} height={100000} alt="channel's avatar" className='w-[65px] h-[65px] rounded-full'></Image>
                        <div className='flex flex-col justify-start items-start'>
                            <button  onClick={() => handleProfileClick(Channel?.members[0]?.member?.id === userdata?.id?  Channel.members[1]?.member?.nickname: Channel?.members[0]?.member?.nickname)} className="font-bold text-slate-800">{Channel?.members[0]?.member?.id === userdata?.id?  Channel.members[1]?.member?.nickname: Channel?.members[0]?.member?.nickname }</button>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row space-x-4'>
                    <button id="leave" onClick={() => ToggleHandling("delete-chat")} ><Trash2 size={30} strokeWidth={3.00}></Trash2></button>
                    <button onClick={()=> dispatch(setRightMenuState(!RightMenuState))} className="p-1 h-fit w-fit lg:hidden"><PanelRight size={30}/></button>
                </div>
            </header>

  
                <div className='flex flex-col w-full mx-auto overflow-y-scroll text-black rounded-md font-costume bg-gradient-to-tr from-blue-50 grow to-blue-50' ref={chatContainerRef}>
                    <ul className='relative flex flex-col h-full space-y-2 justfy-between'>
                    <li>
                            <div>
                            {
                                (Messages)?(
                                Messages.map((Message:any) => {
                                    return (
                                        <div key={Message?.id} className='flex flex-row p-8 space-y-4'>
                                            {Message?.sender?.avatar &&
                                                <Image src={Message?.sender?.avatar} width={50} height={50} alt="Picture of the author" className='mt-5 w-[50px] h-[50px] rounded-full'></Image>
                                            }
                                            <div className='flex flex-col w-full ml-5'>
                                                <div className='flex flex-row items-center w-full space-x-5'>
                                                    <h1 className='font-bold rounded-r-lg lg lg:text:2xl md:text-lg sm:text-md'>{Message?.sender?.nickname}</h1>
                                                    <h1 className='font-normal rounded-r-lg lg:text:2xl md:text-lg sm:text-md'>{formattedDate(Message?.createdAt)}</h1>

                                                </div>
                                                <div className='flex  break-all max-w-[100%] p-4 font-normal rounded-b-lg rounded-r-lg bg-green-200'>{Message?.content}</div>
                                            </div>
                                        </div>
                                    )
                                })): (null)
                            }
                            </div>
                    </li>
                    </ul>
                </div>
                <footer className='flex flex-row items-center justify-center w-full h-20 p-2 mt-1 bg-blue-50 break-all max-w-[100%]'>
                    <form  onSubmit={hadndleSubmition} className="relative flex flex-row items-center space-x-1 w-[99%] h-full text-black  rounded-lg">
                        <InputEmoji value={message} theme={"light"} borderColor={"#fffff"} fontFamily="sans-serif" onChange={handleInput} cleanOnEnter placeholder="Type your message" onEnter={handleEnter}/>
                        <button type='submit' className='flex border-4 hover:bg-[#3d8690] focus:bg-[#3d8680] flex-row w-[150px] items-center h-[70%] p-4 space-x-2 bg-[#3d8687] rounded-lg  mr-2'>
                            <SendHorizontal color='black' size={30}  />
                            <h1 className='text-sm ml-4 font-bold lg:text-md md:text-sm sm:text-sm '>Send</h1>
                        </button>
                    </form>
                </footer>
      
        </div>
    )
}

export default DirectChatSpace;




