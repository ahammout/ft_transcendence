import React from 'react'

type Error = {
    [key: string]: string;
}

type User = {
    email: string,
    password: string,
}

const Validation = (user:User) => {
    const error: Error = {};
    if(!user.email){
        error.email = 'Email is required';
    }
    else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]+$/.test(user.email)){
        error.email = 'Email is invalid';
    }
    if(!user.password){
        error.password = 'Password is required';
    }
    return error;
}

export default Validation