'use client'

import React, { useState, SyntheticEvent ,FormEvent, useEffect } from "react";


import axios from "axios";
import './style.css';
import Image from 'next/image';
import img from '../../public/landing.png'
import Validation from "./Validation";
import { useRouter } from "next/navigation";

type User = {
  email: string,
  password: string,
}
type Error = {
  [key: string]: string;
}
interface SignInProps {}

const SignIn: React.FC<SignInProps> = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<Error>({});
  const router = useRouter();


  const submit = async  (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = Validation(user);
    if (Object.keys(validationErrors).length === 0) {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/local/signin`,user,
      {
        withCredentials: true,
      
      });
      if (response.data.message === "User or password failed") {
        setError({password: 'Invalid email or password'})
      }
      else
        window.location.href = '../User/dashboard';
    } catch (error) {
    }

  } else {
    setError(validationErrors);
  }
}

  return (
    <section className="login">
      <div className="continar">
        <div className="image">
        <Image src={img} alt='logo' priority={true}></Image>
        </div>
        <div className="info">
          <p>
            <span>Login</span> Your Account
          </p>
          <form className="inputs" onSubmit={submit}>
            
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
              />
              {error.email && <p className='text-red-600 '>{error.email}</p>}
              <input
                type="password"
                placeholder="Password"
                name="password"
                id="password"
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})}
              />
              {error.password && <p className='text-red-600 '>{error.password}</p>}
            <div className="forget">
              <a href="/">back to home page</a>
            </div>
            <button type="submit">Sign in</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignIn;
