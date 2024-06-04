import React from 'react'
import { useSelector } from "react-redux";
import NewChannel from "./new-channel-modal"
import InviteUser from './invite-user-modal';
import LeaveChannel from './leave-channel-modal';
import UpdateAvatar from './updata-Avatar-modal';
import UpdateName from './update-channelName-modal';
import JoinChannel from './join-channel-modal';
import MembersManger from './members-management';
import DeleteChannel from './delete-channel-modal';
import DeleteChat from './delete-chat';


const ModalHandler = () => {
    const ModalType = useSelector((state: any) => state.GlobalState.type);

    if (ModalType === 'channel')
        return (<NewChannel></NewChannel>)
    else if (ModalType === 'join-channel')
        return <JoinChannel></JoinChannel>
    else if (ModalType === 'delete-channel')
        return (<DeleteChannel></DeleteChannel>)
    else if (ModalType === 'delete-chat')
        return (<DeleteChat></DeleteChat>)
    else if (ModalType === 'leave')
        return (<LeaveChannel></LeaveChannel>)
    else if (ModalType === 'invite')
        return (<InviteUser></InviteUser>)
    else if (ModalType === 'manage-members')
        return (<MembersManger></MembersManger>)
    else if (ModalType === 'update-channel-name')
        return (<UpdateName></UpdateName>)
    else if (ModalType === 'update-channel-avatar')
        return (<UpdateAvatar></UpdateAvatar>)
        
    return (null)
}

export default ModalHandler