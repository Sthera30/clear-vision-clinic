import React, { useState } from 'react'
import '../css/changePassword.css'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function ChangePassword() {

    const [data, setData] = useState({ password: '', confirmpassword: '' })

    const navigate = useNavigate()

    async function handle_submit(e) {

        e.preventDefault()

        const { password, confirmpassword } = data

        try {

            const res = await axios.put(`https://clear-vision-clinic-backend.vercel.app/changePassword`, { password, confirmpassword, email: localStorage.getItem("email") })

            if (res.data.success) {
                toast.success(res.data.message)
                localStorage.removeItem("email")
                navigate("/login")
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

            <div className='change-password-container'>

                <div className='change-password-inner'>

                    <form onSubmit={handle_submit}>

                        <div className='pass-heading'>

                            <h2>Reset Password</h2>
                            <p>Please enter your current and new password</p>

                        </div>

                        <label>New Password</label>
                        <input type="password" placeholder='Enter new password...' onChange={(e) => setData({ ...data, password: e.target.value })} />
                        <label>Confirm Password</label>
                        <input type="password" placeholder='Confirm password...' onChange={(e) => setData({ ...data, confirmpassword: e.target.value })} />
                        <button type='submit'>Update Password</button>

                    </form>

                </div>

            </div>

        </>
    )
}

export default ChangePassword
