import React, { useEffect, useState } from 'react'
import { HiOutlineMail } from "react-icons/hi";
import '../css/emailVerification.css'
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-hot-toast'

function EmailVerification() {

    const [data, setData] = useState({ email: '' })

    useEffect(() => {

        window.scrollTo(0, 0)

    }, [])

    const navigate = useNavigate()


    async function handle_submit(e) {

        e.preventDefault()

        const { email } = data

        try {

            const res = await axios.post(`https://clear-vision-clinic-backend.vercel.app/verifyEmail`, { email })

            if (res.data.success) {
                toast.success(res.data.message)
                localStorage.removeItem("email")
                localStorage.setItem('email', email)
                navigate("/verify-otp")
            }

            else {
                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);
        }

    }


    return (
        <>


            <div className='email-verification-container'>

                <div className='email-verification-inner'>

                    <form onSubmit={handle_submit}>

                        <div className='co-email'>

                            <HiOutlineMail className='email' />
                            <h2>Verify Your Email</h2>
                            <p>Please verify your email address to continue</p>

                        </div>

                        <label>Email Address</label>
                        <input type="email" name='email' placeholder='example@gmail.com' onChange={(e) => setData({ ...data, email: e.target.value })} />
                        <button type='submit' className='btnVerify'>Send Verification Code</button>

                    </form>

                </div>

            </div>

            <p className='support'>Having trouble? <NavLink to={"/contact-us"}>Contact Support</NavLink></p>


        </>
    )
}

export default EmailVerification
