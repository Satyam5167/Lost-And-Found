import React from 'react'
import Logo from "../assets/mainlogo.png"
import { useNavigate } from 'react-router-dom'
import handleLogout from './logout'; 


const Navbar = () => {
  const navigate=useNavigate();
  return (
    <div className='m-0 p-4 px-8 overflow-x-hidden bg-black flex justify-between '>
      <div className='hover:shadow-yellow-glow'>
        <img src={Logo} className='h-16 rounded-2xl ' onClick={()=>navigate("/home")}/>
        </div>
      <div className='text-yellow-400 flex gap-5 text-xl'>
        <a href='/home' className='hover:text-yellow-200 hover:border-b-2 hover:border-yellow-200 cursor-pointer'>Home</a>
        <a href='post-item' className='hover:text-yellow-200 hover:border-b-2 hover:border-yellow-200 cursor-pointer'>Post item</a>
        <a href='/dashboard' className='hover:text-yellow-200 hover:border-b-2 hover:border-yellow-200 cursor-pointer'>Find item</a>
        <a href='#' className='hover:text-yellow-200 hover:border-b-2 hover:border-yellow-200 cursor-pointer'>About us</a>
        <a
          href='#'
          onClick={handleLogout}
          className='hover:text-yellow-200 hover:border-b-2 hover:border-yellow-200 cursor-pointer'
        >
          Logout
        </a>
      </div>
    </div>
  )
}

export default Navbar
