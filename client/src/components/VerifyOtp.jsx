import React, { useState } from 'react'
import { HiOutlineMail } from "react-icons/hi";
import { FaRegEye } from "react-icons/fa";
import '../css/verifyOtp.css'
import axios from 'axios'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function VerifyOtp() {

  const [data, setData] = useState({ otp: '' })

  const navigate = useNavigate()

  async function handle_submit(e) {

    e.preventDefault()

    const { otp } = data

    try {


      const res = await axios.post(`https://clear-vision-clinic-backend.vercel.app/verifyOtp`, { otp, email: localStorage.getItem("email") })

      if (res.data.success) {
        toast.success(res.data.message)
        navigate("/change-password")
      }

      else {
        toast.error(res.data.error)
      }

    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div className='email-verification-container'>

      <div className='email-verification-inner'>

        <form onSubmit={handle_submit}>

          <div className='co-email'>

            <FaRegEye className='email' />
            <h2>OTP Verification</h2>
            <p>We've sent a 6-digit verification code to your email</p>

          </div>

          <label>Enter Verification Code</label>
          <input type="number" onChange={(e) => setData({ ...data, otp: e.target.value })} />
          <button type='submit' className='btnVerify'>Verify Code</button>

        </form>

      </div>

    </div>
  )
}

export default VerifyOtp
