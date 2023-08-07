import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UpdatePasswordForm() {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { email } = useParams();
  const navigate = useNavigate()

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email.................................",email);
    console.log(password)

    axios
      .put(`/api/users/update-password/${email}`, { password: password })
      .then((response) => {
        const { type, msg } = response.data;
        setMessage({ type, msg });
        navigate('/')
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <h2 className='sm:text-xs md:text-2xl lg:text-4xl text-green-400 m-4'>UPDATE PASSWORD</h2>

      <h2 className='sm:text-xs md:text-2xl lg:text-4xl text-green-400'>{email}</h2>

      <div className='flex flex-col items-center w-full sm:w-full md:w-2/3 lg:w-1/2 xl:w-1/2'>
        <label className='text-2xl text-white bg-slate-600 m-2 whitespace-nowrap'>
          Enter the New Password:
        </label>
        <input
          className='rounded-lg m-3 w-fit px-4 py-2'
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <button
          type="submit"
          className='rounded-lg text-2xl font-bold bg-green-400 w-fit sm:w-60 text-center hover:bg-green-200 h-15 px-6 py-2'
        >
          Update Password
        </button>
      </div>
      {message && (
        <div className={`message ${message.type}`}>
          {message.msg}
        </div>
      )}
    </div>
  );
}

export default UpdatePasswordForm;
