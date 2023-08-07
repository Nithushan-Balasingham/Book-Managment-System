import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateUser() {
  const { id } = useParams();
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordModified, setIsPasswordModified] = useState(false); // New state to track password modification
  const navigate = useNavigate();

  useEffect(() => {
    const getUserById = async () => {
      const { data } = await axios.get(`/api/users/${id}`);
      setFname(data.fname);
      setLname(data.lname);
      setEmail(data.email);
      setPassword(data.password);
      setIsPasswordModified(false); // Reset the password modification state when data is fetched
      console.log(data);
    };
    getUserById();
  }, [id]);

  const updatehandleInput = async (e) => {
    e.preventDefault();

    const data = {
      fname: fname,
      lname: lname,
      email: email,
    };

    // Only include the password field if it's modified
    if (isPasswordModified) {
      data.password = password;
    }

    await axios.put(`/api/users/${id}`, data);
    navigate('/details');
  };

  console.log('fname:', fname);
  console.log('lname:', lname);
  console.log('email:', email);
  console.log('password:', password);

  return (
    <div className='flex flex-col items-center justify-center'>
    <h1 className='text-5xl font-bold bg-gradient-to-r from-green-100 to-green-400 text-transparent bg-clip-text'>Update User</h1>
    <div className='flex flex-col bg-gray-200 items-center justify-center border rounded-lg m-6 relative top-20 w-full max-w-md'>
      <form onSubmit={updatehandleInput} className='flex flex-col text-3xl m-6'>
        <input 
          className='w-64 px-2 py-1 border rounded-lg m-2' 
          type='text' 
          placeholder='Enter First Name' 
          onChange={(e) => setFname(e.target.value)} 
          value={fname} 
        />

        <input  
          className='w-64 px-2 py-1 border rounded-lg m-2' 
          type='text' 
          placeholder='Enter Last Name' 
          onChange={(e) => setLname(e.target.value)} 
          value={lname} 
        />

        <input  
          className='w-64 px-2 py-1 border rounded-lg m-2' 
          type='email' 
          placeholder='Enter Email' 
          onChange={(e) => setEmail(e.target.value)} 
          value={email} 
        />
        <input
          className='w-64 px-2 py-1 border rounded-lg m-2'
          type='password'
          placeholder='Enter Password'
          onChange={(e) => {
            setPassword(e.target.value);
            setIsPasswordModified(true); // Set the password modification state to true when the input changes
          }}
        />
        <div className='flex items-center justify-center'>
          <button className='rounded-lg text-2xl font-bold bg-gray-400 w-60 text-center flex items-center justify-center hover:bg-gray-600 h-15'>Update</button>
        </div>
      </form>
    </div>
  </div>
  );
}
