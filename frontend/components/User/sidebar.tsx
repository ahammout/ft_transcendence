
import { Home, MessageCircle, User, Settings, LogOut, Gamepad2 } from "lucide-react";
import axios from 'axios';
import { useRouter } from 'next/navigation'



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

const Sidebar  = () => {
const router = useRouter();

const handleLogOutClick = async () => {
  try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/logout`, {
        withCredentials: true,
      });
        router.push('/signin')
    } catch (error) {
  }
};
const handleHomeClick = () => {
  router.push('/User/dashboard');
}

const handleChatClick = () => {
  router.push('/chat');
}

const handleFriendClick = () => {
  router.push('/User/friends');
}

const handleGameClick = () => {
  router.push('/game');
}

const handleSettingsClick = () => {
  router.push('/User/Profile');
}



  return (
    <div className="h-full mr-[20px] w-[70px] fixed top-0 left-0 flex flex-col justify-between items-center text-white pt-16 pb-4 bg-gray-800 z-10">
      <div onClick={handleHomeClick} className="hover:text-green-500 py-8 cursor-pointer">
        <Home className="text-2xl" />
      </div>
      <div onClick={handleChatClick} className="hover:text-green-500 cursor-pointer">
        <MessageCircle className="text-2xl" />
      </div>
      <div onClick={handleFriendClick} className="hover:text-green-500 cursor-pointer">
        <User className="text-2xl" />
      </div>
      <div onClick={handleGameClick} className="hover:text-green-500 cursor-pointer">
        <Gamepad2 className="text-2xl" />
      </div>
      <div onClick={handleSettingsClick} className="hover:text-green-500 cursor-pointer">
        <Settings className="text-2xl" />
      </div>
      <div onClick={handleLogOutClick} className="hover:text-green-500 cursor-pointer py-8">
        <LogOut className="text-2xl" />
      </div>
    </div>
  );
}

export default Sidebar;
