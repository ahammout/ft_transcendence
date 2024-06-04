import React from 'react'

type Error = {
    [key: string]: string;
}

type User = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
}

const Validation = (user:User) => {
    const error: Error = {};
    
    if(!user.firstName){
        error.firstName = 'First name is required';
    } else if(!/^[a-zA-Z]+$/.test(user.firstName)){
        error.firstName = 'First name is invalid';
    }
    else if(user.firstName.length < 3){
        error.firstName = 'First name must be 3 characters long';
    }
    else if(user.firstName.length > 15){
        error.firstName = 'First name must be 15 characters long';
    }
    if(!user.lastName){
        error.lastName = 'Last name is required';
    }else if(!/^[a-zA-Z]+$/.test(user.lastName)){
        error.lastName = 'Last name is invalid';
    }
    else if(user.lastName.length < 3){
        error.lastName = 'Last name must be 3 characters long';
    }
    else if(user.lastName.length > 15){
        error.lastName = 'Last name must be 15 characters long';
    }
    if(!user.email){
        error.email = 'Email is required';
    }else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]+$/.test(user.email)){
        error.email = 'Email is invalid';
    }
    if(!user.password){
        error.password = 'Password is required';
    }else if(user.password.length < 6){
        error.password = 'Password must be 6 characters long';
    }
    if(!user.confirmPassword){
        error.confirmPassword = 'Confirm password is required';
    }else if(user.password !== user.confirmPassword){
        error.confirmPassword = 'Password does not match';
    }

    return error;
}

export default Validation
