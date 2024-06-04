import { useEffect, useState } from "react";
import { Crown, List, Gamepad, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

const GeneralStatus = () => {

    const [AllFriends, setAllFriends] = useState<any[]>([]);
    const [userdata, setUserData] = useState<any>({});
    const [dataLoaded, setDataLoaded] = useState(false);
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


    useEffect(() => {
        fetchFriends();
        fetchUser();
    }
    , []);

    const handleProfileClick = (nickname: any)  => {
        router.push(`../../User/dashboard/${nickname}`)
    }
    
    return (
        <div className="flex flex-col items-center w-full h-full mt-4 mb-4 space-y-8 text-black">
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

export default GeneralStatus;