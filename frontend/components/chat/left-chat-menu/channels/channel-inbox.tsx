"use client"
import { ChevronDown, ChevronRight } from "lucide-react";
import axios from 'axios';
import {AppDispatch} from '@/lib/redux/store'
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAllChannels, setInChange } from '@/lib/redux/reducers/GlobalState'
import Image from "next/image";
import { useRouter } from "next/navigation";


const ChannelsInbox = () => {
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>();
    const ShowState = useSelector((state: any) => state.GlobalState.ChannelsState)
    const inChange = useSelector((state: any) => state.GlobalState.inChange)
    const [ProtectedStat, setProtectedStat ] = useState(true);
    const [PrivateState, setPrivateState ] = useState(true);
    const [PublicState, setPublicState ] = useState(true);
    const [AllChannels, setAllChannels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const fetchChannels = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat`, {
                withCredentials: true,
              });
            setAllChannels(response.data);
            setIsLoading(false);
            return (response.data);
        } catch (error){
            console.error('Error fetching channel data', error);
        }
    }

    useEffect(() => {
        fetchChannels();
    }, [inChange])
    
    const toggleState = (Type: string) => {
        if (Type === 'Protected'){
            setProtectedStat(!ProtectedStat)
        }
        else if (Type === 'Private'){
            setPrivateState(!PrivateState)
        }
        else if (Type === 'Public'){
            setPublicState(!PublicState)
        }
    }


    const RedirectToChannel = (id: any) => {
        router.push(`/chat/channels/${id}`)
    }

    if (!ShowState)
        return (null);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center w-full h-full mb-4 space-y-8 text-black justify-center">
            </div>
        )
    }

    return (
        <div className="relative flex flex-col items-center w-full h-full mt-4 mb-4 overflow-y-scroll no-scrollbar overflow-hidden lg:text-lg md:text-md sm:text-sm"> 
            <section className="flex items-center justify-center w-full text-white ">
                <div className="flex flex-col items-center w-full ">
                    <button id="Protected" onClick={() => toggleState("Protected")} className="flex w-full bg-gradient-to-r from-green-400 to-green-300 p-0.4 rounded-sm justify-between flex-row border-2 border-green-400">
                        <h1 className="ml-2 font-bold lg:text-md md:text-md sm:text-sm">Protected Channels</h1>
                        {
                            ProtectedStat?
                                (<ChevronDown></ChevronDown>):(<ChevronRight></ChevronRight>)
                        }
                    </button>
                    {
                        ProtectedStat? 
                        (<ul className="flex flex-col justify-start w-full mt-4 ml-2 font-normal text-black border-black">
                            {
                                AllChannels &&
                                AllChannels.map((channel: any) => {
                                    return(
                                        (channel.type === 'PROTECTED') && 
                                        <button key={channel?.id} onClick={() => RedirectToChannel(channel?.id)} className="w-full h-full">
                                            <li key={channel?.id} className="flex flex-row items-center p-4 space-x-4 border-b-2 border-white spx ml hover:bg-blue-50 focus:bg-blue-300">
                                                <Image src={channel?.avatar} width={100000} height={100000} alt="channel's avatar" className='w-[50px] h-[50px] rounded-full'></Image>
                                                <div className="flex flex-col items-start sm:text-sm lg:text-sm md:text-sm">
                                                    <h1 className="font-bold">{channel?.name}</h1>
                                                    <h1>{channel?.subject}</h1>
                                                </div>
                                            </li>
                                        </button>
                                    )
                                })
                            }

                        </ul>): (null)
                    }
                </div>
            </section>
            <section className="flex items-center justify-center w-full mt-4 text-white">
                <div className="flex flex-col items-center w-full">
                    <button id="Private" onClick={() => toggleState("Private")} className="flex w-full bg-gradient-to-r from-green-400 to-green-300 p-0.4 rounded-sm justify-between flex-row border-2 border-green-400">
                        <h1 className="ml-2 font-bold lg:text-md md:text-md sm:text-sm">Private Channels</h1>
                        {
                            PrivateState? 
                                (<ChevronDown></ChevronDown>):(<ChevronRight></ChevronRight>)
                        }
                    </button>
                    {
                        PrivateState? 
                        (<ul className="flex flex-col justify-start w-full mt-4 ml-2 font-normal text-black border-black">
                            {
                                AllChannels &&
                                AllChannels.map((channel: any) => {
                                    return(
                                        (((channel?.type === 'PRIVATE')) && 
                                        <button key={channel?.id} onClick={() => RedirectToChannel(channel?.id)} className="w-full h-full">
                                            <li key={channel?.id} className="flex flex-row items-center p-4 space-x-4 border-b-2 border-white spx ml hover:bg-blue-50 focus:bg-blue-300">
                                                <Image src={channel?.avatar} width={100000} height={100000} alt="channel's avatar" className='w-[50px] h-[50px] rounded-full'></Image>
                                                <div className="flex flex-col items-start sm:text-sm lg:text-sm md:text-sm">
                                                    <h1 className="font-bold">{channel?.name}</h1>
                                                    <h1>{channel?.subject}</h1>
                                                </div>
                                            </li>
                                        </button>)
                                    )
                                })
                            }
                        </ul>): (null)
                    }
                </div>
            </section>

            <section className="flex items-center justify-center w-full mt-4 text-white">
                <div className="flex flex-col items-center w-full">
                    <button id="Public" onClick={() => toggleState("Public")} className="flex w-full bg-gradient-to-r from-green-400 to-green-300 p-0.4 rounded-sm justify-between flex-row border-2 border-green-400">
                        <h1 className="ml-2 font-bold lg:text-md md:text-md sm:text-sm">Public Channels</h1>
                        {
                            PublicState? 
                                (<ChevronDown></ChevronDown>):(<ChevronRight></ChevronRight>)
                        }
                    </button>
                    {
                        PublicState? 
                        (<ul className="flex flex-col justify-start w-full mt-4 ml-2 font-normal text-black border-black ">
                            {
                                AllChannels &&
                                AllChannels.map((channel: any) => {
                                    return(
                                        (channel?.type === 'PUBLIC') && 
                                        <button key={channel?.id} onClick={() => RedirectToChannel(channel?.id)} className="w-full h-full">
                                            <li key={channel?.id} className="flex flex-row items-center p-4 space-x-4 border-b-2 border-white spx ml hover:bg-blue-50 focus:bg-blue-300">
                                                <Image src={channel?.avatar} width={100000} height={100000} alt="channel's avatar" className='w-[50px] h-[50px] rounded-full'></Image>
                                                <div className="flex flex-col items-start sm:text-sm lg:text-sm md:text-sm">
                                                    <h1 className="font-bold">{channel?.name}</h1>
                                                    <h1>{channel?.subject}</h1>
                                                </div>
                                            </li>
                                        </button>
                                    )
                                })
                            }
                        </ul>): (null)
                    }
                </div>
            </section>
        </div>
    );
}

export default ChannelsInbox; 