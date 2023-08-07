import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const isAdmin = window.localStorage.getItem('Permission')

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/login', {
        email: email,
        password: password,
      });
      console.log('Login successful:', response.data.accessToken);
      console.log( response.data.ad);
      console.log(response.data.uid)
      alert('Logged in Successfully');
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('loggedIn', true);
      localStorage.setItem('Permission', response.data.ad);
      localStorage.setItem('IdOf', response.data.uid);

      navigate('/details');
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };
  const clearError =()=>{
    setError('')
  }
  useEffect(()=>{
    const timer = setTimeout(()=>{
      clearError()
    },2000)
  },[error])

  console.log("Password",password)

  return (
    <div className="flex items-center justify-center  ">
      <div className=' bg-gradient-to-r from-gray-600 to-gray-400 w-fit h-96 m-5 rounded-lg relative top-20'>
    <form onSubmit={handleSubmit} 
        className='flex flex-col text-2xl  top-[1rem] relative p-auto rounded-lg'>
      <div className='flex flex-col m-3'>
        <label className='m-2 font-bold w-fit'>Email address</label>
        <input
          className='w-250 px-4 py-2 border rounded-lg'
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className='flex flex-col m-3'>
        <label className='m-2 font-bold w-fit'>Password</label>
        <input
          className='w-250 px-4 py-2 border rounded-lg'
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <div className='text-red-500 font-bold'>{error}</div>}

      <div className='flex items-center justify-center w-100 m-6'>
        <button 
          type="submit" 
          className='  rounded-lg text-2xl font-bold bg-gradient-to-r from-gray-400 to-green-200 w-60 text-center  hover:bg-green-200' 
        >
          Submit
        </button>
      </div>
      <div className='flex items-center justify-center'>
      <p className=' flex items-center justify-center  gap-2 rounded-lg text-2xl font-bold bg-green-400 w-fit text-center  hover:bg-green-200 h-fit'>
        <Link className='flex items-center justify-center' to='/reset' >Forgot  password?</Link>
      </p>
      </div>
      
    </form>
    </div>
    </div>
  );
}
