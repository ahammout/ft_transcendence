"use client"
import ChannelsInbox from "./channels/channel-inbox"
import MessagesInbox from "./direct/direct-inbox";
import {AppDispatch} from '@/lib/redux/store'
import { useDispatch, useSelector } from "react-redux";
import { setChannelsState, setMessagesState } from '@/lib/redux/reducers/GlobalState'
import { useRouter } from "next/navigation";
import React from 'react'
import { SquarePen, MessageCirclePlus, Users, PencilLine } from 'lucide-react'
import { useState } from 'react'
import { setModalVisibility, setType, setCreateState } from '@/lib/redux/reducers/GlobalState'

const LeftMenu = () => {

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter()

  const messagesState = useSelector((state: any) => state.GlobalState.MessagesState)
  const channelsState = useSelector((state: any) => state.GlobalState.ChannelsState)
  const [isNewDirect, setIsNewDirect] = useState(false);
  const [isNewChannel, setIsNewChannel] = useState(false);
  const CreateIsOpen = useSelector((state: any) => state.GlobalState.createState);
  const isVisible = useSelector((state: any) => state.GlobalState.ModalVisibility)


  const handleIsOpen = (e: any) => {
      e.preventDefault();
      if(!CreateIsOpen){
          setIsNewChannel(false)
          setIsNewDirect(false)
      }
      dispatch(setCreateState(!CreateIsOpen))
  }
  
  const toggleCreateChannel = (e: any) => {
      e.preventDefault();
      dispatch(setModalVisibility(!isVisible))

      dispatch(setType("channel"))
      dispatch(setCreateState(false))
  }

  const toggleJoinChannel = (e: any) => {
      e.preventDefault();
      dispatch(setModalVisibility(!isVisible))
      dispatch(setType("join-channel"))
      dispatch(setCreateState(false))
  }


  const ToggleHandling = (e: any) => {

    if (e.target.id === 'Messages'){
      dispatch(setChannelsState(false));
      dispatch(setMessagesState(true));
    }
    else if (e.target.id === 'Channels'){
      dispatch(setMessagesState(false));
      dispatch(setChannelsState(true));
    }
  }

  const toMainPage = (e: any) => {
    e.preventDefault();
    router.push(`/chat`)

  }

  return (
    <div className="flex-col w-full h-full space-y-1 no-scrollbar border-4 border-blue-200 rounded-lg">
      <header className="relative rounded-sm flex items-center justify-between flex-grow w-full h-12 p-10 px-4 text-black border-b-2 bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200">
        <button onClick={toMainPage} className="ml-2 lg:text-4xl md:text-3xl sm:text-2xl font-bold">
          Chats
        </button>
        <div className='flex space-x-1'>
            <button onClick={(e) => handleIsOpen(e) }>
                <SquarePen size={35} color="#000000" strokeWidth={2.75} />
            </button>
            {
                CreateIsOpen?
                    <div className='absolute z-40 flex flex-col border-2 border-blue-200 rounded-lg cursor-pointer bg-gradient-to-b from-green-200 to-green-100 top-20 right-1 '>
                        <button onClick={ (e) => toggleJoinChannel(e)} className='relative flex items-center justify-between flex-grow w-full p-2 space-x-10 border-b-2 rounded-r-lg hover:bg-green-300 hover:border-green-200 hover:border-1'>
                            <h1 className='sm:text-sm lg:text-lg md:text-md font-bold'>Join Channel</h1>
                            <Users />
                        </button>
                        <button onClick={ (e) => toggleCreateChannel(e)} className='relative flex items-center justify-between flex-grow w-full p-2 space-x-10 border-b-2 rounded-r-lg  hover:bg-green-300 hover:border-green-200 hover:border-1'>
                            <h1 className='sm:text-sm lg:text-lg md:text-md font-bold'>Create Channel</h1>
                            <PencilLine />
                        </button>
                    </div>:null
            }
        </div>
      </header>
  
      <section  className=" text-black mt-10 flex flex-row border-2 border-green-300 bg-green-200 space-x-0.5 items-center h-[60px] justify-center rounded-md w-[100%] shadow-4xl cursor-pointer">
          <button id="Messages" onClick={ToggleHandling} className={` ${messagesState? 'bg-green-400 ': 'bg-green-200 ' } font-bold w-[50%] rounded-lg h-[94%] sm:text-sm lg:text-md md:text-md shadow-2xl cursor-pointer hover:bg-green-300 hover:border-green-200 hover:border-2`}>Direct</button>
          <button id="Channels" onClick={ToggleHandling} className={` ${channelsState? 'bg-green-400': 'bg-green-200 ' } font-bold w-[50%] rounded-lg h-[94%] sm:text-sm lg:text-md md:text-md shadow-2xl cursor-pointer hover:bg-green-300 hover:border-green-200 hover:border-2`}>Channels</button>        
      </section>
        
      <section className="flex flex-col w-full h-full pb-36 text-black rounded-md font-costume grow ">
        {/* Messages inbox */}
        <MessagesInbox />
        {/* {/* Channels inbox */}
        <ChannelsInbox  />
      </section>
      </div>
  );
}

export default LeftMenu;