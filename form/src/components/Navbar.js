import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className=' text-3xl flex  h-20 items-center bg-gray-200 w-auto' >
        <ul className='text-black font-bold flex flex-row gap-10 relative left-20 ' >
            <Link to='/sign-in'><li>Login</li></Link>
           <Link to='/sign-up'><li>SignUp</li></Link>
        </ul>
    </div>
  )
}
