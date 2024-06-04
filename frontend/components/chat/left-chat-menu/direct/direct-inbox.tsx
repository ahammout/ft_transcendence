"use client"
import Image from 'next/image'
import { useEffect, useState } from "react";
import {AppDispatch} from '@/lib/redux/store'
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import axios from 'axios';



const MessagesInbox = () => {
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>();
    const ShowState = useSelector((state: any) => state.GlobalState.MessagesState)
    const inChange = useSelector((state: any) => state.GlobalState.inChange)
    const [userdata, setUserData] = useState<any>({});
    const [AllChannels, setAllChannels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const fetchBlockList = async () => {
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

    const fetchChannels = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat`, {
                withCredentials: true,
            });
            let newblocklist = await fetchBlockList();
            setAllChannels(response.data);
            setIsLoading(false);
        } catch (error){
            console.error('Error fetching channel data', error);
        }
    }

    useEffect(() => {
        fetchUser();
        fetchChannels();
    }, [])

    const RedirectToChannel = (channel : any) => {
        router.push(`/chat/direct/${channel.id}`)
    }

    if (!ShowState)
        return (null);
    if (isLoading){
        return (
        <div className="flex flex-col items-center w-full h-full mb-4 space-y-8 text-black justify-center">
        </div>
        )
    }
    return (
        <div className="flex flex-col items-center justify-between mt-2 mb-4 lg:text-lg md:text-md sm:text-sm overflow-y-scroll no-scrollbar overflow-hidden">
            <section className="flex items-center justify-center w-full mt-2 text-white">
                <div className="flex flex-col items-center w-full">
                    <ul className="flex flex-col justify-start w-full ml-2 font-normal text-black border-black">
                        {
                            AllChannels &&
                            AllChannels.map((channel: any) => {
                                return(
                                    (channel?.type === 'DIRECT') &&
                                    <button key={channel?.id} onClick={() => RedirectToChannel(channel)} className="w-full h-full">
                                        <li key={channel?.id} className="flex flex-row items-center p-4 space-x-4 border-b-2 border-white spx ml hover:bg-blue-50 focus:bg-blue-300">
                                            <Image src={channel?.members[0]?.member?.id === userdata.id?  channel?.members[1]?.member?.avatar: channel?.members[0]?.member?.avatar } width={100000} height={100000} alt="channel's avatar" className='w-[50px] h-[50px] rounded-full'></Image>
                                            <div className="flex flex-col items-start sm:text-sm lg:text-sm md:text-sm">
                                                <h1 className="font-bold">{channel?.members[0]?.member?.id === userdata.id?  channel?.members[1]?.member?.nickname: channel?.members[0]?.member?.nickname }</h1>
                                            </div>
                                        </li>
                                    </button>
                                )
                            })
                        }
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default MessagesInbox;