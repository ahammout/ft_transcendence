"use client";

import { useSearchParams } from "next/navigation";
import Pong from "./Pong";
import { useEffect } from "react";
import userServerSocket from "@/lib/socket/user-namespace";

if (!userServerSocket.connected){
  userServerSocket.connect();
}

export default function Game() {
  const searchParams = useSearchParams();

  useEffect(() => {


    return () => {
        userServerSocket.emit("outgame");
    };
}, []);

  const choice = searchParams.get("choice");
  return (
        <main className="w-full h-screen bg-gradient-to-t from-[var(--blue-color)] to-[var(--mint-color)] flex flex-col">
      <div className="flex  items-center justify-center h-full">
        <div className="flex flex-col gap-4 m-20">
          <Pong className="canvas-resize" width={1200} height={700} choice={choice} />
        </div>
      </div>
    </main>
  );
}