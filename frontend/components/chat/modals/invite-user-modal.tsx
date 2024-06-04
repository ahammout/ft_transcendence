import {AppDispatch} from '@/lib/redux/store'
import { useDispatch, useSelector } from "react-redux";
import { setModalVisibility, setType } from '@/lib/redux/reducers/GlobalState'
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

import axios from 'axios';
import Image from "next/image";


    const InviteUser = () => {
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const Channel = useSelector((state: any) => state.GlobalState.Channel);
    const ModalShow = useSelector((state: any) => state.GlobalState.ModalVisibility);
    const [AllFriends, setAllFriends] = useState<any[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [states, setStates] = useState<any[]>([]);

    const updateElement = (index: any, status: any) => {
      const newState = [...states];
      newState[index] = status;
      setStates(newState);
    };

    const fetchFriends = async () => {
      try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/invite_friends`, {
          withCredentials: true,
        });
        if (response.data.status === "101"){
          setAllFriends(response.data.friendsList);
          const memberIds = Channel.members.map((member: any) => member.memberId);
          const initStates = response.data.friendsList.map((friend : any) => memberIds.includes(friend.friendId) );
          setStates(initStates);
          setDataLoaded(true)
        }
      }catch (ex: any){
      }
    }

    useEffect(() => {
      fetchFriends();
    }, [ModalShow])


    
    const inviteFriend = async (e: any, index: any, friendId: number) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/inviteFriend`, {channelId: Channel.id, friendId: friendId}, {
          withCredentials: true,
        })
        if (response.data.status === "404"){
          // console.log(response.data.UpdatedChannel);
        }
        updateElement(index, true);
      }
      catch(ex: any){
        alert(ex)
      }
    }

    const handleFinish = (e: any) => {
      e.preventDefault();
      fetchFriends();
      window.location.reload();
      dispatch(setModalVisibility(false))
    }



    if (!dataLoaded){
      return (
        <div>
          Data is loaded ...
        </div>
      )
    }
    return (
      <div className='flex flex-col items-center justify-between w-full border-2 shadow-2xl rounded-t-md border-blue-300'>
          <header className='flex justify-center w-[100%] p-4 rounded-t-md flex-col items-center bg-white  border-slate-200 border-b-2'>
            <h1 className='md:text-3xl sm:text-lg lg:text-4xl '>Invite new <span className='text-green-500 font-bold'>Users</span></h1>
            <h1 className='md:text-md sm:text-sm lg:text-lg text-green-600'>Select one or more users to invite to the channel</h1>
          </header>
            <form className='flex flex-col w-full h-full rounded-b-md'>
                <div className=' bg-white border-r-2 rounded-md border-slate-200 w-[100%]'>
                  <div className='flex flex-col items-center justify-between '>
                    <div className='w-[95%] text-red-500 rounded border-slate-200 items-center justify-start'>
                      <div className='w-full h-[300px] mt-1 text-red-500 rounded border-slate-200 bg-slate-50 overflow-y-scroll no-scrollable'>
                          <ul>
                            {
                              AllFriends.map((friend: any, index: number) => {
                                return (
                                  <li className='p-4 flex items-center justify-between'>
                                    <label htmlFor="user1" className='space-x-4 flex flex-row items-center'>
                                      <Image src={friend?.friend?.avatar} width={100000} height={100000} alt="channel's avatar" className='w-[50px] h-[50px] rounded-full'></Image>
                                        <h1 className='text-black'>
                                          {friend?.friend?.firstName} {friend?.friend?.lastName}
                                        </h1>
                                    </label>
                                      {
                                        (states[index])?
                                        (<div className='h-[40px] w-[80px] bg-slate-200 rounded-md items-center flex justify-center'><h1 className='text-black lg:text-lg'> Member </h1></div>):
                                        (<button  onClick={(event) => inviteFriend(event, index, friend?.friend?.id)} className='h-[40px] w-[80px] bg-green-500 rounded-md'><h1 className='text-black lg:text-lg'> Invite </h1></button>)
                                      }
                                    </li>
                                )
                              })
                            }
                          </ul>
                      </div>
                    </div>
                  </div>
                </div>
              <footer className='flex items-center justify-center bg-white border-t-2 rounded-b-md border-slate-200 '>
                <button onClick={handleFinish} type='submit' className='mt-2 mb-2 border-2 w-[95%] rounded bg-gradient-to-t from-green-400 to-green-500 p-2 lg:text-2xl hover:from-green-500 hover:to-green-600 border-green-500'>Finish</button>
              </footer>
            </form>
        </div>
      )
}

export default InviteUser;