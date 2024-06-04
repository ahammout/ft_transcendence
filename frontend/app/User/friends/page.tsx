'use client'
import React, {use, useEffect, useState,useContext } from 'react'
import Image from "next/image"
import MainLayout from '@/components/User/mainlayout'
import { io } from 'socket.io-client'
import axios from 'axios'
import "./style.css"
import userServerSocket from '@/lib/socket/user-namespace'
import { stat } from 'fs'


type User = {
  id: number,
  firstName: string,
  lastName: string,
  nickname: string,
  email: string,
  password: string,
  newPassword: string,
  avatar?: string,

}

interface idAndState {
  id: number,
  state: string
}

const Profile = () => {

  const usertest = 
  {
    state:"ONLINE"
  }

  const [activeTab, setActiveTab] = useState('Request');
  const [allFriends, setAllFriends] = useState<any[]>([]);
  const [myFriendsState, setMyFriendsState] = useState<idAndState[]>([]);

  useEffect(() => {
    fetchAllFriends();
  }, []);

  const fetchAllFriends = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/all_friends`, {
        withCredentials: true,
      });
      setAllFriends(response.data);
      const initialMyFriendsState = response.data.map((object : any) => {
        return {id: object.friend.id, state: object.friend.state};
      }
      );
      setMyFriendsState(initialMyFriendsState);
    } catch (error) {}
  };


const handleAccept = async (arg: any) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/accept-friend`, { userId: arg.userId, friendId: arg.friendId });
    location.reload();
  } catch (error) {}
};


const handleBlock = async (arg :any) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/block`, { userId: arg.userId, friendId: arg.friendId });
    location.reload();
  } catch (error) {}
};
const handleunblock = async (arg : any) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/unblock`,{ userId: arg.userId, friendId: arg.friendId } );
    location.reload();
  } catch (error) {}
};




 // end hadller acpet and ignor///////////
    
  //online offline listener
  userServerSocket.on('user_connected', (data: any) => {
      const updatedFriendsState = myFriendsState.map((friend) => {
        if (friend.id === data.userId) {
          return { ...friend, state: "ONLINE" };
        }
        return friend;
      });
    
      setMyFriendsState(updatedFriendsState);
  })
  userServerSocket.on('user_disconnected', (data: any) => {
    const updatedFriendsState = myFriendsState.map((friend) => {
      if (friend.id === data.userId) {
        return { ...friend, state: "OFFLINE" };
      }
      return friend;
    });
  
    setMyFriendsState(updatedFriendsState);
  })

  userServerSocket.on('user_ingame', (data: any) => {
    const updatedFriendsState = myFriendsState.map((friend) => {
      if (friend.id === data.userId) {
        return { ...friend, state: "ONGAME" };
      }
      return friend;
    });
  
    setMyFriendsState(updatedFriendsState);
  })
  userServerSocket.on('user_outgame', (data: any) => {
    const updatedFriendsState = myFriendsState.map((friend) => {
      if (friend.id === data.userId) {
        return { ...friend, state: "ONLINE" };
      }
      return friend;
    });
  
    setMyFriendsState(updatedFriendsState);
  })

    return (
      <MainLayout>
        <div className="container99 w-[100%]">
          <div className="parent99">
            <div className='Settings'>
              <div className='box-2'>
            <h1 className=''>My Friends</h1>
            <div className=''>
              <table className=''>
                <thead className=''>
                  <tr>
                    <th>
                      <button className={`btn ${activeTab === 'Friends' ? 'active' : ''}`} onClick={() => {
                    setActiveTab('Friends');
                    }}>
                    Friends
                      </button>
                    </th>
                    <th>
                      <button
                    className={`btn ${activeTab === 'Request' ? 'active' : ""}`}
                    onClick={() => setActiveTab('Request')}
                  >
                    Request
                      </button>
                    </th>
                    <th>
                      <button
                    className={`btn ${activeTab === 'Block' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Block')}
                  >
                    Block
                      </button>
                    </th>
                  </tr>
                </thead>
              </table>
              {activeTab === 'Friends' && (
              <div className='MemberList'>
              <table className='MemberListTb w-[100%]'>
            <tbody>
            {allFriends.map((friend, index) => ( 
              (friend.status === 'ACCEPTED')?
              (<tr key={friend.friend.id} className='fr px-[20px]'>
                <td  className='flex items-center gap-4'>
                  <Image className='ph w-[35px] h-[35px]' src={friend.friend.avatar} alt='person' width={100000} height={100000} ></Image>
                <div className='infos'>
                  <p>{friend.friend.nickname}</p>
                  <div className='online-infos'>
                    <span className='text-sm'>{myFriendsState[index]?.state}</span>
                    <span className={`block w-[15px] h-[15px] rounded-full ${myFriendsState[index]?.state === "ONLINE" ? "bg-green-500" :  (myFriendsState[index]?.state === "OFFLINE" ? "bg-red-500" : "bg-blue-500")}  border-2 border-white `}></span>
                  </div>
                </div>
                </td>
                <td>
                <button className='btnf hover:btnff' onClick={() => handleBlock({userId: friend.user.id, friendId: friend.friend.id})}>Block</button>
                </td>
              </tr>):(null)
              )) }
              </tbody>
              </table>
            </div>
        
              )}

              

          
            {activeTab === 'Request' && (
          <div className='MemberList'>
            <table className='MemberListTb w-[100%]'>
            <tbody>
            {allFriends.map((friend) => ( 
              (friend.status === 'PENDING')?
              (<tr key={friend.friend.id} className='fr px-[20px]'>
                <td className='flex items-center gap-4'>
                <Image className='ph w-[35px] h-[35px]' src={friend.friend.avatar} alt='person' width={100000} height={100000} ></Image>
                  <p>{friend.friend.nickname}</p>
                </td>
                
                <td>
                <button className='Accpt' onClick={() => handleAccept({userId: friend.user.id, friendId: friend.friend.id})}>Accept</button>
                </td>
              </tr>):(null)
            )) }
            </tbody>
            </table>
          </div>
              )}




              {activeTab === 'Block' && (
            <div className='MemberList'>
            <table className='MemberListTb w-[100%]'>
              <tbody> 
            {allFriends.map((friend) => ( 
              (friend.block)?
              (<tr key={friend.friend.id} className='fr px-[20px]'>
                <td className='flex items-center gap-4'>
                <Image className='ph w-[35px] h-[35px]' src={friend.friend.avatar} alt='person' width={100000} height={100000} ></Image>
                  <p>{friend.friend.nickname}</p>
                </td>
                <td>
                <button className='blockk' onClick={() => handleunblock({userId: friend.user.id, friendId: friend.friend.id})}>unblock</button>
                </td>
              </tr>):(null)
            )) }
            </tbody>
            </table>
          </div>
              )}
            </div>
              </div>
            </div>
          </div>
        </div>
</MainLayout>

        
    )
}



export default Profile