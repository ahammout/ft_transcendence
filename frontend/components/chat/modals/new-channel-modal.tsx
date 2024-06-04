import React from 'react'
import { useState } from "react";
import { ChevronDown, ChevronRight, Upload } from "lucide-react";
import UploadImage from './cloudinaryUpload';
import { AppDispatch } from '@/lib/redux/store'
import { useDispatch, useSelector } from "react-redux";
import { setModalVisibility, setInChange } from '@/lib/redux/reducers/GlobalState'
import axios from 'axios';
import { useRouter } from 'next/navigation'
import Image from 'next/image';

const  NewChannel = () => {
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>();
    const inChange = useSelector((state: any) => state.GlobalState.inChange)
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
    
    const [NewChannel, setNewChannel] = useState(
      {
        name: "",
        avatar: "https://res.cloudinary.com/dgmc7qcmk/image/upload/v1712190642/my-uploads/jvhtognvcyvdvdeyal3v.webp",
        subject: "",
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
      else if (NewChannel.name.length <= 0){
        setInputCheck({
          ...inputCheck,
          name: true,
          type: false,
          warning: "You must provide a name for the channel",
        });
      }
      else if (NewChannel.name.length > 20){
        setInputCheck({
          ...inputCheck,
          name: true,
          type: false,
          warning: "Maximum number of characters is 20",
        });
      }
      else if (NewChannel.type === 'PROTECTED' && NewChannel.password.length <= 0){
        setInputCheck({
          ...inputCheck,
          name: false,
          type: true,
          warning: "In order to create a protected channel ypui need to provide a password",
        });
      }
      else{
        const PostChannel = async () => {
          try {
              setNewChannel({
              ...NewChannel,
              name: NewChannel.name.trim(),
              subject: NewChannel.subject.trim(),
            });
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat`, NewChannel, {
              withCredentials: true,
            });
            if (response.data == "duplicated"){
              setInputCheck({
                ...inputCheck,
                name: true,
                type: false,
                warning: "Channel already exist",
              });
            }
            return response.data
          }catch (error) {
            alert("Error posting data");
            return "error"
          }
        }
        const data = await PostChannel();
        if (data !== 'duplicated'){
          dispatch(setInChange(!inChange));
          dispatch(setModalVisibility(false))
          router.push(`/chat/channels/${data.id}`)
        }
      }
    }

    const handleChange = async (event: any) => {
      if (event.target.name === undefined) return (null);

      if (event.target.name === 'type'){
        setChannelType(event.target.value);
        setNewChannel({
          ...NewChannel,
          [event.target.name]: event.target.value.toUpperCase(),
        });
        if (event.target.value === "public")
          setIsProtected(false);
        else if (event.target.value === "protected")
          setIsProtected(true);
        else if (event.target.value === "private")
          setIsProtected(false);
        setchannelTypeState(false);
        setInputCheck({
          ...inputCheck,
          type: false,
        });
      }

      else if (event.target.name === 'avatar'){

        const image = new FormData();
        image.append('file', event.target.files[0]);
        image.append('upload_preset', 'my-uploads');
        const data = await UploadImage(image);
        if (data?.secure_url){
          setNewChannel({
            ...NewChannel,
            [event.target.name]: data.secure_url,
          });
        }
        else{
            const new11 = NewChannel;
            new11.avatar = "https://res.cloudinary.com/dgmc7qcmk/image/upload/v1712190642/my-uploads/jvhtognvcyvdvdeyal3v.webp"
            setNewChannel(new11);
        }
      }
      else {
        if (event.target.name !== 'password'){
          setNewChannel({
            ...NewChannel,
            [event.target.name]: event.target.value.trim(),
          });
        }
        else{
          setNewChannel({
            ...NewChannel,
            [event.target.name]: event.target.value,
          });
        }
      }
    }

    return (
      <div className='flex flex-col items-center justify-between w-full border-2 shadow-2xl rounded-t-md border-blue-300' onClick={() => channelTypeState? setchannelTypeState(!channelTypeState): null}>
        <header className='flex justify-center w-[100%] p-4 rounded-t-md flex-col items-center bg-white  border-slate-200 border-b-2'>
          <h1 className='md:text-3xl sm:text-lg lg:text-4xl '>Create a new <span className='text-green-500 font-bold'>channel</span></h1>
          <h1 className='md:text-md sm:text-sm lg:text-lg text-green-600'> Enter all the information to create</h1>
        </header>
          <form onSubmit={hadndleSubmition} className='flex flex-col w-full h-full rounded-b-md'>
            <div className='flex w-full h-full'>

              <div className=' bg-white border-r-2 rounded-md border-slate-200 w-[50%]'>
                
                <div className='flex flex-col items-center justify-between'>
                  
                  <div className='flex justify-start w-full h-full ml-2'><label className='mt-5 ml-2 lg:text-lg md:text-lg' htmlFor="ChannelName">Name: </label></div>
                  <input required id="name" type="text" name='name' placeholder='Channel name' className='rounded border-2 border-slate-200 w-[95%] p-2 hover:bg-green-100' onChange={handleChange}/>
                  {
                      inputCheck.name? (           
                      <div className='w-full p-2 mt-1 ml-4 text-red-600 rounded border-slate-200 font-bold '>
                        <h1>
                          {inputCheck.warning}
                        </h1>
                      </div>): (null)
                  }
                  <div className='flex justify-start w-full h-full ml-2'><label className='mt-5 ml-2 lg:text-lg md:text-lg' htmlFor="ChannelName">Subject: </label></div>
                  <input id="subject" type="text" name='subject' placeholder='Channel subject' className='rounded border-2 border-slate-200 w-[95%] p-2 hover:bg-green-100' onChange={handleChange}/>

                  <div className=' flex flex-col justify-center w-[95%] mt-8'>
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
                    {
                      inputCheck.type? (           
                      <div className='w-full p-2 mt-1 text-red-600 rounded border-slate-200 font-bold'>
                        <h1>
                          {inputCheck.warning}
                        </h1>
                      </div>): (null)
                    }
                  </div>
                
                </div>
              </div>
              <div className='bg-white w-[50%] h-[400px] items-center flex border-l-2 rounded-md border-slate-200'>
                <div className='flex flex-col items-center justify-center w-full h-full relative'>
                  <Image   src={NewChannel?.avatar} width={1000} height={1000} alt="Picture of the author" className='w-56 h-56 mt-5 border-4 rounded-full border-slate-200'></Image> 
                  <label className='lg:text-2xl' htmlFor="avatar">
                    <div className='h-[50px] w-[50px] bg-slate-400 rounded-full border-2 border-white absolute z-30 right-24 bottom-20 items-center flex justify-center'>
                      <Upload size={30}/>
                      <input id="avatar" type="file" accept='image/*' name="avatar" className='mt-10 hidden' onChange={handleChange} onClick={(e) => e.stopPropagation()}/>
                    </div>
                  </label>
                </div>
              </div>
            </div>
 
            <div className='flex items-center justify-center bg-white border-t-2 rounded-b-md border-slate-200 '>
              <button type='submit' className='mt-2 mb-2 border-2 w-[95%] rounded bg-gradient-to-t from-green-400 to-green-500 p-2 lg:text-2xl hover:from-green-500 hover:to-green-600 border-green-500'>Create</button>
            </div>
          </form>
      </div>
    )
}

export default NewChannel