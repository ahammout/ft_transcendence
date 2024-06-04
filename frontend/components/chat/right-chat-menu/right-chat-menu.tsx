import GeneralStatus from "./normal /general-status"
import RightMenuChannels from "./channels/right-menu-channels";
import RightMenuDirect from "./direct/right-menu-direct";
import RightMenuNormal from "./normal /right-menu-normal";
import { useSelector } from "react-redux";

const RightMenu = () => {
    const state = useSelector((state: any) => state.GlobalState.Interface)

    return (
        <div className="relative w-full h-full text-black border-8 border-blue-300 rounded-2xl">
            {(state === "Normal")? (<RightMenuNormal/>):(null)}
            {(state === 'Direct')? (<RightMenuDirect/>):(null)}
            {(state === 'Channel')? (<RightMenuChannels/>): (null)}
        </div>
    )
}

export default RightMenu;