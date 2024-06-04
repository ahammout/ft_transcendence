"use client"
import Image from "next/image"
import { Crown, Handshake, Medal, Swords, User, UserCheck, UserPlus, UserMinus} from 'lucide-react'
import { LockKeyhole } from 'lucide-react'
import react, {useState, useEffect, useRef, use} from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import win1 from "../../../../public/win1.png"
import win2 from "../../../../public/win2.png"
import win3 from "../../../../public/win3.png"
import win4 from "../../../../public/win4.png"
import win5 from "../../../../public/win5.png"
import win6 from "../../../../public/win6.png"
import axios from 'axios'
import MainLayout from '@/components/User/mainlayout'
import userServerSocket from '@/lib/socket/user-namespace'
import { useRouter } from 'next/navigation'

interface DataRow {
    id: number;
    date: string;
    name: string;
    status: string;
}

interface DataRowRank {
    rank: number | string;
    id: number;
    user: string;
    status: string;
    image: string;

}

interface myComponentProps {
    params: {
        nickname: string;
    }
}

type User = {
    id: number,
    firstName: string,
    lastName: string,
    nickname: string,
    email: string,
    password: string,
    newPassword: string,
    avatar?: string,
    updateState?: boolean,
    state: string,
    wins: number,
    loses: number,
}

const columns: TableColumn<any>[]= [
    {
        name: 'Player 1',
        selector: row => row.player1,
        sortable: true,
    },
    {
        name: 'Score',
        selector: row => row.player1Score + " - " + row.player2Score,
        sortable: true,
    },
    {
        name: 'Player 2',
        selector: row => row.player2,
        sortable: true,
    }
]

//json rank test
const colmns: TableColumn<any>[] = [
    {
        name: 'Rank',
        cell: row => {
            if (row.rank === 1) {
                return ( <img src="/rank1.png" alt="rank1" className='w-[30px] h-[30px] '/>)
            }
            if (row.rank === 2) {
                return <img src="/rank2.png" alt="rank2" className='w-[30px] h-[30px] '/>
            }
            if (row.rank === 3) {
                return <img src="/rank3.png" alt="rank3" className='w-[30px] h-[30px] '/>
            }
            return row.rank
        },
        style: {
            minWidth: '50px',
            justifyContent: 'center',
            textAlign: 'center',
            backgroundColor: 'rgba(0,0,0,0.1)',
            fontSize: '20px',
            paddingLeft: '0px',
            paddingRight: '0px'
        }
    },
    {
        name: 'Profile',
        cell: row => <img  alt={row.user} src={row.avatar} className='rounded-full' style={{ height: '45px', width: '45px' }} />,

    },
    {
        name: 'Player name',
        selector: row => row.nickname,
    },
    {
        name: 'Wins',
        selector: row => row.wins,
    },
];

const Cyrcle: React.FC<myComponentProps>  = ({params}) => {

    const [online, setOnline] = useState<string>('');
    const [onlineColor, setOnlineColor] = useState<string>('');
    const [ingame, setIngame] = useState<boolean>(false);
    const router = useRouter();
    const button1Ref = useRef<HTMLButtonElement>(null);
    const [Loading, setLoading] = useState<boolean>(false);
    const [friend, setFriend] = useState<boolean>(false);
    const [checkNickname, setCheckNickname] = useState<boolean>(true);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [onlineStatus, setOnlineStatus] = useState<boolean>();
    const [friendData, setFriendData] = useState<User>({
        id: 0,
        firstName: '',
        lastName: '',
        nickname: '',
        email: '',
        password: '',
        newPassword: '',
        state: '',
        wins: 0,
        loses: 0,
    });
    const [userData, setUserData] = useState<User>({
        id: 0,
        firstName: '',
        lastName: '',
        nickname: '',
        email: '',
        password: '',
        newPassword: '',
        state: '',
        wins: 0,
        loses: 0,
    });


    const [buttonState, setButton] = useState({
        button1: 'border-transparent',
        button2: 'border-transparent',
        button3: 'border-transparent'
    });


    const [historyData, setHistoryData] = useState([]);
    const [rankData, setRankData] = useState([]);
    
    

    useEffect(() => {
        fetchMatchHistory();
        fetchRankData();
    }, [userData])
    
    const fetchMatchHistory = async () =>  {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/match-history/${friendData.id}`, {
                withCredentials: true,
            });
            setHistoryData(response.data);
        } catch (error) {
        }
    }

    const fetchRankData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/leaderboard`, {
                withCredentials: true,
            });
            response.data.forEach((object: any, index: any) => {
                object.rank = index + 1;
            });
            setRankData(response.data);
        } catch (error) {

        }
    }



    const [imBlocked, setImBlocked] = useState(false);
    const [imFriend, setImfriend] = useState(false);
    const [iSendRequest, setIsendRequest] = useState(false)
    const [notFriend, setNotFriend] = useState(false);
    
    useEffect(() => {
        if (userData.id === 0 || friendData.id === 0) {
            return;
        }
        fetchFrienrolation();
    }
    , [userData, friendData]);
    const fetchFrienrolation = async () => {
        try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/findOneFriend`, {userId: userData.id, friendId: friendData.id}, {
            withCredentials: true,
        });
        if (response.data.status === 'friend') {
            setImfriend(true);
        }
        if (response.data.status === 'blocked') {
            setImBlocked(true);
        }
        if (response.data.status === 'pending') {
            setIsendRequest(true);
        }
        if (response.data.status === 'notFriend') {
            setNotFriend(true);
        }
        } catch (error) {
    }
    finally {
        setIsAuthorized(true);
    }
    }

    useEffect(() => {
        fetchallFriendsImsendRequest();
    }
    , [userData, friendData]);
    const fetchallFriendsImsendRequest = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/get-all-add-friends`, {friendId: friendData.id},{
                withCredentials: true,
            });
            // userId is the id of the user who send the request
            // [0] is pending request
            // [1] is blocked request
            if (response.data[0].status) {
                setIsendRequest(true);
                setNotFriend(false);
            }
            if (response.data[1].status) {
                setImBlocked(true);
                setNotFriend(false);
            }

        } catch (error) {
        }
    }



    const handleAddfriendClick = async () => {
        if (notFriend) {
            setNotFriend(false);
            setIsendRequest(true);
            const msg = "New friend request from " + userData.nickname;
            userServerSocket.emit('notification',  {message: msg , friendId: friendData.id, userId: userData.id});
        }
    }

//online offline listener

    userServerSocket.off('user_connected').on('user_connected', (data: any) => {
        if (friendData.state !== 'ONGAME') {
        if (data.userId === friendData.id) {
            setOnline("ONLINE");
            setOnlineColor('bg-green-500');
        }
    }
    })
    userServerSocket.off('user_disconnected').on('user_disconnected', (data: any) => {
        if (friendData.state !== 'ONGAME') {
        if (data.userId === friendData.id) {
            setOnline("OFFLINE");
            setOnlineColor('bg-red-500');
        }
    }
    })

    userServerSocket.off('user_ingame').on('user_ingame', async (data: any) => {
        if (data.userId === friendData.id) {
        setOnline("INGAME");
        setOnlineColor('bg-blue-500');
        }
    })
    userServerSocket.off('user_outgame').on('user_outgame', (data: any) => {
        if (data.userId === friendData.id) {
        setOnline("ONLINE");
        setOnlineColor('bg-green-500');
        }
    })




    useEffect(() => {
        if (button1Ref.current)
            button1Ref.current.click();
        fetchFriendData();
    }, []);
    useEffect(() => {
        fetchTochickIfNicknameExist();
        fetchUserData();
    }
    , [params.nickname]);

    const fetchTochickIfNicknameExist = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/${params.nickname}` , {
                withCredentials: true,
            });
        if (response.data.message === 'User not found') {
            !response.data.updateState && ( router.push('/User/update'));
            router.push('/User/dashboard')
        }
        } catch (error) {
            router.push('/')
        }
    }

    const fetchFriendData = async () => {
        try {
            
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/${params.nickname}`, {
            withCredentials: true,
        });
        setFriendData(response.data);
        setOnline(response.data.state === 'ONLINE' ? 'ONLINE' : (response.data.state === 'OFFLINE' ? 'OFFLINE' : 'INGAME'));
        setOnlineColor(response.data.state === 'ONLINE' ? 'bg-green-500' : (response.data.state === 'OFFLINE' ? 'bg-red-500' : 'bg-blue-500'));
    } catch (error) {
    }
    finally {
        setLoading(true);
    }
    }

    const fetchUserData = async () => {
        try {
            
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/users`, {
            withCredentials: true,
        });
        setUserData(response.data);
        !response.data.updateState && ( router.push('/User/update'));
        if(response.data.twoFactorEnabled && !response.data.is2FAuthenticated){
            router.push('../User/chack2FA')
        }
        setOnlineStatus(response.data.state === 'ONLINE' ? true : false);
        if (response.data.nickname === params.nickname) {
            setCheckNickname(false);
        }
    } catch (error) {
        router.push('/')
    }

    }

    if (!isAuthorized) {
        return <div className='flex justify-center items-center h-screen' >
            <div className='text-3xl text-gray-600 animate-pulse'>Loading...</div>
        </div>
    }


    return (
        <MainLayout>
            <div className="container99">
            <div className='parent99'>
            <div className="boxes">
            <div className="box flex justify-center profile-box">
                    <div className='container-1 w-[100%]'>
                        <div className="card h-[895px] mint-gradiant rounded-t-3xl shadow-md">
                            <h1 className='font-bold text-2xl text-center'>Profile</h1>
                            <div className="bg-profel h-[146px] rounded-t-3xl" >
                            </div>
                            <div className="h-[100%] text-center">
                                <div className="image relative w-fit mx-auto">
                                    <img src={friendData.avatar} alt="user" className="w-48 h-48 object-cover rounded-full p-1 bg-white -mt-28 mb-[10px] m-auto"/>
                                    {checkNickname &&
                                    <label onClick={handleAddfriendClick}>
                                        {imFriend && <Handshake className='text-blue-600 absolute left-[85%] mt-[50px] top-[50%] translate-y-[-50%] bg-slate-50 text-[50px] w-[30px] h-[30px] p-[5px] rounded-[12px] cursor-pointer'/> }
                                        {imBlocked && <UserMinus className='text-red-600 absolute left-[85%] mt-[50px] top-[50%] translate-y-[-50%] bg-slate-50 text-[50px] w-[30px] h-[30px] p-[5px] rounded-[12px] cursor-pointer'/> }
                                        {iSendRequest && <UserCheck className='text-green-600 absolute left-[85%] mt-[50px] top-[50%] translate-y-[-50%] bg-slate-50 text-[50px] w-[30px] h-[30px] p-[5px] rounded-[12px] cursor-pointer'/> }
                                        {notFriend && <UserPlus className='absolute left-[85%] mt-[50px] top-[50%] translate-y-[-50%] bg-slate-50 text-[50px] w-[30px] h-[30px] p-[5px] rounded-[12px] cursor-pointer'/> }
                                    </label>
                                }
                                </div>
                                <div className='flex relative justify-evenly items-center'>
                                    <span className=" text-black font-semibold text-2xl mt-[20px] ">{friendData.nickname}</span>
                                    <span className='text-sm mt-[20px] ml-[100px]'>{online}</span>
                                    <div className={`mt-[20px] min-w-[15px] h-[15px] rounded-full ${onlineColor}  border-2 border-white `}>
                                    </div>
                                </div>
                                <div className='cyrcle-barr'>
                            <div className='Profile-Boxes'>
                                <div className="profile-box bg-[#7eabab] text-white">
                                    <Crown 
                                        className="star"
                                    />
                                    <div className="infos">
                                        <span>Wins</span>
                                        <p>{friendData.wins}</p>
                                    </div>
                                </div>
                                <div className="profile-box bg-[#e66e68] text-white">
                                    <Swords 
                                        className="star"
                                    />
                                    <div className="infos">
                                        <span>Losses</span>
                                        <p>{friendData.loses}</p>
                                    </div>
                                </div>
                                <div className="profile-box bg-[#61a391] text-white">
                                    <Medal 
                                        className="star"
                                    />
                                    <div className="infos">
                                        <span>Achievements</span>
                                        <p>{friendData.wins >= 20 ? `6` : (friendData.wins >= 15 ? `5` : (friendData.wins >= 10 ? `4` : (friendData.wins >= 5 ? `3` : (friendData.wins >= 3 ? `2` : (friendData.wins >= 1 ? `1`: `0`)))))} </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                </div>
                <div className=' box flex flex-col justify-between items-center'>
                    <h1 className='font-bold text-2xl'>Achievements</h1>
                    <div className='W-[100%] flex flex-wrap  justify-between '>
                        <div className='w-[33%] p-2 flex justify-center'>
                            <div className='relative  max-w-[120px]'>
                                <Image
                                    src={win1} 
                                    alt="win2" 
                                    className={`max-w-[120px] border-4 rounded-md ${friendData.wins >= 1 ? '': 'blur-sm'}`}
                                />
                                {!(friendData.wins >= 1) && <LockKeyhole size={64} className=' absolute top-[50%] left-[50%] -translate-x-[50%]  -translate-y-[50%] text-emerald-300 w-full' />}
                            </div>
                        </div>
                        <div className='w-[33%] p-2 flex justify-center'>
                            <div className='relative  max-w-[120px]'>
                                <Image
                                    src={win2} 
                                    alt="win2" 
                                    className={`max-w-[120px] border-4 rounded-md ${friendData.wins >= 3 ? '': 'blur-sm'}`}
                                />
                                {!(friendData.wins >= 3) && <LockKeyhole size={64} className=' absolute top-[50%] left-[50%] -translate-x-[50%]  -translate-y-[50%] text-emerald-300 w-full' />}
                            </div>
                        </div>
                        <div className='w-[33%] p-2 flex justify-center'>
                            <div className='relative  max-w-[120px]'>
                                <Image
                                    src={win3} 
                                    alt="win3" 
                                    className={`max-w-[120px] border-4 rounded-md ${friendData.wins >= 5 ? '': 'blur-sm'}`}
                                />
                                {!(friendData.wins >= 5) && <LockKeyhole size={64} className=' absolute top-[50%] left-[50%] -translate-x-[50%]  -translate-y-[50%] text-emerald-300 w-full' />}
                            </div>
                        </div>
                        <div className='w-[33%] p-2 flex justify-center'>
                            <div className='relative  max-w-[120px]'>
                                <Image
                                    src={win4} 
                                    alt="win4" 
                                    className={`max-w-[120px] border-4 rounded-md ${friendData.wins >= 10 ? '': 'blur-sm'}`}
                                />
                                {!(friendData.wins >= 10) && <LockKeyhole size={64} className=' absolute top-[50%] left-[50%] -translate-x-[50%]  -translate-y-[50%] text-emerald-300 w-full' />}
                            </div>
                        </div>
                        <div className='w-[33%] p-2 flex justify-center'>
                            <div className='relative  max-w-[120px]'>
                                <Image
                                    src={win5} 
                                    alt="win5" 
                                    className={`max-w-[120px] border-4 rounded-md ${friendData.wins >= 15 ? '': 'blur-sm'}`}
                                />
                                {!(friendData.wins >= 15)&& <LockKeyhole size={64} className=' absolute top-[50%] left-[50%] -translate-x-[50%]  -translate-y-[50%] text-emerald-300 w-full' />}
                            </div>
                        </div>
                        <div className='w-[33%] p-2 flex justify-center'>
                            <div className='relative  max-w-[120px]'>
                                <Image
                                    src={win6} 
                                    alt="win6" 
                                    className={`max-w-[120px] border-4 rounded-md ${friendData.wins >= 20 ? '': 'blur-sm'}`}
                                />
                                {!(friendData.wins >= 20) && <LockKeyhole size={64} className=' absolute top-[50%] left-[50%] -translate-x-[50%]  -translate-y-[50%] text-emerald-300 w-full' />}
                            </div>
                        </div>
                    </div>
                    <div className=' w-[100%] h-[500px] gradient-bg p-2 rounded-2xl'>
                        <h1 className='font-bold text-2xl text-center'>History</h1>
                        <div className='flex justify-evenly w-[100%] bg-emerald-400 p-4 rounded-t-2xl'>
                            <h1 className='text-xl text-center font-sans text-white'>last games results</h1>
                        </div>
                        <div className='rounded-b-2xl h-[400px]'>
                            <DataTable 
                                className='h-[300px]'
                                columns={columns}
                                data={historyData}
                                fixedHeader
                            />
                        </div>
                    </div>
                    
                </div>
                <div className='box'>
                    <div className='text-center'>
                        <DataTable 
                        title="Rank"
                        columns={colmns}
                        data={rankData}
                        fixedHeader
                        />
                    </div>
                </div>
            </div>
        </div>
            </div>
        </MainLayout>
    
        )
}

export default Cyrcle


