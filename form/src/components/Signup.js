import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate()
  const [post, setPost] = useState({
    fname: "",
    lname: "",
    email: "",
    password: ""
  })
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");


  const handleChange = (event) => {
    const { name, value } = event.target
    setPost((prev) => {
      return { ...prev, [name]: value }
    })
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const url = "/api/users/register";
      const { data: res } = await axios.post(url, post);
      setMsg(res.message);
      console.log(post)
      navigate('/sign-in')
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };
  return (
    <div className="flex items-center justify-center">
    <form
      onSubmit={handleSubmit}
      className='flex flex-col text-2xl bg-gradient-to-r from-gray-400 to-gray-600 relative mb-4 p-10 rounded-lg shadow-lg  top-10'
      style={{ width: '80vh' }}
    >
      <h3 className='relative top-2 text-3xl font-bold m-2'>Sign Up</h3>

      <div className='flex flex-col m-2'>
        <label className='font-bold w-fit text-xl'>First name</label>
        <input
          className='w-full px-2 py-1 border rounded-lg'
          type="text"
          name='fname'
          value={post.fname}
          onChange={handleChange}
          placeholder="First name"
          required
        />
      </div>

      <div className='flex flex-col m-2'>
        <label className='font-bold w-fit text-xl'>Last name</label>
        <input
          className='w-full px-2 py-1 border rounded-lg'
          type="text"
          name='lname'
          value={post.lname}
          onChange={handleChange}
          placeholder="Last name"
          required
        />
      </div>

      <div className='flex flex-col m-2'>
        <label className='font-bold w-fit text-xl'>Email address</label>
        <input
          className='w-full px-2 py-1 border rounded-lg'
          type="email"
          name='email'
          value={post.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />
      </div>

      <div className='flex flex-col m-2'>
        <label className='font-bold w-fit text-xl'>Password</label>
        <input
          className='w-full px-2 py-1 border rounded-lg'
          type="password"
          name='password'
          value={post.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
        />
      </div>

      <div className='flex items-center justify-center w-100 m-3'>
        <button
          type="submit"
          className='rounded-lg text-2xl font-bold bg-green-400 w-60 text-center hover:bg-green-200 h-15'
        >
          Sign Up
        </button>
      </div>
      <p className='flex items-center justify-center gap-2 rounded-lg text-3xl font-bold bg-green-400 w-50 text-center hover:bg-green-200 h-10'>
        <a className='flex items-center justify-center' href="/sign-in">
          Already registered
        </a>
      </p>
      {error && <div>{error}</div>}
      {msg && <div>{msg}</div>}
    </form>
  </div>
);
}