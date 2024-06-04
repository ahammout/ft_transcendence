import React from 'react'

type Error = {
    [key: string]: string;
}

type User = {

    nickname: string,
    email: string,
    newPassword: string,
}

const Validation = (user:User) => {
    const error: Error = {};
    
    if(!user.nickname){
        error.nickname = 'nickname is required';
    }else if(!/^[a-zA-Z0-9]+$/.test(user.nickname)){
        error.nickname = 'nickname is invalid';
    }
    else if(user.nickname.length < 3){
        error.nickname = 'nickname must be 3 characters long';
    }
    else if(user.nickname.length > 15){
        error.nickname = 'nickname must be 15 characters long';
    }
    if(!user.newPassword){
        error.newPassword = 'Password is required';
    }else if(user.newPassword.length < 6){
        error.newPassword = 'Password must be 6 characters long';
    }

    return error;
}

export default Validation