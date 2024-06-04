import{ PanelLeft, PanelRight, Settings, LogOut, Trash2, UserRoundPlus, PenLine, ImagePlus, UserRoundMinus, MessageSquareOff, SendHorizontal, Laugh}from 'lucide-react'
import {AppDispatch} from '@/lib/redux/store'
import { useDispatch, useSelector } from "react-redux";
import { setLeftMenuState, setRightMenuState, setModalVisibility, setType, setChannel, setSettingState, setInChange } from '@/lib/redux/reducers/GlobalState'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react';
import serverSocket from '@/lib/socket/socekt-setup';
import axios from 'axios';
import InputEmoji from "react-input-emoji";
import { useRouter } from "next/navigation";
import { useClickAway } from "@uidotdev/usehooks";


const ChannelsChatSpace = (props: any) => {
    const dispatch = useDispatch<AppDispatch>();
    const RightMenuState = useSelector((state: any) => state.GlobalState.RightMenuState);
    const LeftMenuState = useSelector((state: any) => state.GlobalState.LeftMenuState);
    const inChange = useSelector((state: any) => state.GlobalState.inChange);
    const settingState = useSelector((state: any) => state.GlobalState.settingState);

    const isVisible = useSelector((state: any) => state.GlobalState.ModalVisibility);
    const ChannelInfo = useSelector((state: any) => state.GlobalState.RouteInfo);
    const Channel = useSelector((state: any) => state.GlobalState.Channel);
    const [userdata, setUserData] = useState<any>({});
    const [member, setMember] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const router = useRouter()
    const [banState, setBanState] = useState(false);
    const [kickState, setkickState] = useState(false);
    const [Messages, setMessages] = useState<any[]>([{}]);
    const [blockList, setBlockList] = useState<any[]>([])

    const chatContainerRef = useRef(null);

    // ------------------------------------ Fucntion to fetch data -------------------------------------/
    const MuteCheck = async(date: Date, duration: number, memberId: any)=>{

        const lasttime = new Date(date);
       
        // sleep 10 sconds
        const currenttime = new Date();
    
        let difference =( currenttime.getTime() - lasttime.getTime());
       
    
        // Convert milliseconds to minutes
        if (difference > (duration * 60 * 1000)){
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/unmute-member`, {channelId: ChannelInfo.ChannelId, memberId: memberId}, {
                withCredentials: true,
            });
            if (response.data.status === "101") {
                window.location.reload();
                setIsLoading(false);
            }
            } catch (ex: any){
            }
        }
    }

    // const fetchMember2 = async () => {
    //     try {
    //         const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/channel-member/${ChannelInfo.ChannelId}`, {withCredentials: true});
    //         if (response.data !== "404"){
    //             return (true)
    //         }
    //         return (false);
    //     } catch (error) {
    //         alert (error);
    //     }
    // }
    
    const fetchMember = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/channel-member/${ChannelInfo.ChannelId}`, {withCredentials: true});
            if (response.data !== "404"){
                setMember(response.data);
                if (response.data.mute)
                    MuteCheck(response.data?.mute?.muteDate, response.data?.mute?.duration, response.data.memberId);
                setIsLoading(false);
                return (response.data)
            }
            return (false);
        } catch (error) {
            alert (error);
        }
    }

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
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/${ChannelInfo.ChannelId}`, {
                withCredentials: true,
            });
            if (response.data.status === '500'){
                router.push(`/chat`)
            }

            if (response.data.data === 'baned'){
                setBanState(true);
            }

            else if (!response.data || response.data.status === '404'){
                dispatch(setInChange(!inChange))
                router.push(`/chat`)
            }
            else if (response.data.data !== 'baned' && response.data.status !== '404') {              
                dispatch(setChannel(response.data.data));
                setMessages(response.data?.data?.Messages);
            }
        } catch (error){
            console.error('Error fetching channel data', error);
        }
    }

    const fetchBlockList = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/block_list`, {
                withCredentials: true,
            });
            if (response.data.status === "101"){
                setBlockList(response.data.data)
                dispatch(setInChange(!inChange));
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



    // ------------------------------------ End of fetch data functions -------------------------------------/



    // ------------------------------------ UseEffect and fetching Data -------------------------------------/

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

    useEffect(() => {
        fetchUser();
        fetchBlockList();
        fetchChannel();
        fetchMember();
    }, [])
 
    useEffect(()=>{
        const addNewMessage = async (newMessage: any) => {
            let newblocklist = await fetchBlockList2();
            let membership = await fetchMember();
            const isBlocked = newblocklist.includes(newMessage.senderId);
            if (membership && !isBlocked)
                setMessages((messages: any) => [...messages, newMessage]);
        };
    
        serverSocket.emit("join", ChannelInfo.ChannelId)
            serverSocket.on(`message/${ChannelInfo.ChannelId}`, (MessageBody: any) => {
                addNewMessage(MessageBody);
            })
            return (() => {
               serverSocket.off();
             })
    }, [blockList])


    // ------------------------------------ End of UseEffect and fetching Data -------------------------------------/


    // -------------------------- On Click and Submit functions -------------------------------/
    const handleInput = async (emoji: any ) => {
        if (member.ban === false && !member.mute){
            setMessage(emoji);
        }
    }

    const hadndleSubmition = async (e: any) => {
        e.preventDefault();
        let m = message.trim();
        if (m) {
            let membership = await fetchMember();
            if (!membership){
                dispatch(setInChange(!inChange))
                setkickState(true);
            }
            if (membership.ban){
                setBanState(true);
                dispatch(setInChange(!inChange))
            }
            if (membership && membership.ban === false && !membership.mute) {
                if (message.length) {
                    serverSocket.emit("createMessage", { channelId: ChannelInfo.ChannelId, userId: userdata.id, text: message});
                    setMessage("");
                }
            }
        }
    }

    const handleEnter = async (event: any) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }
        let m = message.trim();
        if (m) {
            let membership = await fetchMember();
            if (!membership){
                setkickState(true);
                dispatch(setInChange(!inChange))
            }
            if (membership.ban){
                setBanState(true);
                dispatch(setInChange(!inChange))
            }
            if (membership && membership.ban === false && !membership.mute) {
                if (message.length) {
                    serverSocket.emit("createMessage", { channelId: ChannelInfo.ChannelId, userId: userdata.id, text: message});
                    setMessage("");
                }
            }
        }
    }
    // -------------------------- End of On Click and Submit functions -------------------------------/
    

    // -------------------------- Toggle function for buttons  -------------------------------/
    const ToggleHandling = (id: string) => {
        dispatch(setModalVisibility(!isVisible))
        dispatch(setType(id))
    }

    const toggleSettingState = () => {
        dispatch(setSettingState(!settingState))
    }

    const toggleEverything = () => {
        dispatch(setSettingState(false))
    }

    // -------------------------- End of Toggle function for buttons  -------------------------------/

    const formattedDate = (dateTimeString: any) => {
        const date = new Date(dateTimeString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
      
        const pad = (num: any) => (num < 10 ? "0" + num : num);
      
        return `${pad(day)}/${pad(month)}/${year} at ${pad(hours)}:${pad(minutes)}`;
    };

    
    if (kickState === true){
        return (            
            <div className='flex flex-col w-full h-full border-4 border-blue-200 rounded-lg'>
                <header className="flex items-center justify-between w-full h-12 p-10 px-4 text-black border-b-2 bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200"></header>
                <div className="relative flex justify-center flex-row items-center space-x-1 w-[99%] h-full text-black  rounded-lg border-2">
                    <h1 className='flex lg:text-lg md:text-lg sm:text-md font-bold text-slate-500 shadow-lg ml-5 items-center justify-center'>
                    You've been kicked from this channel !!
                    </h1>
                </div>
            </div>
        )
    }

    if (banState === true) {
        return (
            <div className='flex flex-col w-full h-full border-4 border-blue-200 rounded-lg'>
                <header className="flex items-center justify-between w-full h-12 p-10 px-4 text-black border-b-2 bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200"></header>
                <div className="relative flex justify-center flex-row items-center space-x-1 w-[99%] h-full text-black  rounded-lg border-2">
                    <h1 className='flex lg:text-lg md:text-lg sm:text-md font-bold text-slate-500 shadow-lg ml-5 items-center justify-center'>
                    You've been banned from this channel !!
                    </h1>
                </div>
            </div>
        )
    }

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
    
    if (Channel?.avatar){
    return (
        <div className='flex flex-col w-full h-full border-4 border-blue-200 rounded-lg'>
            <header className="flex items-center justify-between w-full h-12 p-10 px-4 text-black border-b-2 bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200">
                <button onClick={() => dispatch(setLeftMenuState(!LeftMenuState))} className="p-1 rounded-md h-fit w-fit md:hidden"><PanelLeft size={30}/></button>
                <div className='justify-center lg:text-4xl'>
                    <div className='flex flex-row space-x-4'>
                        <Image src={Channel?.avatar} width={10000} height={10000} priority={false}  alt="Picture of the author" className='relative rounded-full h-[65px] w-[65px]'></Image>
                        <div className='flex flex-col'>
                            <div className='text-md font-bold text-slate-800'>{Channel?.name}</div>
                            <div className='text-sm'>{Channel?.subject}</div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row space-x-4'>
                    <button id="leave" onClick={() => ToggleHandling("leave")} ><LogOut size={30} strokeWidth={3.00}></LogOut></button>
                    {
                        (Channel?.type === 'PRIVATE')?
                            (<button id="invite" onClick={() => ToggleHandling("invite")} ><UserRoundPlus size={30} strokeWidth={3.00}/></button>): (null)
                    }
                    {/* Channel Management controle Will be given to the Owner and Admins Only */}
                    {(member?.role === 'OWNER' || member?.role === "ADMIN") &&
                        <>
                            <button onClick={toggleSettingState}>
                                <Settings size={30} strokeWidth={3.00}/>
                            </button>
                            <div>
                            {
                                settingState? (
                                    <div className='absolute z-40 flex flex-col border-2 border-blue-200 rounded-lg cursor-pointer bg-gradient-to-b from-green-200 to-green-100 top-20 right-1 '>
                                    <>
                                        <button id="update-channel-name" onClick={() => ToggleHandling("update-channel-name")} className='relative flex items-center justify-between flex-grow w-full p-2 space-x-10 border-b-2 rounded-r-lg hover:bg-green-300 hover:border-green-200 hover:border-1'>
                                            <h1> Update Channel Name </h1>
                                            <PenLine />
                                        </button>
                                        <button id="update-channel-avatar" onClick={() => ToggleHandling("update-channel-avatar")} className='relative flex items-center justify-between flex-grow w-full p-2 space-x-10 border-b-2 rounded-r-lg hover:bg-green-300 hover:border-green-200 hover:border-1'>
                                            <h1>Update Avatar </h1>
                                            <ImagePlus />
                                        </button>
                                    </>

                                    <button id="manage-members" onClick={() => ToggleHandling("manage-members")} className='relative flex items-center justify-between flex-grow w-full p-2 space-x-10 border-b-2 rounded-r-lg hover:bg-green-300 hover:border-green-200 hover:border-1'>
                                        <h1>Manage Members </h1>
                                        <UserRoundMinus />
                                    </button>
                                    {(member.role === 'OWNER') &&
                                        <button id="delete-channel" onClick={() => ToggleHandling("delete-channel")} className='relative flex items-center justify-between flex-grow w-full p-2 space-x-10 border-b-2 rounded-r-lg hover:bg-green-300 hover:border-green-200 hover:border-1'>
                                            <h1 className='font-bold text-red-700 lg:text-lg'> Delete Channel </h1>
                                            <Trash2 color='red'/>
                                        </button>
                                    }
                                    </div>
                                ):(null)
                            }
                            </div>
                        </>  
                    }
                    <button onClick={()=> dispatch(setRightMenuState(!RightMenuState))} className="p-1 h-fit w-fit lg:hidden"><PanelRight size={30}/></button>
                </div>
            </header>

  
                <div className='flex flex-col w-full mx-auto overflow-y-scroll text-black rounded-md font-costume bg-gradient-to-tr from-blue-50 to-blue-50 grow' ref={chatContainerRef}>
                    <ul className='relative flex flex-col h-full space-y-2 justfy-between'>
                    {/* <li> */}
                        {/* <div key={}> */}
                        {
                            (Messages)? (
                            Messages.map((Message:any) => {                                   
                                return (
                                    <div key={Message?.id} className='flex flex-row p-8 space-y-4'>
                                        {Message?.sender?.avatar &&
                                            <Image src={Message?.sender?.avatar} width={10000} height={100000} alt="Picture of the author" className='mt-5 w-[50px] h-[50px] rounded-full'></Image>
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
                        {/* </div> */}
                        {/* </li> */}
                    </ul>
                </div>
                <footer className='flex flex-row items-center justify-center w-full h-20 p-2 mt-1 bg-blue-50'>
                        {(!member?.mute)?
                            (<form  onSubmit={hadndleSubmition} className="relative flex flex-row items-center space-x-1 w-[99%] h-full text-black  rounded-lg break-all max-w-[100%]">
                                <InputEmoji value={message} theme={"light"} borderColor={"#fffff"} fontFamily="sans-serif" onChange={handleInput} cleanOnEnter placeholder="Type your message" onEnter={handleEnter}/>
                                <button type='submit' className='flex border-4 hover:bg-[#3d8690] focus:bg-[#3d8680] flex-row w-[150px] items-center h-[70%] p-4 space-x-2 bg-[#3d8687] rounded-lg  mr-2'>
                                    <SendHorizontal color='black' size={30}  />
                                    <h1 className='text-sm ml-4 font-bold lg:text-md md:text-sm sm:text-sm '>Send</h1>
                                </button>
                            </form>):
                            (<div className="relative flex justify-center flex-row items-center space-x-1 w-[99%] h-full text-black  rounded-lg border-2">
                                <h1 className='flex lg:text-lg md:text-lg sm:text-md font-bold text-slate-500 shadow-lg ml-5 items-center justify-center'>
                                    Your not allowed to send any message on this channel, you're muted!!
                                </h1>
                            </div>)
                        }

                </footer>      
        </div>
    )}

}


export default ChannelsChatSpace;
