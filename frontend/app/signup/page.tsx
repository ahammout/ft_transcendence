'use client'
import React, { useState, ChangeEvent, FormEvent, use, useEffect } from "react";
import axios from "axios";
import Image from 'next/image';
import img1 from '../../public/landing.png'
import img3 from '../../public/42.png'
import img4 from '../../public/social.png'
import './style.css';
import Validation from "./Validation";
import { useRouter } from "next/navigation";

type User = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
}

type Error = {
  [key: string]: string;
}

interface SignupProps {}


const Signup: React.FC<SignupProps> = () => {

  const router = useRouter();


  const [accept, setAccept] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(true);

  const [error, setError] = useState<Error>({});
  const [user, setUser] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    password:  '',
    confirmPassword: '',
  });
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAccept(true);
    const validationErrors = Validation(user);
    if (Object.keys(validationErrors).length === 0) {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/local/signup`, user,
      {
        withCredentials: true,
      });
      if (response.data.message === 'Email already exist')
      {
        setError({
          email: "Email already exists!"
        });
      }
      else{
      router.push('../User/update');}
    } catch (error) {}
  }else{
  setError(validationErrors);}
  }

  return (
    <section className="login">
      <div className="continar">
        <div className="image">
        <Image src={img1} alt="landin" priority={true} ></Image>
        </div>
        <div className="info">

        <form className="inputs" onSubmit={handleSubmit}>
    
        <input
              type="text"
              name="firstName"
              id="firstName"
              value={user.firstName}
              placeholder="First Name"
              onChange={(e) => setUser({...user, firstName: e.target.value})}
            />
            {error.firstName && <p className='text-red-600 '>{error.firstName}</p>}
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              id="lastName"
              value={user.lastName}
              onChange={(e) => setUser({...user, lastName: e.target.value})}
            />
            {error.lastName && <p className='text-red-600 '>{error.lastName}</p>}
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              id="email"
              value={user.email}
              onChange={(e) => setUser({...user, email: e.target.value})}
            />
            {error.email && <p className='text-red-600 '>{error.email}</p>}
            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              value={user.password}
              onChange={(e) => setUser({...user, password: e.target.value})}
            />
            {error.password && <p className='text-red-600 '>{error.password}</p>}
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={user.confirmPassword}
              onChange={(e) =>  setUser({...user, confirmPassword: e.target.value})}
            />
            {error.confirmPassword && <p className='text-red-600 '>{error.confirmPassword}</p>}
            <input type="submit" value="Sign up" />
            
    </form>

          <p>Or, Sign up with</p>
          <div className="social">
          <a href={`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/42school/redirect`} >
            <Image src={img3} alt="42 school" />
          </a>
          {/* <a href={`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/google/redirect`}>
          <Image src={img4} alt="Google" />
          </a> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
