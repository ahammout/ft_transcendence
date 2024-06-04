'use client'

import { useEffect, useRef, useState } from "react";
import gameSocket from "../../../lib/socket/socket";
import { useRouter } from "next/navigation";

if (!gameSocket.connected){
    gameSocket.connect();
}

class Player {
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
	score: number;

	constructor(x: number, y: number, width: number, height: number, color: string) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.score = 0;
	}
}

class Ball {
	x: number;
	y: number;
	radius: number;
	color: string;

	constructor(x: number, y: number, radius: number, color: string) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
	}
}

const Pong = (props: any) => {
  const ref = useRef(null);
	const router = useRouter();
	const [winner, setWinner] = useState("");
	const [player1name, setPlayer1name] = useState("");
	const [player2name, setPlayer2name] = useState("");
	const [player1Img, setPlayer1Img] = useState("https://res.cloudinary.com/dgmc7qcmk/image/upload/v1711300778/my-uploads/g1wk4cah5oemzb5zwjyj.png");
    const [player2Img, setPlayer2Img] = useState("https://res.cloudinary.com/dgmc7qcmk/image/upload/v1711300778/my-uploads/g1wk4cah5oemzb5zwjyj.png");

  useEffect(() => {

		// gameSocket.on("disconnect", (reason) => {});

		let playerNo = 0;
		let roomID = "";

		let player1: Player;
		let player2: Player;
		let ball: Ball;

		let mainColor = props.choice === "black" ? "black" : "white";
		let secondaryColor = props.choice === "black" ? "white" : "black";
		
		gameSocket.emit("getPlayerNo");

		gameSocket.on("playerNo", (data) => {
			playerNo = data;
		});

    const canvas = ref.current as any;
    const context = canvas.getContext('2d');

		const net = {
			x: canvas.width/2 - 2,
			y: 0,
			width: 4,
			height: 20,
			color: "white",
		}

		context.fillStyle = props.choice === "black" ? "black" : "white";
		context.fillRect(0, 0, canvas.width, canvas.height);


		gameSocket.on("startedGame", (room) => {
			
			roomID = room.id;

			setPlayer1name(room.players[0].playerName);
			setPlayer2name(room.players[1].playerName);

			setPlayer1Img(room.players[0].playerImg);
            setPlayer2Img(room.players[1].playerImg);

			player1 = new Player(room.players[0].x, room.players[0].y, 20, 200, secondaryColor);
			player2 = new Player(room.players[1].x, room.players[1].y, 20, 200, secondaryColor);

			player1.score = room.players[0].score;
			player2.score = room.players[1].score;

			ball = new Ball(room.ball.x, room.ball.y, 14, secondaryColor);

			canvas.addEventListener("mousemove", movePaddle);

			render();

			
		});

		function movePaddle(e: any) {
			let rect = canvas.getBoundingClientRect();

			if (gameSocket.connected) {
				let ply = e.offsetY * canvas.height / canvas.clientHeight - 200/2;
				gameSocket.emit("move", {
					roomID: roomID,
					playerNo: playerNo,
					y: ply,
				});
			}
		}
		
		gameSocket.on("updateGame", (room) => {
			if (!player1 || !player2 || !ball) return;
			player1.y = room.players[0].y;
			player2.y = room.players[1].y;
		
			player1.score = room.players[0].score;
			player2.score = room.players[1].score;
		
			ball.x = room.ball.x;
			ball.y = room.ball.y;
		
			render();
		});

		gameSocket.on("endGame", (room) => {
			
			// message.innerText = `${room.winner === playerNo ? "You win !" : "You lose !"}`;
			setWinner(room.winner === playerNo ? "You win !" : "You lose !");
			canvas.removeEventListener("mousemove", movePaddle);
		
			// gameSocket.emit("leave", roomID);
			// gameSocket.disconnect();
			// gameSocket.connect();
		
			setTimeout(() => {
				drawRect(0, 0, canvas.width, canvas.height, mainColor);
				router.push('/game');

			}, 2000);
		});

		function drawNet() {
			for(let i = 0; i <= canvas.height; i += 30) {
				drawRect(net.x, net.y + i, net.width, net.height, net.color);
			}
		}
		
		// draw rect function
		
		function drawRect(x: number, y: number, w: number, h: number, color: string) {
			context.fillStyle = color;
			context.fillRect(x, y, w, h);
		}
		
		// drawRect(0, 0, canvas.width, canvas.height, "black");
		
		// draw circle
		
		function drawCircle(x: number, y: number, r: number, color: string) {
			context.fillStyle = color;
			context.beginPath();
			context.arc(x, y, r, 0, Math.PI*2, false);
			context.closePath();
			context.fill();
		}
		
		// draw text
		
		function drawText(text: number | string, x: number, y: number, color: string) {
			context.fillStyle = color;
			context.font = "90px fantasy";
			context.fillText(text, x, y);
		}
		
		// render the game
		function render() {
			// clear the canvas
			drawRect(0, 0, canvas.width, canvas.height, mainColor);
		
			// draw the net
			drawNet();
		
			// draw score
			drawText(player1.score, canvas.width/4, canvas.height/5, secondaryColor);
			drawText(player2.score, 3*canvas.width/4, canvas.height/5, secondaryColor);
		
			// draw the paddles
			drawRect(player1.x, player1.y, player1.width, player1.height, player1.color);
			drawRect(player2.x, player2.y, player2.width, player2.height, player2.color);
		
			// draw ball
			drawCircle(ball.x, ball.y, ball.radius, ball.color);
		}

		setTimeout(() => {
			
			if (playerNo === 0) {
				router.push('/game');
			}
		}, 3000);



		return () => {
			// gameSocket.disconnect();
			// gameSocket.connect();
			gameSocket.off("startedGame");
			gameSocket.off("updateGame");
			gameSocket.off("endGame");
			gameSocket.off("playerNo");
			gameSocket.emit("leave");

		}

  }, []);


  return(
		<>
			<div className="border-8 rounded-lg border-[var(--mint-color)]">
            <div className="flex justify-between bg-[var(--mint-color)]">
                <p className="text-xl text-[var(third-color)] text-black mb-4 mt-4 pl-4"><img src={player1Img} alt="profile photo" className="rounded-full max-w-10 max-h-10 w-[100000px] h-[100000px] inline"/> {player1name}</p>
                <p className="text-xl text-[var(third-color)] text-black mb-4 mt-4">{winner}</p>
                <p className="text-xl text-[var(third-color)] text-black mb-4 mt-4 pr-4">{player2name} <img src={player2Img} alt="profile photo" className="rounded-full max-w-10 max-h-10 w-[100000px] h-[100000px] inline"/></p>
            </div>

            <canvas ref={ref} {...props} />
        </div>
		</>
	) 
}

export default Pong;