import{ PanelLeft, PanelRight }from 'lucide-react'
import {AppDispatch} from '@/lib/redux/store'
import { useDispatch, useSelector } from "react-redux";
import { setLeftMenuState, setRightMenuState } from '@/lib/redux/reducers/GlobalState'




const NormalChatSpace = () => {
    const dispatch = useDispatch<AppDispatch>();
    const RightMenuState = useSelector((state: any) => state.GlobalState.RightMenuState)
    const LeftMenuState = useSelector((state: any) => state.GlobalState.LeftMenuState)

    return (
        <div className='flex flex-col w-full h-full border-4 border-blue-200 rounded-lg'>
            <header className="flex items-center justify-between w-full h-12 p-10 px-4 text-black border-b-2 bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200">
                <button onClick={() => dispatch(setLeftMenuState(!LeftMenuState))} className="p-1 rounded-md h-fit w-fit md:hidden"><PanelLeft size={30}/></button>
                <div className='justify-center lg:text-4xl md:text-3xl sm:text-2xl font-bold'>
                    Chat Space
                </div>
                <button onClick={()=> dispatch(setRightMenuState(!RightMenuState))} className="p-1 h-fit w-fit lg:hidden"><PanelRight size={30}/></button>
            </header>

            <div className='flex flex-col items-center justify-center w-full h-full mx-auto text-black rounded-md font-costume bg-gradient-to-tr from-blue-50 grow to-blue-100'>
                <div className='bg-gradient-to-tr from-blue-200 grow to-lime-50 rounded-lg w-[100%] items-center flex justify-center border-4 '>
                    <h1 className='flex flex-col items-center justify-center text-black lg:text-lg md:text-md sm:text-sm font-bold '>
                        There is no chat until now <span >Create or Join to a <span className='text-red-600'> Channel </span> or start a <span className='text-green-600'> Direct Conversation </span></span>
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default NormalChatSpace;