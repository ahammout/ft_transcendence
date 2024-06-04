
'use client'
import React, {use, useEffect, useState, createContext} from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation';

function Chack2FA() {
    const router = useRouter();
    const [totpCode, setTotpCode] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);


    const handleVerifyTOTPCode = async () => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/verify-totp`,
                { totpCode },
                { withCredentials: true }
            );
    
            if (response.data.message === 'TOTP code verified successfully') {
                await axios.put(
                    `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/update-2fa-status`,
                    {},
                    { withCredentials: true }
                );
                router.push('/User/dashboard');
            } else {
                setVerificationError('Invalid TOTP code');
            }
        } catch (error) {}
    };

    useEffect(() => {
        fetchUser();
    }, []);

const fetchUser = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/users`, {
        withCredentials: true,
    });
    !response.data.updateState && ( router.push('../User/update'));
} catch (error: any) {
}
finally {
    setIsAuthorized(true);
}
}

if (!isAuthorized) {
    return <div className='flex justify-center items-center h-screen' >
        <div className='text-3xl text-gray-600 animate-pulse'>Loading...</div>
    </div>
}

    return (
        <div className='TwoFa'>
            <div className='TwoFaBox flex flex-col gap-[15px]'>
                <input 
                    className='outline-none px-[15px] py-[10px] border-1 border-white rounded-sm caret-black'
                    type="text"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    placeholder="Enter TOTP code"
                />
                <button 
                    className='bg-[#00c882] px-[15px] py-[10px] rounded-sm' 
                    onClick={handleVerifyTOTPCode}
                >
                    Verify TOTP Code
                </button>
                {verificationError && <p className='text-red-500'>{verificationError}</p>}
            </div>
        </div>
    );
}

export default Chack2FA;
