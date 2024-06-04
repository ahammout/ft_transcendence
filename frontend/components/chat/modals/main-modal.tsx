"use client"

import React from 'react'
import { X } from 'lucide-react'
import {AppDispatch} from '@/lib/redux/store'
import { useDispatch, useSelector } from "react-redux";
import { setModalVisibility } from '@/lib/redux/reducers/GlobalState'
import  ModalHandler from './modals-handler'

const Modal = ( {isVisible}: any ) => {
  const dispatch = useDispatch<AppDispatch>()
  
  if ( !isVisible ) return null;

  const closeModal = () => {
      dispatch(setModalVisibility(false))
  }

  // const MouseClose = (e) => {
  //   if (e.target.id === 'toClose')
  //       dispatch(setModalVisibility(false))
  // }

  return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-lg' id="toClose">
          <div className='w-[800px] flex flex-col' >
            <div className='flex flex-row justify-end bg-blue-200 rounded-t-md '>
              <button className='text-xl text-black' onClick={closeModal}><X size={28} strokeWidth={2.75} /></button>
            </div>
            <div className='p-2 text-black bg-slate-200 '> 
              <ModalHandler></ModalHandler>
            </div>
          </div>
        </div>
    )
}

export default Modal