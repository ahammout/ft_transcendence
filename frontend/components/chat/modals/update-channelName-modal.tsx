import {AppDispatch} from '@/lib/redux/store'
import { useDispatch, useSelector } from "react-redux";
import { setModalVisibility, setInChange } from '@/lib/redux/reducers/GlobalState'
import { useState } from 'react';
import axios from 'axios';



const UpdateName = () => {
    const inChange = useSelector((state: any) => state.GlobalState.inChange)
    const dispatch = useDispatch<AppDispatch>()
    const Channel = useSelector((state: any) => state.GlobalState.Channel);
    const [newName, setNewName] = useState("");
    const [inputCheck, setInputCheck] = useState(
        {
          err: false,
          warning: "",
        }
      )


    const HandleSubmition = async (e: any) => {
        e.preventDefault();

        if (newName.length > 20){
            setInputCheck({
                ...inputCheck,
                err: true,
                warning: "Maximum number of characters is 20",
            });
        }
        else if (newName.length <= 0){
            setInputCheck({
                ...inputCheck,
                err: true,
                warning: "You must give a name to the channel in order to change or Cancel",
            });
        }
        else{
            try {
                const response = await axios.patch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/UpdateChannelName/${Channel.id}`, {name: newName}, {
                withCredentials: true,
                });
                if (response.data.status == "404"){
                    if (response.data.UpdatedChannel === 'duplicated'){
                        setInputCheck({
                        ...inputCheck,
                        err: true,
                        warning: "Channel name already in use",
                        });
                    }
                }
                else if (response.data.status === '101'){
                    dispatch(setInChange(!inChange));
                    dispatch(setModalVisibility(false));
                    window.location.reload();
                }
            } catch (error: any){
            }
        }
    }

    const HandleChange = (e: any) => {
        setNewName(e.target.value.trim());
    }

    return (
        <div className='flex flex-col items-center justify-between w-full rounded-t-md shadow-2xl border-2 border-blue-300'>
            <header className='flex justify-center w-[100%] p-4 rounded-t-md flex-col items-center bg-white  border-slate-200 border-b-2'>
                <h1 className='md:text-3xl sm:text-2xl lg:text-4xl '>Change <span className='text-green-500 font-bold'> {Channel.name} </span></h1>
            </header>
            <div className='flex flex-col h-full rounded-b-md w-full items-center justify-between bg-white'>
                <form onSubmit={HandleSubmition} className='w-[80%] h-[80%] flex flex-col items-center justify-between bg-white mt-5'>
                    <label htmlFor="name" className='font-normal md:text-md sm:text-sm lg:text-lg'> Enter the new channel here to update</label>
                    <input required id="name" type="text" name='name' placeholder={`${Channel.name}`} className='rounded border-2 border-slate-200 w-[95%] p-2 hover:bg-green-100 mt-6' onChange={HandleChange}/>                    
                    <div className='w-[95%] text-red-500 rounded border-slate-200 items-center justify-start '>
                      <div className='w-full mt-1 text-red-500 rounded border-slate-200'>
                        {
                          inputCheck.err?  <h1 className='font-bold'>
                            {inputCheck.warning}
                          </h1>: (null)
                        } 
                      </div>
                    </div>
                    <div className='flex flex-row p-10 items-center justify-between w-full'>
                        <button onClick={() => dispatch(setModalVisibility(false))} className='border-2 rounded-lg bg-gradient-to-t from-green-200 to-green-300 p-2 lg:text-2xl w-[30%] hover:from-green-300 hover:to-green-400 border-green-300'>
                            Cancel
                        </button>
                        <button type='submit' className='border-2 rounded-lg bg-gradient-to-t from-green-400 to-green-500 p-2 lg:text-2xl w-[30%] hover:from-green-600 hover:to-green-600 border-green-500'>
                            Change
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateName;