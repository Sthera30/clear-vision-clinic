import React, { useEffect, useState } from 'react'
import '../css/login.css'
import { FaEye } from 'react-icons/fa'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useUserContext } from '../context/userContext'

function Login() {


    const [data, setData] = useState({ email: '', password: '' })
    const { user, setUser } = useUserContext()

    const navigate = useNavigate()

    async function handle_submit(e) {

        e.preventDefault()

        const { email, password } = data

        try {
            //SEND COOKIES
            const res = await axios.post("https://clear-vision-clinic-backend.vercel.app/login", { email, password }, { withCredentials: true })

            if (res.data.error) {
                toast.error(res.data.error)
            }

            else {

                toast.success(res.data.message)

                const res2 = await axios.get(`https://clear-vision-clinic-backend.vercel.app/getUser`, { withCredentials: true })

                console.log(res2.data);


                if (res2.data.success) {
                    setUser(res2.data.data.user)
                    console.log("Hello");

                }

                else {
                    setUser(null)
                    console.log("Nope");

                }

            }

        } catch (error) {
            console.log(error);
        }

    }


    useEffect(() => {

        window.scrollTo(0, 0)

    }, [])

    return (

        <>

            <div className='login-container'>

                <div className='login-inner-container'>


                    <form onSubmit={handle_submit}>

                        <div className='login-info-details'>

                            <FaEye style={{ color: 'skyblue', fontSize: '2.5rem' }} />
                            <h1 style={{ fontWeight: '300' }}>Login</h1>
                            <p>Please login to book an appointment</p>

                        </div>

                        <div className='login-info'>

                            <label>Email</label>
                            <input type="email" name='email' placeholder='Please enter your email address' onChange={(e) => setData({ ...data, email: e.target.value })} />
                            <label>Password</label>
                            <input type="password" placeholder='Please enter your password' onChange={(e) => setData({ ...data, password: e.target.value })} />

                            <div className='login-'>

                                <a href="#"></a>
                                <NavLink to={"/email-verification/"}>Forgot password?</NavLink>

                            </div>

                            <button type='submit' className='btnLogin'>Login</button>
                            <p>Don't have an account? <NavLink to={"/registration/"} style={{ color: 'blue' }}>Click here</NavLink></p>

                        </div>

                    </form>

                </div>

            </div>

        </>
    )
}

export default Login
