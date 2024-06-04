import { useEffect, useState } from "react";
import { Crown, List, Gamepad2, User, Check, Users } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import userServerSocket from "@/lib/socket/user-namespace";
import gameSocket from "@/lib/socket/socket";
import {AppDispatch} from '@/lib/redux/store'
import { useDispatch } from "react-redux";

if (!gameSocket.connected){
	gameSocket.connect();
}

const GeneralStatus = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const Channel = useSelector((state: any) => state.GlobalState.Channel);
    const [userdata, setUserData] = useState<any>({});
    const [AllFriends, setAllFriends] = useState<any[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [challenge, setChallenge] = useState(true);
    const [Accept, setAccept] = useState(false);

		/* invite game */
		let room: any;
		/* invite game */


    const fetchUser = async () => {
        try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/users`, {
            withCredentials: true,
        });
        setUserData(response.data);
        } catch (error) {
            console.error(error);
        }
    }


    const fetchFriends = async () => {
        try{
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/all_accepted_friends`, {
            withCredentials: true,
          });
          if (response.data){
            setAllFriends(response.data);
            setDataLoaded(true)
          }
        }catch (ex: any){
        }
      }

    //online offline listener
    // userServerSocket.on('user_connected', (data: any) => {
    //     fetchFriends();
    // })

    // userServerSocket.on('user_disconnected', (data: any) => {
    //     fetchFriends();
    // })

    // userServerSocket.on('user_ingame', (data: any) => {
    //     fetchFriends();
    // })

    // userServerSocket.on('user_outgame', (data: any) => {
    //     fetchFriends();
    // })

    useEffect(() => {
        fetchFriends();
        fetchUser();
    }
    , []);
        
    if (!dataLoaded){
        return (
        <div className="flex flex-col items-center w-full h-full mt-4 mb-4 space-y-8 text-black justify-center">
                {/* <h1 className='lg:text-4xl md:text-2xl sm-text:lg text-slate-500'>Loading...</h1> */} 
        </div>
        )
    }

    const handleProfileClick = (nickname: any)  => {
        router.push(`../../User/dashboard/${nickname}`)
    }

    /* invite game */

    const handleChallengeClick = (reciever: any, sender: any) => {
			setChallenge(false);
			// setAccept(true);

			gameSocket.emit('inviteSent', {sender, reciever});
	}

	gameSocket.on('inviteReceived', (data: any) => {
		setAccept(true);
		setChallenge(false);
		
	});

	gameSocket.on('inviteExpired', () => {
		setChallenge(true);
		setAccept(false);
	});

	const handleAcceptClick = (reciever: any, sender: any) => {
		setAccept(false);
		gameSocket.emit('inviteAccepted', {sender, reciever, room});
		// setChallenge(true);
	}

	gameSocket.on("startingGame", (data) => {
		let roomId = data;
		router.push(`/game/${roomId}?choice=black`);
	});

	/* invite game */

    const RedirectToChannel = (id: any) => {
        router.push(`/chat/channels/${id}`)
    }

    
    if (Channel?.members) {
        return (
            <div className="flex flex-col items-center w-full h-full mt-4 mb-4 space-y-8 text-black">
                <section className="flex border-white border-4 bg-gradient-to-tr from-green-50 to-green-100 flex-col rounded-3xl h-[30%] w-[90%]">
                    <div className="flex flex-col w-full h-full border-4 font-normal border-green-200 rounded-2xl items-center grow justify-center overflow-hidden">
                        <div className="flex justify-center w-full mt-4 ">
                            <Image src={Channel?.members[0]?.member.id === userdata.id?  Channel?.members[1]?.member?.avatar: Channel?.members[0]?.member?.avatar } width={100000} height={100000} alt="channel's avatar" className='w-[60px] h-[60px] rounded-full border-green-400 border-2'></Image>
                        </div>
                        <div className="flex justify-center w-full mt-2 flex-row">
                            <h1 className="font-bold lg:text-2xl sm:text-md md:text-lg">{Channel?.members[0]?.member.id === userdata.id?  Channel?.members[1]?.member?.nickname: Channel?.members[0]?.member?.nickname }</h1>
                        </div>
                        <div className="flex justify-center mt-2 mb-2 flex-row w-full space-x-12">
                            <button onClick={() => handleProfileClick(Channel?.members[0]?.member?.id === userdata.id?  Channel.members[1]?.member?.nickname: Channel?.members[0]?.member?.nickname )} className="flex flex-col items-center">
                                <User size={40} color="green"></User>
                                <h1 className="font-bold text-slate-600">Profile</h1>
                            </button>
                            {challenge &&
                                (<button onClick={() => handleChallengeClick(Channel?.members[0]?.member?.id === userdata.id ?  Channel?.members[1]?.member : Channel?.members[0]?.member, Channel?.members[0]?.member.id === userdata.id ?  Channel?.members[0]?.member : Channel?.members[1]?.member )} className="flex flex-col items-center">
                                    <Gamepad2 size={40} color="green"></Gamepad2>
                                    <h1 className="font-bold text-slate-600">Challenge</h1>
                                </button>)
                        }
                        </div>
                        {
                            Accept &&
                            <button onClick={() => handleAcceptClick(Channel?.members[0]?.member.id === userdata.id ? Channel?.members[0]?.member : Channel?.members[1]?.member, Channel?.members[0]?.member.id === userdata.id ?  Channel?.members[1]?.member : Channel?.members[0]?.member )} className="flex flex-col items-center">
                                <Check size={40} color="green" />
                                <h1 className="font-bold text-slate-600">Accept</h1>
                            </button>
                        }
                    </div>            
                </section>

                <section className="flex  border-white border-4 bg-gradient-to-tr from-green-50 grow to-green-100 flex-col rounded-3xl h-[50%] w-[90%]">
                <div className="lg:text-2xl md:text-lg sm:text-md bg-gradient-to-tr border-4 border-green-100 from-green-300  grow to-green-300 w-full rounded-t-3xl p-2 rounded-b-md">
                <div className="ml-5 flex flex-row items-center lg:text-2xl md:text-md sm:text-sm space-x-4"> <Users /> <h1>Friends</h1> </div>
                </div>
                <ul className="flex flex-col w-full h-full mt-2 mb-2 overflow-y-scroll font-normal rounded-2xl no-scrollbar">
                {
                    AllFriends.map((friend: any) => {
                        return (
                            <button onClick={() => handleProfileClick(friend?.friend?.nickname)} key={friend?.id} className="flex flex-row justify-between w-full p-4 border-b-2 border-white rounded-2xl hover:bg-green-200">
                                <div className="flex w-[90%]">
                                    <div className="flex items-center space-x-4">
                                        <Image   src={friend?.friend?.avatar} width={50} height={50} alt="Image of member" className='relative border-2 border-white rounded-full  w-[50px] h-[50px]'></Image>
                                        <div className="flex flex-col items-start">
                                            <h1 className="lg:text-lg md:text-md sm:text-sm">{friend?.friend?.nickname}</h1>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        )
                    })
                }
                </ul>
            </section>
            </div>
        );
    }
}

export default GeneralStatus;