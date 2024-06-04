'use client'
import React, {use, useEffect, useState, createContext} from 'react'
import photo from "../../../public/profile.png"
import Validation from './Validation' 
import axios from 'axios'
import { Camera, Router, Sidebar, User } from 'lucide-react'
import UploadImage from '@/components/chat/modals/cloudinaryUpload'
import { useRouter } from 'next/navigation'



type User = {
    id: number,
    nickname: string,
    email: string,
    newPassword: string,
    updateState?: boolean,
    avatar?: string,
}


const Profile = () => {

    const router = useRouter();
        useEffect(() => {
            fetchUser();
        }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/users`, {
            withCredentials: true,
        });
        if (response.data.updateState === true) {
            router.push('../User/dashboard');
        }
        setUserData(response.data);
    } catch (error: any) {
    }
    finally {
            setIsAuthorized(true);
    }
    }


    type Error = {
        [key: string]: string;
        }
        
        const [user, setUser] = useState<User>({
            id : 0,
            nickname: '',
            email: '',
            newPassword: '',
            
        });
        const [error, setError] = useState<Error>({});
        const [userData, setUserData] = useState<User>({
            id : 0,
            nickname: '',
            email: '',
            newPassword: '',
        });
        const [isAuthorized, setIsAuthorized] = useState(false);
        const [cloudImage, setCloudImage] = useState<string>('');


        const handleChangePhoto = async (event:any) => {
            const image = new FormData();
            image.append('file', event.target.files[0]);
            image.append('upload_preset', 'my-uploads');
            const data = await UploadImage(image);
            setCloudImage(data.secure_url);
        };
    
        const handleSubmitImage = async (event:any) => {
        event.preventDefault();
        if (!cloudImage) {
            return;
        }
        try {
                const response = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/uploadPhoto`, {photo:  cloudImage}, {
                    withCredentials: true,
                });
        } catch (error) {
        }
    };

const handleOnClick = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const validationErrors = Validation(user);
    if (Object.keys(validationErrors).length === 0) {
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/edit-update`, user, {
                withCredentials: true,
            });
            if (response.data.message === 'Nickname already exists') {
                setError({nickname: 'Nickname already exists'});
            }
            else {
            router.push('../User/dashboard');}
        } catch (error: any) {
    }
} else {
        setError(validationErrors);
    }
};

    if (!isAuthorized) {
        return <div className='flex justify-center items-center h-screen' >
            <div className='text-3xl text-gray-600 animate-pulse'>Loading...</div>
        </div>
    }

    return (
        <main className='h-screen flex justify-center items-center font-sans'>
            <div className='m-auto Settings flex p-[50px] gap-[15px]'>
                <div className="box-1 w-[30%] flex justify-center ">
                    <div className='container-1 w-[400px]'>
                        <div className="card bg-[var(--third-color)] h-full rounded-3xl ">
                            <div className="bg-pingPoungProfile h-[146px] rounded-t-3xl"></div>
                            <div className="text-center relative">
                            {cloudImage ? <img src={cloudImage} alt="user" className="w-[130px] h-[130px] object-cover rounded-full p-1 bg-white -mt-16 mb-[10px] m-auto" />:<img src={userData.avatar} alt="user" className="w-[130px] h-[130px] object-cover rounded-full p-1 bg-white -mt-16 mb-[10px] m-auto" />}
                                    <div>
                                    <label htmlFor="change_pic" className='cursor-pointer absolute top-[100px] right-[36%] bg-white p-[5px] rounded-full'>
                                                <Camera
                                                className='text-[var(--third-color)]'
                                                />
                                    </label>
                                        <form onSubmit={handleSubmitImage}>
                                            <input type='file' id='change_pic' accept="image/*" hidden className='text-white' onChange={handleChangePhoto}></input>
                                            <button type='submit' className='submit_pic text-[var(--third-color)] bg-[#eee] font-bold px-[15px] py-[8px]  rounded-[20px] mb-[30px] transition-all hover:bg-slate-600 hover:text-white mt-[20px]'>Submit</button>
                                        </form>
                                    </div>
                                <p className="card-descreption text-slate-800 bord bg-[var(--second-color)] mx-2 border-2 border-green-700 rounded-md p-2 text-sm">Upload a new avatar.Larger image will be resized automatically.<br/> <span className='mt-2'>Maximum uspanlouad size is <span className='font-bold'>1MB</span></span> </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='box-2  w-[70%]'>
                    <h2 className="bg-gradient-to-b from-[#0a496c] to-[var(--third-color)] px-[25px] py-[50px] text-[30px] text-white font-normal">Edit Profile</h2>
                    <div className='boxes pt-[50px] bg-[var(--third-color)]  rounded-b-3xl flex justify-center items-center p-[25px] gap-[20px]'>
                        <form autoComplete='off' className='container-2 w-[700px] flex flex-wrap gap-[20px]'>
                            <div className=' w-[100%] w-calc-50-10 '>
                                <label className='block text-white mb-[10px]'>Email</label>
                                <div className='input w-[100%] mb-[20px] relative '>
                                    <input 
                                    className={`my-name w-[100%] p-[15px] outline-none  focus:ring-2 focus:outline-none shadow-lg`}
                                    id="email" 
                                    type ="text"
                                    defaultValue={userData.email}
                                    readOnly
                                    />
                                </div>
                            </div>
                            <div className=' w-[100%] w-calc-50-10 '>
                                <label className='block text-white mb-[10px]'>Nickname</label>
                                <div className='input w-[100%] mb-[20px] relative '>
                                    <input 
                                    className={`my-name w-[100%] p-[15px] outline-none  focus:ring-2 focus:outline-none ${error.nickname ? ' border-solid border-2 focus:ring-0  border-red-500 ' : 'focus:ring-green-300'}  shadow-lg`}
                                    id="nickname" 
                                    type ="text" 
                                    placeholder="Your nickname..." 
                                    value={user.nickname} 
                                    onChange={(e) => setUser({...user, nickname: e.target.value})}
                                    />
                                    {error.nickname && <p className='text-red-600 '>{error.nickname}</p>}
                                </div>
                            </div>
                            <div className=' w-[100%] w-calc-50-10 '>
                                <label className='block text-white mb-[10px]'>Password</label>
                                <div className='input w-[100%] mb-[20px] relative '>
                                    <input 
                                    className={`my-name w-[100%] p-[15px] outline-none  focus:ring-2 focus:outline-none ${error.newPassword ? ' border-solid border-2 focus:ring-0  border-red-500 ' : 'focus:ring-green-300'}  shadow-lg`}
                                    id="newPassword" 
                                    type ="password" 
                                    placeholder="Your password.." 
                                    value={user.newPassword} 
                                    onChange={(e) => setUser({...user, newPassword: e.target.value})}
                                    />
                                    {error.newPassword && <p className='text-red-600 '>{error.newPassword}</p>}
                                </div>
                            </div>
                            < button onClick={handleOnClick} className="gradient-bg text-white hover:bg-lime-700 focus:ring-2 focus:outline-none focus:ring-green-300  w-[100%] p-4 rounded-md">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </main>

    )
}
export default Profile