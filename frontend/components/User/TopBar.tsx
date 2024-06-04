"use client"
import React, { use, useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBell, faS } from "@fortawesome/free-solid-svg-icons";
import { Bell } from "lucide-react";
import photo from "../../public/profile.png";
import userServerSocket from "@/lib/socket/user-namespace";
import { useRouter } from "next/navigation";
import { formatRelativeTime } from "./formatRelativeTime";


type User = {
  id: number,
  firstName: string,
  lastName: string,
  nickname: string,
  email: string,
  password: string,
  newPassword: string,
  avatar: string,
}

interface pair {
  message: string;
  date: string;
}


const TopBar = () => {
  const [notificationWithDate, setNotificationWithDate] = useState<pair[]>([]);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [newNotification, setNewNotification] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationData, setNotificationData] = useState<string[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [notificationBackground, setNotificationBackground] = useState<string>('bg-white text-black');
  const [userData, setUserData] = useState<User>({
    id : 0,
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    password: '',
    newPassword: '',
    avatar: '',
});

// fetch to count unread notifications
const fetchNotification = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/getNotificationByread`, {
    withCredentials: true,
  });
    //setAllNotificationsStatus(response.data.map((notification: any) => notification.read));
    const unreadNotifications = response.data.filter((notification: any) => notification.read === false);
    setNotificationCount(unreadNotifications.length);
    if (unreadNotifications.length > 0) {
      setNewNotification(true);
      setNotificationBackground('bg-red-600 text-white');
    }
  } catch (error: any) {}
}

useEffect(() => {
  fetchNotification();
}
, []);

const fetchUser = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/users`, {
    withCredentials: true,
  });
  setUserData(response.data);
  userServerSocket.emit("join", {id: response.data.id});
  
  } catch (error: any) {}
  };


useEffect(() => {
  if (!userServerSocket.connected) {
    userServerSocket.connect();
  }
  return (() => { userServerSocket.disconnect() });
}, []);

useEffect(() => {
  fetchUser();
  userServerSocket.on('notification', (data) => {
    // setNotificationData(prevData => [...prevData, data.message]);
    setNewNotification(true);
    setNotificationCount(prevCount => prevCount + 1);
    setNotificationBackground('bg-red-600 text-white');
  });
  return (() => {
    userServerSocket.off()
  })
}, [userServerSocket]);

/***********************mhdi*********************/
  const onSearch = async () => {
    const encodedSearchQuery = encodeURIComponent(searchQuery);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/search?q=${encodedSearchQuery}`);
      setSearchResults(response.data.results);
    } catch (error) {}
  };


  const handleKeyUp = () => {
    onSearch(); 
  };

  /***************mhdi end*******************/  //!!!!!!!!!!!!!!! 
  const handleBellClick = async () => {
    setShowNotification(!showNotification);
    if (newNotification) {
      setNewNotification(false);
      setNotificationCount(0);
      setNotificationBackground('bg-white text-black');
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/get-and-update-state`, {
        withCredentials: true,
      });
      setNotificationWithDate(response.data.map((notification: any) => ({message: notification.message, date: formatRelativeTime(notification.createdAt)})));
    }
    catch (error: any) {}
  }

  const handleNotifacationLiClick =  () => {
    router.push(`/User/friends`);
  }



  const handleUserClick =  () => {
    router.push('/User/dashboard/');
  }
  const hadndleImageClick = () => {
    router.push('/User/dashboard/');
  }

  return (
    <form>
      <header className="topBar-99 ml-[-20px] flex justify-center items-center h-16 bg-[#3d8687] px-6 relative">
          <div className="flex flex-1 justify-between items-center">
            {/* ******* mhdi search *******/}
            <div className="ml-[80px] relative">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyUp={handleKeyUp}
                type="text"
                placeholder="Search"
                className="Search-99 px-4 py-2 w-96 pl-[50px] caret-white text-white placeholder-slate-50 rounded-full border-none focus:outline-none bg-transparent " 
              />

              <FontAwesomeIcon
                icon={faSearch}
                className="SearchIcon-99 absolute top-[50%] translate-y-[-50%] left-0 text-white w-[35px] text-lg ml-2 cursor-pointer"
              />
              
            </div>
            {/* ******* end mhdi  *******/}
            <div className="flex items-center gap-[20px]">
              <div onClick={handleBellClick} className="Notification-99 mb-[20px] text-white transition-colors hover:text-green-500 py-8 cursor-pointer">
                <div className={`relative top-[10px] left-[10px] w-[20px] h-[20px] ${notificationBackground} rounded-full flex justify-center items-center text-xs`}><span>{notificationCount}</span></div>
                <Bell />
              {showNotification &&
                  <ul className="Notification-box">
                    {notificationWithDate.map((notification, index) => (
                      <li key={index} onClick={handleNotifacationLiClick} className="Notification-item">
                        <div className="Notification-item-content">
                          <p>{notification.message}</p>
                          <p className="text-[#909090]">{notification.date}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
              }
              </div>
              <div>
                <span onClick={handleUserClick} className="user-99 text-white text-lg font-semibold cursor-pointer hover:text-green-500">{userData.nickname}</span>
              </div>
              <div>
                {userData.avatar ? <img onClick={hadndleImageClick} src={userData.avatar} alt="profile photo" className="rounded-full max-w-10 max-h-10 w-[100000px] h-[100000px] cursor-pointer " /> : <img src={photo.src} alt="profile photo" className="rounded-full w-10 h-10" />}
              </div>
            </div>
            {searchQuery.length > 0 && <ul className={`Members99 w-[430px] mx-auto max-h-[350px] overflow-auto absolute z-10 p-2 divide-y divide-slate-200 bg-white top-[64px] left-[90px] shadow-xl`} > 
                {searchQuery !== "" && searchResults.map((user) => (
              <li className="flex items-center p-4 first:pt-0 last:pb-0 cursor-pointer" key={user.id} onClick={() =>{window.location.href = `/User/dashboard/${user.nickname}`}}>
              <img className="h-10 w-10 rounded-full" src = {user.avatar} alt="" />
              <div className="ml-3 overflow-hidden">
                {searchQuery === user.nickname ? (
                  <span>{user.nickname}</span>
                ) : searchQuery === user.firstName ? (
                  <span>{user.firstName}</span>
                ) : searchQuery === user.lastName ? (
                  <span>{user.lastName}</span>
                ) : (
                  <span className="text-sm font-semibold text-[#3d8687]">{user.nickname || user.firstName || user.lastName}</span>
                )}
              </div>
            </li>
          ))}
        </ul>}
          </div>
      </header>
    </form>
  );
};

export default TopBar;