import React from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { RecoveryContext } from '../App';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const { setEmail, setPage, email, setOTP } = useContext(RecoveryContext);
  const navigate = useNavigate();

  const navigateTop = () => {
    if (email) {
      const OTP = Math.floor(Math.random() * 9000 + 1000);
      console.log(OTP);
      setOTP(OTP);
      axios
        .post('/api/users/send_recovery_email', {
          OTP,
          email,
        })
        .then(() => navigate('/otp'))
        .catch(console.log);
      return;
    }
    return alert('Enter Your Email');
  };

  return (
    <div className="flex items-center justify-center flex-col mt-20 w-full">
    <div>
      <h1 className="text-4xl font-bold text-white">Reset Password</h1>
    </div>
    <div className="flex flex-col text-2xl bg-gradient-to-r from-gray-400 to-gray-600 mt-4 p-10 rounded-lg shadow-lg items-center justify-center w-full md:w-2/3 lg:w-1/2 xl:w-1/4">
      <div className="mb-3 flex flex-col relative">
        <label className="">
          <strong>Email</strong>
        </label>
        <input
          className="w-150 px-2 py-1 border rounded-lg"
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button
        className="rounded-lg text-2xl font-bold bg-green-400 w-60 text-center hover:bg-green-200 h-15"
        type="submit"
        onClick={navigateTop}
      >
        RESET
      </button>
    </div>
  </div>
);
}

