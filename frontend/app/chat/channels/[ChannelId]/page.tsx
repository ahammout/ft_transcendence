"use client"
import RightMenu from "@/components/chat/right-chat-menu/right-chat-menu";
import ChatSpace from "@/components/chat/chat-space/chat-space";
import {AppDispatch} from '@/lib/redux/store'
import { useDispatch, useSelector } from "react-redux";
import { setInterface, setRouteInfo } from '@/lib/redux/reducers/GlobalState'
import { useEffect } from "react";



export default function ChannelInterface( {params}: {params: {channelId: string}}) {
    const dispatch = useDispatch<AppDispatch>();
    const RightMenuState = useSelector((state: any) => state.GlobalState.RightMenuState)
    const LeftMenuState = useSelector((state: any) => state.GlobalState.LeftMenuState)

        dispatch(setInterface("Channel"));
        dispatch(setRouteInfo(params));

    return (
        <>
            <div className={`${LeftMenuState ? 'flex w-2/3': 'flex w-full'} ${RightMenuState? 'flex w-2/3' : 'flex'}  w-2/3 border-1 ml-4 mr-4`}>
                <ChatSpace></ChatSpace>
            </div>
            <div className={`${RightMenuState ? 'flex w-1/3': 'hidden'} md:w-2/3 2xl:w-1/3 border-1 lg:flex rounded-r-2xl border-1 bg-gradient-to-t from-blue-50 to-blue-100`}>
                <RightMenu></RightMenu>
            </div>
        </>
    )
  }