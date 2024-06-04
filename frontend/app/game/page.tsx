'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import JoinButton from "./JoinButton";
import MainLayout from "@/components/User/mainlayout";
import axios from "axios";

export default function Home() {

	const [choice, setChoice] = useState("black");
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
	if(response.data.twoFactorEnabled && !response.data.is2FAuthenticated){
		router.push('../User/chack2FA')
	}
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
	<MainLayout>
		<main>
			<div className=" ml-20 mr-5 mt-5">
				<div className="flex flex-wrap">
					<div className="h-[500px] flex-grow basis-[400px] m-5 p-10 bg-gradient-to-tr from-[var(--blue-color)] to-[var(--mint-color)] rounded-md flex items-center justify-center flex-col">
						<h1 className="text-2xl font-bold text-white mb-4">How to Play !</h1>
						<p className="text-lg text-white mb-4">Use the the mouse keys to move your paddle.</p>
						<h1 className="text-2xl font-bold text-white mb-4">Game rules</h1>
						<p className="text-lg text-white mb-4">First to score 5 points wins the game.</p>
					</div>
					<div className={`flex xl:flex-row flex-col h-[500px] items-center justify-around flex-grow basis-[400px] m-5 p-10 bg-gradient-to-tr from-[var(--blue-color)] to-[var(--mint-color)]  rounded-md`}>
						<div
							onClick={() => setChoice("black")}
							className={`${choice === 'black' ? "ring-4 ring-white":""} rounded-lg`}
							>
							<Image src="https://res.cloudinary.com/dgmc7qcmk/image/upload/v1711815722/my-uploads/gnrfgobysylu4o7hpjsk.png" priority={true} width={0} height={0} sizes="width:100vw height:100vh" alt="image" className="w-[350px] h-auto rounded-lg cursor-pointer"/>
						</div>
						<div
							onClick={() => setChoice("white")}

							className={`${choice === 'white' ? "ring-4 ring-black":""} rounded-lg`}
						>
							<Image src="https://res.cloudinary.com/dgmc7qcmk/image/upload/v1711815822/my-uploads/chqocm7phqjy3got0vvz.png" width={0} height={0} sizes="width:100vw height:100vh" alt="image" className="w-[350px] h-auto rounded-lg cursor-pointer"/>
						</div>
					</div>
				</div>

				<div className="flex space-x-20 flex-wrap items-center justify-center h-[500px] flex-grow basis-[400px] m-5 p-10 bg-gradient-to-tr from-[var(--blue-color)] to-[var(--mint-color)] rounded-md">
						<JoinButton className="relative flex items-center cursor-pointer justify-center text-2xl py-10 px-16  font-bold text-white border-4 rounded-md border-white" choice={choice}  />
				</div>

			</div>
			
    </main>
	</MainLayout>
  );
}