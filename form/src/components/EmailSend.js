import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { RecoveryContext } from "../App";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

export default function EmailSend () {
  const { email, otp, setPage } = useContext(RecoveryContext);
  const [timerCount, setTimer] = React.useState(10);
  const [OTPinput, setOTPinput] = useState([0, 0, 0, 0]);
  const [disable, setDisable] = useState(true);
    const navigate = useNavigate()
  function resendOTP() {
    if (disable) return;
    console.log(otp,email)
    axios
      .post("/api/users/send_recovery_email", {
        OTP: otp,
        email: email,

      })
      .then(() => setDisable(true))
      .then(() => alert("A new OTP has succesfully been sent to your email."))
      .then(() => setTimer(10))
      .catch(console.log);
    return resendOTP;
  }

  function verfiyOTP() {
    if (parseInt(OTPinput.join("")) === otp) {
      navigate(`/update/${email}`);
      return;
    }
    alert(
      "The code you have entered is not correct, try again or re-send the link"
    );
    return;
  }

  React.useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [disable]);
  return (
    <div className="flex relative top-[8rem] items-center justify-center" >
      <div className="bg-gray-600 flex flex-col rounded-3xl items-center justify-center w-full md:w-2/3 lg:w-1/2 xl:w-1/3 p-6">
        <div>
          <div className="flex  flex-col items-center justify-center">
            <div>
              <p className="text-5xl text-green-500">Email Verification</p>
            </div>
            <div className="flex items-center justify-center" >
              <p className="text-2xl text-center">We have sent a code to your email {email}</p>
            </div>
          </div>

          <div className="">
            <form>
              <div>
                <div className="flex items-center justify-center"> 
                  <div className="m-2">
                    <input
                      className="w-20 h-20 text-center"
                      maxLength="1"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) =>
                        setOTPinput([
                          e.target.value,
                          OTPinput[1],
                          OTPinput[2],
                          OTPinput[3],
                        ])
                      }
                    ></input>
                  </div>
                  <div className="m-2">
                    <input
                      className="w-20 h-20 text-center"
                      maxLength="1"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) =>
                        setOTPinput([
                          OTPinput[0],
                          e.target.value,
                          OTPinput[2],
                          OTPinput[3],
                        ])
                      }
                    ></input>
                  </div>
                  <div className="m-2">
                    <input
                      className="w-20 h-20 text-center"
                      maxLength="1"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) =>
                        setOTPinput([
                          OTPinput[0],
                          OTPinput[1],
                          e.target.value,
                          OTPinput[3],
                        ])
                      }
                    ></input>
                  </div>
                  <div className="m-2">
                    <input
                      className="w-20 h-20 text-center"
                      maxLength="1"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) =>
                        setOTPinput([
                          OTPinput[0],
                          OTPinput[1],
                          OTPinput[2],
                          e.target.value,
                        ])
                      }
                    ></input>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center">
                    <button  
                      className="rounded-lg text-2xl font-bold w-80 m-6 bg-green-400 text-center hover:bg-green-200 h-10" 
                      onClick={() => verfiyOTP()}>
                      Verify Account
                    </button>
                  </div>

                  <div className="flex items-center justify-center flex-col">
                    <p className="text-2xl text-red-500">Didn't recieve code?</p>{" "}
                    <a
                      style={{
                        color: disable ? "gray" : "blue",
                        cursor: disable ? "none" : "pointer",
                        textDecorationLine: disable ? "none" : "underline",
                      }}
                      onClick={() => resendOTP()}
                    >
                      {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
}


