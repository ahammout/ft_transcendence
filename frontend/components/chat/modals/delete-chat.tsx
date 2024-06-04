import {AppDispatch} from '@/lib/redux/store'
import { useDispatch, useSelector } from "react-redux";
import { setModalVisibility, setInChange } from '@/lib/redux/reducers/GlobalState'
import axios from 'axios';
import { useRouter } from "next/navigation";


const DeleteChat = () => {
    const dispatch = useDispatch<AppDispatch>()
    const Channel = useSelector((state: any) => state.GlobalState.Channel);
    const router = useRouter()
    const inChange = useSelector((state: any) => state.GlobalState.inChange)

    const RemoveChat = async () => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/direct/${Channel.id}`, {withCredentials: true});
            if (response.data.status === '101'){
                dispatch(setInChange(!inChange))
                router.push(`/chat`)
                dispatch(setModalVisibility(false));
            }

        } catch (ex: any){
            return(ex);
        }
    }

    return (
        <div className='flex flex-col items-center justify-between w-full rounded-t-md shadow-2xl border-2 border-blue-300'>
            <header className='flex justify-center w-[100%] p-4 rounded-t-md flex-col items-center bg-white  border-slate-200 border-b-2'>
                <h1 className='md:text-3xl sm:text-lg lg:text-4xl '>Deleting<span className='text-green-500 font-bold'> Chat</span></h1>
            </header>
            <div className='flex flex-col h-full rounded-b-md w-full items-center justify-between bg-white'>
                <div className='w-[80%] h-[80%] flex flex-col items-center justify-between bg-white'>
                    <h1 className='text-black p-15 mt-10 lg:text-lg'> Are you sure you want to delete this chat between <span className='text-green-500 p-15 mt-10 lg:text-lg font-bold'>{Channel.members[0].member.nickname}</span> and <span className='text-green-500 p-15 mt-10 lg:text-l font-bold'>{Channel.members[1].member.nickname} </span>?</h1>
                    <h1 className='text-red-500 p-15 mt-4 lg:text-md'> Be sure before deleting this chat, all the messages will be destroyed</h1>
                    <div className='flex flex-row p-10 items-center justify-between w-full'>
                        <button onClick={() => dispatch(setModalVisibility(false))} className='border-2 rounded-lg w-[30%] bg-gradient-to-t from-green-400 to-green-500 p-2 lg:text-2xl hover:from-green-500 hover:to-green-600 border-green-500'>
                            Cancel
                        </button>
                        <button onClick={() => RemoveChat()} className='border-2 rounded-lg bg-gradient-to-t from-red-400 to-red-500 p-2 lg:text-2xl w-[30%] hover:from-red-600 hover:to-red-800 border-red-700'>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteChat;