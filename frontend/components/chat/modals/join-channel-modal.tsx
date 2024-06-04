

import React from 'react'
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AppDispatch } from '@/lib/redux/store'
import { useDispatch } from "react-redux";
import { setModalVisibility } from '@/lib/redux/reducers/GlobalState'

import axios from 'axios';
import { useRouter } from 'next/navigation'

const  JoinChannel = () => {
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>();
    const [channelTypeState, setchannelTypeState] = useState(false);
    const [channelType, setChannelType] = useState("");
    const [isProtected, setIsProtected] = useState(false)


    const [inputCheck, setInputCheck] = useState(
      {
        name: false,
        type: false,
        warning: "",
      }
    )
    
    const [ChannelData, setChannelData] = useState(
      {
        name: "",
        type: "",
        password: "", 
      }
    );

    const hadndleSubmition = async (e: any) => {
      e.preventDefault();
      if (channelType.length <= 0){
        setInputCheck({
          ...inputCheck,
          type: true,
          name: false,
          warning: "You must choose a type for the channel",
        });
      }
      else if (ChannelData.name.length <= 0){
        setInputCheck({
          ...inputCheck,
          type: false,
          name: true,
          warning: "You must specify the name of the channel to join",
        });
      }
      else if (ChannelData.type === 'PROTECTED' &&ChannelData.password.length <= 0){
        setInputCheck({
          ...inputCheck,
          name: false,
          type: true,
          warning: "In order to join a protected channel you need to provide a password",
        });
      }
      else{
      try{
        setChannelData({
          ...ChannelData,
          name: ChannelData.name.trim(),
          type: ChannelData.type.trim(),
        });
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/join`, ChannelData, {
          withCredentials: true,
        });
        if (response.data.status != '101'){
          if (response.data.UpdatedChannel === 'Password not matched')
          {
            setInputCheck({
              ...inputCheck,
              name: false,
              type: true,
              warning: response.data.UpdatedChannel,
            })
          }
          else{
            setInputCheck({
              ...inputCheck,
              name: true,
              type: false,
              warning: response.data.UpdatedChannel,
            })
          }
        }
        else{ 
          dispatch(setModalVisibility(false));
          router.push(`/chat/channels/${response.data.UpdatedChannel.id}`);
        }
      }
      catch (error: any){
        setInputCheck({
          ...inputCheck,
          type: true,
          name: false,
          warning: error
        });
      }
    }      
    }

    const handleChange = async (event: any) => {
      if (event.target.name === undefined) return (null);

      if (event.target.name === 'type'){
        setChannelType(event.target.value);
        setChannelData({
          ...ChannelData,
          [event.target.name]: event.target.value.toUpperCase(),
        });
        setInputCheck({
          ...inputCheck,
          type: false,
          name: false,
          warning: "",
        });
        if (event.target.value === "public")
          setIsProtected(false);
        else if (event.target.value === "protected")
          setIsProtected(true);
        else if (event.target.value === "private")
          setIsProtected(false);
        setchannelTypeState(false);
      }

      else {
        if (event.target.name !== 'password'){
          setChannelData({
            ...ChannelData,
            [event.target.name]: event.target.value.trim(),
          });
        }
        else{
          setChannelData({
            ...ChannelData,
            [event.target.name]: event.target.value,
          });
        }
      }
    }

    return (
      <div className='flex flex-col items-center justify-between w-full border-2 shadow-2xl rounded-t-md border-blue-300' onClick={() => channelTypeState? setchannelTypeState(!channelTypeState): null}>
        <header className='flex justify-center w-[100%] p-4 rounded-t-md flex-col items-center bg-white  border-slate-200 border-b-2'>
          <h1 className='md:text-3xl sm:text-lg lg:text-4xl '>Join an existing  <span className='text-green-500 font-bold'>channel</span></h1>
          <h1 className='md:text-md sm:text-sm lg:text-lg text-green-600'> Enter the name and the type of the channel to join</h1>
        </header>
          <form onSubmit={hadndleSubmition} className='flex flex-col w-full h-full rounded-b-md'>
              <div className=' bg-white border-r-2 rounded-md border-slate-200 w-[100%] h-[350px] grow'>
                <div className='flex flex-col items-center justify-between '>
                  
                  <div className='flex justify-center w-full h-full ml-2'><label className='mt-5 ml-2 lg:text-4xl md:text-2xl' htmlFor="ChannelName"><span className='text-green-500'>Channel</span> name </label></div>
                  <input required id="name" type="text" name='name' placeholder='Channel name' className='rounded border-2 border-slate-200 w-[95%] p-2 mt-4 hover:bg-green-100' onChange={handleChange}/>
                  <div className='w-[95%] text-red-500 rounded border-slate-200 items-center justify-start'>
                    <div className='w-full p-2 mt-1 text-red-500 rounded border-slate-200 '>
                          {
                            inputCheck.name?  <h1 className='font-bold'>
                              {inputCheck.warning}
                            </h1>: (null)
                          } 
                    </div>
                  </div>
                  <div className=' flex flex-col justify-center w-[95%] mt-8 pb-10'>
                      <h1>
                        <button type='button' name="type" onClick={() => setchannelTypeState(!channelTypeState)} className='rounded bg-green-50 hover:bg-green-100 border-2 border-slate-200 w-[100%] h-full flex flex-row items-center justify-between p-2'>
                        {channelType? (channelType): ("Select channel type")}
                        {
                          channelTypeState?
                            (<ChevronDown className='h-full border-l-2 border-slate-200'></ChevronDown>):(<ChevronRight className='h-full border-l-2 border-slate-200'></ChevronRight>)
                        }
                        </button>
                      </h1>
                    {
                      channelTypeState?
                        (<ul className= 'flex bg-green-50 w-[100%] flex-col items-center rounded-md justify-center mt-1'>
                          <li className='w-full p-2 text-sm text-center rounded-lg hover:bg-green-200 hover:text-black'><button type='button' name='type' value="public" onClick={handleChange} className='w-full h-full'>Public channel</button></li>
                          <li className='w-full p-2 text-sm text-center rounded-lg hover:bg-green-200 hover:text-black'><button type='button' name='type' value="private" onClick={handleChange} className='w-full h-full'>Private channel</button></li>
                          <li className='w-full p-2 text-sm text-center rounded-lg hover:bg-green-200 hover:text-black'><button type='button' name='type' value="protected" onClick={handleChange} className='w-full h-full'>Protected channel</button></li>
                        </ul>):(null)
                    }
                    {
                      isProtected? (<>
                        <div className='flex justify-start w-full h-full ml-1'><label className='mt-5 lg:text-lg md:text-lg' htmlFor="ChannelName">Password: </label></div>
                        <input required id="password" type="password" name='password' placeholder='Secret Key' className='w-full p-2 border-2 rounded border-slate-200 hover:bg-green-100'  onChange={handleChange}/></> 
                      ):(null)
                    }
                    <div className='w-[95%] text-red-500 rounded border-slate-200 items-center justify-start'>
                      <div className='w-full p-2 mt-1 text-red-500 rounded border-slate-200 '>
                        {
                          (inputCheck.type && (channelTypeState === false))?  <h1 className='font-bold'>
                            {inputCheck.warning}
                          </h1>: (null)
                        } 
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            
            <div className='flex items-center justify-center bg-white border-t-2 rounded-b-md border-slate-200 '>
              <button type='submit' className='mt-2 mb-2 border-2 w-[95%] rounded bg-gradient-to-t from-green-400 to-green-500 p-2 lg:text-2xl hover:from-green-500 hover:to-green-600 border-green-500'>Join</button>
            </div>
          </form>
      </div>
    )
}

export default JoinChannel