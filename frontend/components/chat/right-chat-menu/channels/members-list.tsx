import { useEffect, useState } from "react";
import { Crown, List, Gamepad2, User, Users } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";


const GeneralStatus = () => {

    const [count, setCount] = useState<number>(0)
    const Channel = useSelector((state: any) => state.GlobalState.Channel);
    const [userdata, setUserData] = useState<any>({});
    const [AllFriends, setAllFriends] = useState<any[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [Members, setMembers] = useState<any[]>([]);
    const router = useRouter();

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

      const fetchMembers = async () => {
        try{
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/ChannelMembers/${Channel.id}`, {
            withCredentials: true,
          });
          if (response.data.status === "101") {
              setMembers(response.data.data);  
          }
        }catch (ex: any){
        }
      }

    useEffect( () => {
        fetchMembers();
        fetchFriends();
        fetchUser();
    }, [Channel])
        
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
    
    if (Channel?.members) {
        return (
            <div className="flex flex-col items-center w-full h-full mt-4 mb-4 space-y-8 text-black">
                <section className="flex  border-white border-4 bg-gradient-to-tr from-green-50 grow to-green-100 flex-col rounded-3xl h-[35%] w-[90%]">
                <div className="flex flex-row items-center justify-center mt-3 ml-5 space-x-2 rounded-2xl lg:text-lg md:text-md sm:text-sm">
                    <Crown color="green" size={35}/>
                    <h1> Channel <span className="text-green-600 font-bold">Managers</span> </h1>
                </div>
                <ul className="flex flex-col w-full h-full mt-2 mb-2 overflow-y-scroll no-scrollbar overflow-hiden font-normal border-t-2 border-white rounded-2xl no-scrollbar">
                    {
                        Members.map((member: any) => {
                            return (
                                (member?.role === 'ADMIN' || member?.role === 'OWNER') &&
                                (<button onClick={() => handleProfileClick(member?.member?.nickname)} key={member?.member?.id} className="flex flex-row w-full p-3 space-x-8 border-b-2 border-white rounded-2xl hover:bg-green-200">
                                    <Image   src={member?.member?.avatar} width={10000} height={10000} alt="Image of member" className='relative border-2 border-white rounded-full h-[50px] w-[50px]'></Image>
                                    <div className="flex flex-col justify-start items-start">
                                        <h1 className="lg:text-lg md:text-md sm:text-sm">{member?.member?.nickname}</h1>
                                        <h1 className="font-bold text-yellow-900">{member?.role}</h1>
                                    </div>
                                </button>)
                            )
                        })
                    }
                </ul>            
            </section>
                <section className="flex border-white border-4 bg-gradient-to-tr from-green-50 grow to-green-100  flex-col rounded-3xl h-[35%] w-[90%]">
                    <div className="lg:text-2xl md:text-lg sm:text-md bg-gradient-to-tr border-4 border-green-100 from-green-300  grow to-green-300 w-full rounded-t-3xl p-2 rounded-b-md">
                    <div className="ml-5 flex flex-row items-center lg:text-2xl md:text-md sm:text-sm space-x-4"> <Users /> <h1>Members</h1> </div>
                    </div>
                    <ul className="flex flex-col w-full h-full mt-2 mb-2 overflow-y-scroll no-scrollbar overflow-hiden font-normal border-t-2 border-white rounded-2xl no-scrollbar">
                    {
                        Members.map((member: any) => {
                            return (
                                (member?.role === 'BASIC') &&
                                (<button onClick={() => handleProfileClick(member?.member?.nickname)}  key={member?.member?.id} className="flex flex-row w-full p-3 space-x-8 border-b-2 border-white rounded-2xl hover:bg-green-200">
                                    <Image   src={member?.member?.avatar} width={10000} height={10000} alt="Image of member" className='relative border-2 border-white rounded-full h-[50px] w-[50px]'></Image>
                                    <div className="flex flex-col justify-start items-start">
                                        <h1 className="lg:text-lg md:text-md sm:text-sm">{member?.member?.nickname}</h1>
                                        <h1 className="font-bold text-yellow-900">{member?.role}</h1>
                                    </div>
                                </button>)
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