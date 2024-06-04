"use client"
import LeftMenu from "@/components/chat/left-chat-menu/left-chat-menu";
import { useSelector } from "react-redux";
import StoreProvider from '@/lib/redux/StoreProvider'
import MainLayout from "@/components/User/mainlayout";
import Sidebar from '@/components/User/sidebar';
import Tobbar from "@/components/User/TopBar";
import Modal from "@/components/chat/modals/main-modal";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; 



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const LeftMenuState = useSelector((state: any) => state.GlobalState.LeftMenuState)
    const modalVisibility = useSelector((state: any) => state.GlobalState.ModalVisibility)
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);


    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/users`, {
            withCredentials: true,
            });
            (response.data.twoFactorEnabled && !response.data.is2FAuthenticated)? router.push('/User/chack2FA'): setIsAuthorized(true);
            !response.data.updateState ? ( router.push('/User/update')) : setIsAuthorized(true);
        } catch (error: any) {
        }
        
    }

    if (!isAuthorized) {
        return <div className='flex justify-center items-center h-screen' >
            <div className='text-3xl text-gray-600 animate-pulse'>Loading...</div>
        </div>
    }

    return (
        <div className="overflow-hidden h-screen">
            <Sidebar></Sidebar>
            <Tobbar></Tobbar>
            <main className="relative flex flex-col justify-center pl-20 h-[95%] pb-8 w-[99%] pt-4 rounded-lg  overflow-hidden font-costume">
                <div className="flex flex-row flex-grow h-full " >
                    <div className={` ${LeftMenuState ? 'flex w-1/3' : 'hidden'} md:flex w-1/3 border-8 border-blue-300 rounded-2xl  flex-grow flex bg-gradient-to-r from-blue-50 to-blue-100`}>
                        <LeftMenu></LeftMenu>
                    </div>
                    {children}
                    <Modal isVisible={modalVisibility}></Modal>
                </div>
            </main>
        </div>
    );
}
