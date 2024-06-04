'use client'
import React, {use, useEffect, useState, createContext} from 'react'
import Link from 'next/link'
import Image from "next/image"
import photo from "../../../public/profile.png"
import Validation from './Validation' 
import axios from 'axios'
import { Camera, Router, Sidebar, User } from 'lucide-react'
import { Main } from 'next/document'
import MainLayout from '@/components/User/mainlayout'
import { redirect } from 'next/dist/server/api-utils'
import UploadImage from '@/components/chat/modals/cloudinaryUpload'
import userServerSocket from '@/lib/socket/user-namespace'
import { useRouter } from 'next/navigation'
import QRCode from 'react-qr-code';





const Profile = () => {
    const [cloudImage, setCloudImage] = useState('');
    const [checkState, setCheckState] = useState(false);
    const router = useRouter();
    type User = {
        id: number,
        firstName: string,
        lastName: string,
        nickname: string,
        email: string,
        newPassword: string,
        updateState?: boolean,
        faState?: boolean,
        avatar?: string,
    }

    useEffect(() => {
        if (!userServerSocket.connected) {
        userServerSocket.connect();
        }
    }, []);


    type Error = {
        [key: string]: string;
        }
        
        const [user, setUser] = useState<User>({
            id : 0,
            firstName: '',
            lastName: '',
            nickname: '',
            email: '',
            newPassword: '',            
        });
        const [error, setError] = useState<Error>({});
        const [userData, setUserData] = useState<User>({
            id : 0,
            firstName: '',
            lastName: '',
            nickname: '',
            email: '',
            newPassword: '',
            faState: false,
        });
        const [isAuthorized, setIsAuthorized] = useState(false);
        
        useEffect(() => {
            fetchUser();
        }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/users`, {
            withCredentials: true,
        });
        if(response.data.twoFactorEnabled && !response.data.is2FAuthenticated){
            router.push('../User/chack2FA')
        }
        !response.data.updateState && ( router.push('../User/update'));
        setCheckState(response.data.faState);
        setUserData(response.data);
        userServerSocket.emit("join", {id: response.data.id});
    } catch (error: any) {
            router.push('/')
    }
    finally {
            setIsAuthorized(true);
    }
}

    const handleChangePhoto = async (event:any) => {
        const image = new FormData();
        image.append('file', event.target.files[0]);
        image.append('upload_preset', 'my-uploads');
        const data = await UploadImage(image);
        setCloudImage(data.secure_url);
    };

    const handleSubmitImage = async (event:any) => {
    event.preventDefault();
    if (cloudImage === '') {
        return;
    }
    try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/uploadPhoto`, {photo:  cloudImage}, {
                withCredentials: true,
            });
            location.reload();
    } catch (error) {
    }
};



    const handleOnClick = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const validationErrors = Validation(user);
        if (Object.keys(validationErrors).length === 0 && ( user.firstName !== '' || user.lastName !== '' || user.nickname !== '' || user.newPassword !== '')) {
            try {
                const response = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/edit-profile`, user, {
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

    //**************mhdi to_fa *******************/

    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [totpCode, setTotpCode] = useState('');
    const [verificationError, setVerificationError] = useState('');

    const handleToggle2FA = async () => {
        try {
            
            if (!userData.faState) {
                const enableResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/enable`, {}, {
                    withCredentials: true,
                });
                const { qrCodeUrl } = enableResponse.data;
                setQrCodeUrl(qrCodeUrl);
            }
            setUserData({ ...userData, faState: !userData.faState });
            
        } catch (error) {}
    };

    const handleDisable2FA = async () => {
        try {
        const  response= await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/disable`, {}, {
                withCredentials: true,
            });
        } catch (error) {
        }
    };
    const handleVerifyTOTPCode = async (e: any) => {
        verificationError.length > 0 && setVerificationError('');
        e.preventDefault();
        if (!totpCode) {
            setVerificationError('Please enter a TOTP code');
            return;
        }
        else if (totpCode.length !== 6) {
            setVerificationError('Invalid TOTP code');
            return;
        }
        else if (!/^\d+$/.test(totpCode)) {
            setVerificationError('Invalid TOTP code');
            return;
        }
        if(verificationError.length === 0)
        {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/verify-totp`, { totpCode }, {
                withCredentials: true,
            });
            if (response.data.message === 'Invalid TOTP code') {
            setVerificationError('Invalid TOTP code');}
            else {
                setVerificationError('');
                router.push('../User/dashboard');
            }
            
        } catch (error) {}
    }
    };
    const [faState, setFaState] = useState(userData.faState);


    const handleFaClick = async ()  => {    
    if(userData.faState){            
                handleDisable2FA()
        } else {
                handleToggle2FA()
        }
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/save-2fa-status`, {}, {
            withCredentials: true,
        });
        fetchUser();
        setFaState(userData.faState)
        
    }

    
    //**************end mhdi to_fa *******************/

    if (!isAuthorized) {
        return <div className='flex justify-center items-center h-screen' >
            <div className='text-3xl text-gray-600 animate-pulse'>Loading...</div>
        </div>
    }

    return (
        <MainLayout>
        <div className='ml-[80px] Settings flex p-[50px] h-full gap-[15px] relative wl-[70px]'>
            <div className="box-1 w-[30%] flex justify-center ">
                <div className='container-1 w-[400px]'>
                    <div className="card bg-[var(--third-color)] h-full rounded-3xl ">
                        <div className="bg-pingPoungProfile h-[146px] rounded-t-3xl"></div>
                        <div className="text-center relative">
                            {cloudImage ? <img src={cloudImage} alt="user" className="w-[130px] h-[130px] object-cover rounded-full p-1 bg-white -mt-16 mb-[10px] m-auto" />:<img src={userData.avatar} alt="user" className="w-[130px] h-[130px] object-cover rounded-full p-1 bg-white -mt-16 mb-[10px] m-auto" />}
                            <h3 className="text-lg text-white font-semibold capitalize">{userData.firstName} {userData.lastName}</h3><br/>
                                <div>
                                <label htmlFor="change_pic" className='cursor-pointer absolute top-[100px] right-[36%] bg-white p-[5px] rounded-full'>
                                            <Camera
                                            className='text-[var(--third-color)]'
                                            />
                                </label>
                                    <form onSubmit={handleSubmitImage}>
                                        <input type='file' id='change_pic' accept="image/*" hidden className='text-white' onChange={handleChangePhoto}></input>
                                        <button type='submit' className='submit_pic text-[var(--third-color)] bg-[#eee] font-bold px-[15px] py-[8px]  rounded-[20px] mb-[30px] mt-[-20px]  transition-all hover:bg-slate-600 hover:text-white'>Submit</button>
                                    </form>
                                </div>
                            <p className="card-descreption text-slate-800 bord bg-[var(--second-color)] mx-2 border-2 border-green-700 rounded-md p-2 text-sm">Upload a new avatar.Larger image will be resized automatically.<br/> <span className='mt-2'>Maximum uspanlouad size is <span className='font-bold'>1MB</span></span> </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='box-2  w-[70%]'>
                <h2 className="bg-gradient-to-b from-[#0a496c] to-[var(--third-color)] px-[25px] py-[50px] text-[30px] text-white font-normal">Edit Profile</h2>
                <div className='boxes  pt-[50px] bg-[var(--third-color)]  rounded-b-3xl flex justify-center items-center p-[25px] gap-[20px]'>
                    <form autoComplete='off' className='container-2 w-[700px] flex flex-wrap gap-[20px]'>
                        <div className='box w-[100%] w-calc-50-10'>
                            <label className='block text-white mb-[10px]'>First Name</label>
                            <div className=' input w-[100%] mb-[20px] relative '>
                                <input 
                                className={`my-name w-[100%] p-[15px] outline-none  focus:ring-2 focus:outline-none ${error.firstName ? ' border-solid border-2 focus:ring-0  border-red-500 ' : 'focus:ring-green-300'}  shadow-lg`}
                                id="firstName" 
                                type ="text" 
                                placeholder="Your first name..." 
                                value={user.firstName} 
                                onChange={(e) => setUser({...user, firstName: e.target.value})}
                                />
                                {error.firstName && <p className='text-red-600 '>{error.firstName}</p>}
                            </div>
                        </div>
                        <div className='box w-[100%] w-calc-50-10'>
                            <label className='block text-white mb-[10px]'>Last Name</label>
                            <div className='input w-[100%] mb-[20px] relative '>
                                <input 
                                className={`my-name w-[100%] p-[15px] outline-none  focus:ring-2 focus:outline-none ${error.lastName ? ' border-solid border-2 focus:ring-0  border-red-500 ' : 'focus:ring-green-300'}  shadow-lg`}
                                id="lastName" 
                                type ="text" 
                                placeholder="Your Last name..." 
                                value={user.lastName} 
                                onChange={(e) => setUser({...user, lastName: e.target.value})}
                                />
                                {error.lastName && <p className='text-red-600 '>{error.lastName}</p>}
                            </div>
                        </div>
                        <div className='box w-[100%] w-calc-50-10 '>
                            <label className='block text-white mb-[10px]'>nickname</label>
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
                        <div className='box w-[100%] w-calc-50-10 '>
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
                        <div  className=' w-[100%] w-calc-50-10 '>
                            <label className='block text-white mb-[10px]'>New Password</label>
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
                        <div>
                            <h1 className='font-bold text-white text-xl '>Two-factor authentication</h1>
                            <p className='text-[#acacac] text-sm'>add another layer of security to your account, You`il need verify yourself with 2FA avery time you sign in.</p>
                        </div>
                        <div> {/**mhdi part **/}
                            <label className="inline-flex items-center cursor-pointer mt-5">
                            <p className='text-white mr-2 '>active 2FA  :</p>
                                <input type="checkbox" id='myCheck' onClick={handleFaClick} defaultChecked={checkState} ></input>
                            </label>
                        </div>
                        </div>
                        {userData.faState && qrCodeUrl && (
                        <div className='w-[100%] flex flex-col justify-center items-center gap-[20px] text-white'>
                            <p className=''>Scan this QR code to enable two-factor authentication:</p>
                            <QRCode className='max-w-[100%]' value={qrCodeUrl} />
                            {userData.faState && (
                            <div className='flex flex-col gap-[15px]'>
                                <input className='outline-none px-[15px] py-[10px] border-1 border-white rounded-sm caret-black text-black'
                                    type="text"
                                    value={totpCode}
                                    onChange={(e) => setTotpCode(e.target.value)}
                                    placeholder="Enter TOTP code"
                                />
                            <button className='bg-[#00c882] px-[15px] py-[10px] rounded-sm' onClick={handleVerifyTOTPCode}>Verify TOTP Code</button>
                            {verificationError && <p className='text-red-500'>{verificationError}</p>}
                            
                            </div>
                        )}
                        </div>
                        )}
                        < button onClick={handleOnClick} className="gradient-bg text-white hover:bg-lime-700 focus:ring-2 focus:outline-none focus:ring-green-300  w-[100%] p-4 rounded-md">Update</button>
                    </form>
                </div>
            </div>
        </div>
        </MainLayout>

    )
}
export default Profile