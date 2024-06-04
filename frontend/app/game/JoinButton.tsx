'use client'

import { useRouter } from "next/navigation";
import gameSocket from "../../lib/socket/socket";
import userServerSocket from "../../lib/socket/user-namespace";
import { useEffect, useState } from "react";
import axios from "axios";

if (!gameSocket.connected){
    gameSocket.connect();
}

const JoinButton = (props: any) => {
	const router = useRouter();
	const [joinText, setJoinText] = useState("Join a Game");
	const [waiting, setWaiting] = useState(false);

	// useEffect(() => {
	
	// 	return () => {
	// 		userServerSocket.off("ingame");
	// 	};
	// }, []);

	// let playerNo = 0;
	let roomId = "";

	const joinGame = async () => {
		if (waiting) {
			return;
		}
		const user = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/users`, { withCredentials: true });

		setWaiting(true);

		gameSocket.emit("join", user.data);

		setJoinText("Waiting for another player to join ...");

		// gameSocket.on("playerNo", (data) => {
		// 	playerNo = data;
		// });

		gameSocket.on("ingame", () => {
			setJoinText("You are already in a game");
			setWaiting(false);

			setTimeout(() => {
				setJoinText("Join a Game");
			}, 2000);
		});

		gameSocket.off("startingGame").on("startingGame", (data) => {
			userServerSocket.emit("ingame");
			roomId = data;
			router.push(`/game/${roomId}?choice=${props.choice}`);
			// window.location.href = `/game/${roomId}?choice=${props.choice}`;
			// router.push('/?step=2', null, { shallow: true })
		});

	}

	return (
		<div {...props} onClick={joinGame}>
			{joinText}
		</div>
	);
}

export default JoinButton;