import React from 'react'

type Error = {
    [key: string]: string;
}

type User = {
    firstName: string,
    lastName: string,
    nickname: string,
    email: string,
    newPassword: string,
}

const Validation = (user:User) => {
    const error: Error = {};
    if(user.firstName.length > 0){
        if(!/^[a-zA-Z]+$/.test(user.firstName)){
            error.firstName = 'First name is invalid';}
        else if(user.firstName.length < 3){
            error.firstName = 'First name must be 3 characters long';
        }

        else if(user.firstName.length > 15){
            error.firstName = 'First name must be 15 characters long';
        }
    }
    if(user.lastName.length > 0){
        if(!/^[a-zA-Z]+$/.test(user.lastName)){
            error.lastName = 'Last name is invalid';
    }
        else if(user.lastName.length < 3){
            error.lastName = 'Last name must be 3 characters long';
        }
        else if(user.lastName.length > 15){
            error.lastName = 'Last name must be 15 characters long';
        }
    }
    if(user.nickname.length > 0){
        if(!/^[a-zA-Z0-9]+$/.test(user.nickname)){
            error.nickname = 'nickname is invalid';
    }
        else if(user.nickname.length < 3){
            error.nickname = 'nickname must be 3 characters long';
        }
        else if(user.nickname.length > 15){
            error.nickname = 'nickname must be 15 characters long';
        }
    }
    if(user.newPassword.length > 0){
        if(user.newPassword.length < 6){
            error.newPassword = 'newPassword must be 6 characters long';
        }
    }
    return error;
}

export default Validation