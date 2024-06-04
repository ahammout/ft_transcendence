"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import img from '../public/landing.png'
import img2 from '../public/ping-pong-logo1.png'
import './styel.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [showMore,setShowMore] = useState(false)

  const toggleShowMore=() => {
    setShowMore(!showMore)
  }

  return (
    <div>
      {/* start header */}
      <header>
        <div className="container">
          <div className="main-nav">
            <Link href="#">
              <Image src={img2} alt='logo' className='logo'></Image>
            </Link>
            <Link href="../signup">
            
              <button className='sing-btn-header'>Sing Up</button>
          
            </Link>
          </div>
        </div>
      </header>
      {/* end header */}
      
      {/* start landing */}
      <div className="landing">
        <div className="container">
          <div className="info">
            <h2 className="info">ping pong <span>Game</span></h2>
            <p>Welcome to our Pong Game website, where classic arcade fun meets modern connectivity! Dive into the nostalgia of Pong, the iconic game that started it all, right from your browser. Challenge friends in fast-paced, thrilling matches. </p>
            {showMore &&(
              <div>
                <p>But that's not all - our website goes beyond just gaming. With integrated chat features, you can connect with fellow players and simply chat while enjoying the game. Our user-friendly interface ensures a seamless experience, whether you're a seasoned Pong player or just starting out. Join us for endless hours of entertainment and friendly competition!</p>
              </div>
            )}
            <div className="buttons">
            
              <Link href="#">
                <button className='info-btn' onClick={toggleShowMore}>Read More</button>
              
              </Link>
              <Link href="../signin">
              
                <button className='info-btn font-bold'>Sign in</button>
              </Link>
            </div>
          </div>
          
          <div className="imge">
            <Image src={img} alt='logo' priority ></Image>
        </div>

        </div>
      </div>
      {/* end landing */}
    </div>
  );
}
