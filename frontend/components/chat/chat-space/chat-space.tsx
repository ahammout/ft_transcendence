import NormalChatSpace from './Normal/chat-space-normal'
import DirectChatSpace from './Direct/chat-space-direct';
import ChannelsChatSpace from './channels/chat-space-channels';
import { useSelector } from "react-redux";


const ChatSpace = () => {
    const state = useSelector((state: any) => state.GlobalState.Interface)

    return(
        <div className="relative w-full h-full text-black border-8 border-blue-300 rounded-2xl ">
            {(state === "Normal")? (<NormalChatSpace></NormalChatSpace>):(null)}
            {(state === 'Direct')? (<DirectChatSpace></DirectChatSpace>):(null)}
            {(state === 'Channel')? (<ChannelsChatSpace></ChannelsChatSpace>): (null)}
        </div>

    );
}

export default ChatSpace;