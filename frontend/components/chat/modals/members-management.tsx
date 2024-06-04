// Needs to operator user to check the privleges.

import {AppDispatch} from '@/lib/redux/store'
import { useDispatch, useSelector } from "react-redux";
import { setModalVisibility, setType } from '@/lib/redux/reducers/GlobalState'
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import axios from 'axios';
import Image from "next/image";
import { useRouter } from "next/navigation";
import serverSocket from '@/lib/socket/socekt-setup';



const MembersManger = () => {
  const router = useRouter()

    const dispatch = useDispatch<AppDispatch>()
    const Channel = useSelector((state: any) => state.GlobalState.Channel);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [managetState, setManageState] = useState("Administration");
    const [AllMembers, setMembers] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [mutesIn, setMutesIn] = useState<any[]>([]);
    const [isOpenStates, setIsOpenStates] = useState<any[]>([]);
    const ChannelInfo = useSelector((state: any) => state.GlobalState.RouteInfo);
    const ModalShow = useSelector((state: any) => state.GlobalState.ModalVisibility);

    const [user, setUser] = useState<any>();

    const updateElement = (index: any, status: any) => {
      const newState = [...states];
      newState[index] = status;
      setStates(newState);
    };

    const updateMutesStates= (index: any, newElement: any) => {
      const NewmutesIn = [...mutesIn];
      NewmutesIn[index] = newElement;
      setStates(NewmutesIn);
    };

    const fetchUser = async () => {
      try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/users`, {
          withCredentials: true,
      });
      setUser(response.data);
      } catch (error) {
          console.error(error);
      }
  }


    const fetchMembers = async () => {
      try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/ChannelMembers/${Channel.id}`, {
          withCredentials: true,
        });
        if (response.data.status === "101") {
            setMembers(response.data.data);
            const initStates = response.data.data.map((member: any) => ((member.role === 'ADMIN')));
            const mutesIn = response.data.data.map((member: any) => (false));
            const isOpenStates = response.data.data.map((member: any) => (false));

            setMutesIn(mutesIn);
            setStates(initStates);
            setDataLoaded(true);
        }
      }catch (ex: any){
      }
    }

    useEffect(() => {
      fetchUser();
      fetchMembers();
    }, [ModalShow])

    const handleFinish = (e: any) => {
      e.preventDefault();
      window.location.reload();
      dispatch(setModalVisibility(false))

    }


    const MuteCheck = async(date: Date, duration: number, memberId: any)=>{

      const lasttime = new Date(date);
     
      // sleep 10 sconds
      const currenttime = new Date();
  
      let difference =( currenttime.getTime() - lasttime.getTime());
     
  
      // Convert milliseconds to minutes
      if (difference > (duration * 60 * 1000)){
          try {
              const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/unmute-member`, {channelId: ChannelInfo.ChannelId, memberId: memberId}, {
                withCredentials: true,
              });
              if (response.data.status === "101") {
              }
              } catch (ex: any){
              }
              return false 
          }
          else
            return true
     }

    const toggleManageState = (e: any, newType: string) => {
        e.preventDefault();

        if (newType === 'Administration'){
          const initStates = AllMembers.map(member => ((member.role === 'ADMIN')));
          setStates(initStates);
        }
        else if (newType === 'Kick'){
          const initStates = AllMembers.map(member => true);
          setStates(initStates);
        }
        else if (newType === "Ban"){
          const initStates = AllMembers.map(member => (member.ban));
          setStates(initStates);
        }
        else if (newType === "Mute"){
          // const initStates = AllMembers.map(member => (member.mute? true: false));
          const initStates = AllMembers.map(member => 
            {
              if(member.mute)
                return  MuteCheck(member.mute?.muteDate, member.mute?.duration, member?.memberId)
              else
                return false
            });
          setStates(initStates);
        }
        setManageState(newType);
    }

    const setAdmin = async (e: any, index: number, memberId: number) => {
      e.preventDefault();

      try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/set_admin`, {channelId: Channel.id, memberId: memberId}, {
          withCredentials: true,
        });
        if (response.data.status === "101") {
            updateElement(index, true);
        }
      } catch (ex: any){
      }
    }

    const kickMember = async (e: any, index: number, memberId: number) => {
      e.preventDefault();
      try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/kick-member`, {channelId: Channel.id, memberId: memberId}, {
          withCredentials: true,
        });
        if (response.data.status === "101") {
          // serverSocket.emit("kick", {channelId: Channel.id, memberId: memberId});
            updateElement(index, false);
        }
      } catch (ex: any){
      }
    }

    const banMember = async (e: any, index: number, memberId: number) => {
      e.preventDefault();
      try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/ban-member`, {channelId: Channel.id, memberId: memberId}, {
          withCredentials: true,
        });
        if (response.data.status === "101") {
            updateElement(index, true);
        }
      } catch (ex: any){
      }
    }

    const muteMember = async (e: any, index: number, memberId: number) => {
        e.preventDefault();
        if (mutesIn[index]){ 
          try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/mute-member`, {channelId: Channel.id, memberId: memberId, duration: mutesIn[index]}, {
              withCredentials: true,
            });
            if (response.data.status === "101") {
              updateElement(index, true);
            }
            } catch (ex: any){
          }
        }
      }

      const unmuteMember = async (e: any, index: number, memberId: number) => {
          e.preventDefault();
          try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/unmute-member`, {channelId: ChannelInfo.ChannelId, memberId: memberId}, {
              withCredentials: true,
            });
            if (response.data.status === "101") {
              updateElement(index, false);
            }
            } catch (ex: any){
            }
        
        }
                
      const unsetAdmin = async (e: any, index: number, memberId: number) => {
        e.preventDefault();
        
        try{
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/unset_admin`, {channelId: Channel.id, memberId: memberId}, {
            withCredentials: true,
          });
          if (response.data.status === "101") {
            updateElement(index, false);
          }
        } catch (ex: any){
        }
      }
      
      const unbanMember = async (e: any, index: number, memberId: number) => {
        e.preventDefault();
        
        try{
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/chat/unban-member`, {channelId: Channel.id, memberId: memberId}, {
            withCredentials: true,
          });
          if (response.data.status === "101") {
            updateElement(index, false);
          }
        } catch (ex: any){
        }
      }
                
      if (!dataLoaded){
        return (
          <div>
            Data is loaded ...
          </div>
      )
    }

    const toggleIsOpenStates = (index: any, e: any, newValue: any) => {
      e.preventDefault();

      const NewisOpenStates = AllMembers.map((member: any) => (false));
      NewisOpenStates[index] = newValue;
      setIsOpenStates(NewisOpenStates);
    }

    const handleInput = (e: any, index: any) => {
      const newMutesInput = [...mutesIn];
      newMutesInput[index] = e.target.value;
      setMutesIn(newMutesInput);

      const NewisOpenStates = AllMembers.map((member: any) => (false));
      NewisOpenStates[index] = false;
      setIsOpenStates(NewisOpenStates);
    }

    return (
      <div className='flex flex-col items-center justify-between w-full border-2 shadow-2xl rounded-t-md border-blue-300'>
          <header className='flex justify-center w-[100%] p-4 rounded-t-md flex-col items-center bg-white  border-slate-200 border-b-2'>
            <h1 className='md:text-3xl sm:text-lg lg:text-4xl '>Members <span className='text-green-500 font-bold'>Management</span></h1>
            <h1 className='md:text-md sm:text-sm lg:text-lg text-green-600'>Navigate to choose an appropriate action</h1>
          </header>
            <form className='flex flex-col w-full h-full rounded-b-md'>
                <div className=' bg-white border-r-2 rounded-md border-slate-200 w-[100%]'>
                  <div className='flex flex-col items-center justify-between '>
                    <div className='w-[95%] text-red-500 rounded border-slate-200 items-center justify-start'>
                        <div className='flex flex-row justify-between text-slate-700 items-center w-full h-[40px] rounded-md bg-green-200 mt-2'>
                            <button onClick={(e) => toggleManageState(e ,"Administration")} className={`${managetState === 'Administration'? 'bg-green-400': 'bg-green-200'} border-2 h-full rounded-md border-r-green-400 border-green-200 w-[25%]`}>
                                Administration
                            </button>
                            <button onClick={(e) => toggleManageState(e ,"Kick")} className={`${managetState === 'Kick'? 'bg-green-400': 'bg-green-200'} border-2 h-full rounded-md border-r-green-400 border-green-200 w-[25%]`}>
                                Kick
                            </button>
                            <button onClick={(e) => toggleManageState(e ,"Mute")} className={`${managetState === 'Mute'? 'bg-green-400': 'bg-green-200'} border-2 h-full rounded-md border-r-green-400 border-green-200 w-[25%]`}>
                                Mute
                            </button>
                            <button onClick={(e) => toggleManageState(e ,"Ban")} className={`${managetState === 'Ban'? 'bg-green-400': 'bg-green-200'} border-2 h-full rounded-md border-green-200 w-[25%]`}>
                                Ban
                            </button>
                        </div>
                      <div className='w-full h-[300px] mt-1  rounded border-slate-200 bg-slate-50 overflow-y-scroll no-scrollable'>
                        {
                            (managetState === "Administration") &&
                            (<section>
                                <ul>
                                    {
                                    AllMembers?.map((member: any, index: number) => {
                                        return (
                                        (member?.member?.id !== user?.id) &&
                                        <li key={member?.member?.id} className='p-4 flex items-center justify-between'>
                                            <label htmlFor="user1" className='space-x-4 flex flex-row items-center'>
                                            <Image src={member?.member?.avatar} width={100000} height={100000} alt="channel's avatar" className='w-[50px] h-[50px] rounded-full'></Image>
                                                <h1 className='text-black'>
                                                {member?.member?.firstName} {member?.member?.lastName}
                                                </h1>
                                            </label>
                                            {
                                                (member?.role === 'OWNER')?
                                                (<div className='h-[40px] w-[110px] bg-slate-200 rounded-md items-center flex justify-center border-2 border-slate-300'><h1 className='text-black lg:text-lg'> {member?.role} </h1></div>):
                                                (states[index])?
                                                (<button  onClick={(event) => unsetAdmin(event, index, member?.member?.id)} className='h-[40px] w-[120px] bg-red-400 rounded-md border-2 border-red-500 hover:bg-red-300'><h1 className='text-black lg:text-lg'> Unset Admin </h1></button>):                                    
                                                (<button  onClick={(event) => setAdmin(event, index, member?.member?.id)} className='h-[40px] w-[120px] bg-green-400 rounded-md border-2 border-green-500 hover:bg-green-300'><h1 className='text-black lg:text-lg'> Set Admin </h1></button>)
                                            }
                                            </li>
                                        )
                                    })
                                    }
                                </ul>
                            </section>)
                        }
                        {
                            (managetState === "Kick") &&
                            (<section>
                                <ul>
                                    {
                                    AllMembers.map((member: any, index: number) => {
                                        return (
                                        (member?.member?.id !== user.id) &&
                                        <li key={member?.member?.id} className='p-4 flex items-center justify-between'>
                                            <label htmlFor="user1" className='space-x-4 flex flex-row items-center'>
                                            <Image src={member?.member?.avatar} width={100000} height={100000} alt="channel's avatar" className='w-[50px] h-[50px] rounded-full'></Image>
                                                <h1 className='text-black'>
                                                {member?.member?.firstName} {member?.member?.lastName}
                                                </h1>
                                            </label>
                                            {
                                                (member.role === 'OWNER')?
                                                (<div className='h-[40px] w-[110px] bg-slate-200 rounded-md items-center flex justify-center border-2 border-slate-300'><h1 className='text-black lg:text-lg'> {member?.role} </h1></div>):
                                                (states[index])?
                                                (<button  onClick={(event) => kickMember(event, index, member?.member?.id)} className='h-[40px] w-[110px] bg-red-400 rounded-md border-2 border-red-500 hover:bg-red-300'><h1 className='text-black lg:text-lg'> Kick </h1></button>):                                    
                                                (<div  className='flex h-[40px] w-[110px] items-center justify-center bg-slate-400 rounded-md border-2 border-slate-500'><h1 className='text-black lg:text-lg'> Kicked! </h1></div>)
                                            }
                                            </li>
                                        )
                                    })
                                    }
                                </ul>
                            </section>)
                        }

                        {
                            (managetState === "Ban") &&
                            (<section>
                                <ul>
                                    {
                                    AllMembers.map((member: any, index: number) => {
                                        return (
                                        (member?.member?.id !== user.id) &&
                                        <li key={member?.member?.id} className='p-4 flex items-center justify-between'>
                                            <label htmlFor="user1" className='space-x-4 flex flex-row items-center'>
                                            <Image src={member?.member?.avatar} width={100000} height={100000} alt="channel's avatar" className='w-[50px] h-[50px] rounded-full'></Image>
                                                <h1 className='text-black'>
                                                {member?.member?.firstName} {member?.member?.lastName}
                                                </h1>
                                            </label>
                                            {
                                                (member?.role === 'OWNER')?
                                                (<div className='h-[40px] w-[110px] bg-slate-200 rounded-md items-center flex justify-center border-2 border-slate-300'><h1 className='text-black lg:text-lg'> {member?.role} </h1></div>):
                                                (states[index])?
                                                (<button  onClick={(event) => unbanMember(event, index, member?.member?.id)} className='h-[40px] w-[110px] bg-green-400 rounded-md border-2 border-green-500 hover:bg-green-300'><h1 className='text-black lg:text-lg'> Unban </h1></button>):
                                                (<button  onClick={(event) => banMember(event, index, member?.member?.id)} className='h-[40px] w-[110px] bg-red-400 rounded-md border-2 border-red-500 hover:bg-red-300'><h1 className='text-black lg:text-lg'> Ban </h1></button>)               
                                            }
                                            </li>
                                        )
                                    })
                                    }
                                </ul>
                            </section>)
                        }

                        {
                            (managetState === "Mute") &&
                            (<section>
                                <ul>
                                    {
                                    AllMembers.map((member: any, index: number) => {
                                        return (
                                        (member?.member?.id !== user?.id) &&
                                        <li key={member?.member?.id} className='p-4 items-center flex justify-between flex-row'>
                                            <label htmlFor="user1" className='space-x-4 flex flex-row items-center'>
                                            <Image src={member?.member?.avatar} width={100000} height={100000} alt="channel's avatar" className='w-[50px] h-[50px] rounded-full'></Image>
                                                <h1 className='text-black'>
                                                {member?.member?.firstName} {member?.member?.lastName}
                                                </h1>
                                            </label>
                                            {
                                              (member.role === 'OWNER')?
                                              (<div className='h-[40px] w-[110px] bg-slate-200 rounded-md items-center flex justify-center border-2 border-slate-300'><h1 className='text-black lg:text-lg'> {member.role} </h1></div>):
                                              (states[index])?
                                              (<button  onClick={(event) => unmuteMember(event, index, member?.member?.id)} className='h-[40px] w-[110px] bg-green-400 rounded-md border-2 border-green-500 hover:bg-green-300'><h1 className='text-black lg:text-lg'> Unmute </h1></button>):
                                              (<div className='flex flex-row space-x-4 relative text-black'>
                                                  <div className=' flex flex-col justify-center w-[95%]'>
                                                    <h1>
                                                      <button type='button' name="type" onClick={(e) =>  toggleIsOpenStates(index, e, !isOpenStates[index])} className={`rounded bg-green-50 hover:bg-green-100 border-2 border-slate-200 w-[100%] h-full flex flex-row items-center justify-between p-2`}>
                                                      {mutesIn[index]? (mutesIn[index]): ("Set time")}
                                                      {
                                                          isOpenStates[index]?
                                                          (<ChevronDown className='h-full  border-slate-200'></ChevronDown>):(<ChevronRight className='h-full border-slate-200'></ChevronRight>)
                                                      }
                                                      </button>
                                                    </h1>
                                                    {
                                                      isOpenStates[index]?
                                                        (<ul className= {`${isOpenStates[index]? 'z-50': 'z-10'}  absolute flex bg-green-50 w-[100%] top-10 right-0 flex-col items-center rounded-md justify-center mt-1`}>
                                                          <li onClick={(e) => handleInput(e, index)} className='w-full p-2 text-sm text-center rounded-lg hover:bg-green-200 hover:text-black'><button type='button' name='type' value="5"className='w-full h-full'>5 minutes</button></li>
                                                          <li onClick={(e) => handleInput(e, index)} className='w-full p-2 text-sm text-center rounded-lg hover:bg-green-200 hover:text-black'><button type='button' name='type' value="15" className='w-full h-full'>15 minutes</button></li>
                                                          <li onClick={(e) => handleInput(e, index)} className='wfull p-2 text-sm text-center rounded-lg hover:bg-green-200 hover:text-black'><button type='button' name='type' value="30"  className='w-full h-full'>30 minutes</button></li>
                                                          <li onClick={(e) => handleInput(e, index)} className='wfull p-2 text-sm text-center rounded-lg hover:bg-green-200 hover:text-black'><button type='button' name='type' value="60"  className='w-full h-full'>60 minutes</button></li>
                                                        </ul>):(null)
                                                    }
                                                  </div>
                                                <button  onClick={(event) => muteMember(event, index, member?.member?.id)} className='h-[40px] w-[110px] bg-red-400 rounded-md border-2 border-red-500 hover:bg-red-300'><h1 className='text-black lg:text-lg'> Mute </h1></button>
                                              </div>)               
                                            }
                                            </li>
                                        )
                                    })
                                    }
                                </ul>
                            </section>)
                        }
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

export default MembersManger;