import {AppDispatch} from '@/lib/redux/store'
import { useDispatch, useSelector } from "react-redux";
import { setModalVisibility, setInChange } from '@/lib/redux/reducers/GlobalState'
import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import UploadImage from './cloudinaryUpload';
import { Upload } from 'lucide-react';

const UpdateAvatar = () => {
    const inChange = useSelector((state: any) => state.GlobalState.inChange)
    const dispatch = useDispatch<AppDispatch>()
    const Channel = useSelector((state: any) => state.GlobalState.Channel);
    const [newAvatar, setNewAvatar] = useState(Channel.avatar);


    const HandleSubmition = async (e: any) => {
        e.preventDefault();

        try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/UpdateChannelAvatar/${Channel.id}`, {avatar: newAvatar}, {
                withCredentials: true,
            });
            if (response.data.status === '101'){
            dispatch(setInChange(!inChange));
            dispatch(setModalVisibility(false));
            window.location.reload();
            }
        } catch (error: any){
        }
    }

    const HandleChange = async (e: any) => {

        const image = new FormData();
        image.append('file', e.target.files[0]);
        image.append('upload_preset', 'my-uploads');
        const data = await UploadImage(image);
        if (data?.secure_url){
            setNewAvatar(data.secure_url)
        } else {
            setNewAvatar("https://res.cloudinary.com/dgmc7qcmk/image/upload/v1712190642/my-uploads/jvhtognvcyvdvdeyal3v.webp");
        }
    }

    return (
        <div className='flex flex-col items-center justify-between w-full rounded-t-md shadow-2xl border-2 border-blue-300'>
        <header className='flex justify-center w-[100%] p-4 rounded-t-md flex-col items-center bg-white  border-slate-200 border-b-2'>
            <h1 className='md:text-3xl sm:text-2xl lg:text-4xl '>Change <span className='text-green-500 font-bold'> Avatar </span></h1> 
        </header>
        <div className='flex flex-col h-full rounded-b-md w-full items-center justify-between bg-white'>
            <form onSubmit={HandleSubmition} className='w-full h-full flex flex-col items-center justify-between bg-white mt-5 z-30'>
                <div className='md:text-md sm:text-sm lg:text-lg rounded-lg border-b-2'> Chose a new avatar for channel <span className='text-green-500 font-bold text-2xl'>{Channel.name}</span></div>
                <Image   src={newAvatar} width={1000000} height={100000} alt="Picture of the author" className='mt-5 h-[500px] w-[500px]'></Image> 
                <div className='flex flex-col items-center justify-center w-full h-full mb-4 mt-4'>
                  <label className='lg:text-2xl w-full flex justify-center items-center' htmlFor="avatar">
                    <div className='h-[50px] w-[10%] bg-blue-200 rounded-md hover:bg-blue-100 border-2 border-blue-50 z-30 flex items-center justify-center'>
                      <Upload size={30}/>
                      <input id="avatar" type="file" accept='image/*' name="avatar" className=' hidden' onChange={HandleChange} onClick={(e) => e.stopPropagation()}/>
                    </div >
                  </label>
                </div>

                <div className='flex flex-row w-full h-full items-center justify-center mb-2  border-slate-200 border-t-2'>
                    <button type='submit' className='border-2 rounded bg-gradient-to-t from-green-400 to-green-500 p-2 lg:text-2xl hover:from-green-500 hover:to-green-600 border-green-500 mt-2 w-[95%] h-full'>
                        Finish
                    </button>
                </div>
            </form>
        </div>
    </div>
    )
}

export default UpdateAvatar;