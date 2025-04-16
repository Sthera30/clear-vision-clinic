import React, { useEffect, useState } from 'react'
import '../css/registration.css'
import { NavLink, useNavigate } from 'react-router-dom'
import imgAvator from '../../public/avator.png'
import axios from 'axios'
import {toast} from'react-hot-toast'

function Registration() {


    const [image, setImage] = useState({})
    const [upload, setUploading] = useState(false)
    const [data, setData] = useState({profilepicture: '', fullname: '', lastname: '', email: '', telno: '', addressline1: '', addressline2: '', gender: '', role: '', dob: '', password: '', confirmpassword: ''})


    const navuigate = useNavigate()

    useEffect(() => {

        window.scrollTo(0, 0)

    }, [])


    async function handle_change(e) {

        const file = e.target.files[0]
        const formData = new FormData()
        formData.append("image", file)

        setUploading(true)

        try {

            const { data } = await axios.post("http://localhost:5000/upload", formData)

            setUploading(false)

            setImage({
                url: data.url,
                public_id: data.public_id
            })

            setData(prevData => ({ ...prevData, profilepicture: data.url }))

        } catch (error) {
            console.log(error);

        }

    }

    async function handle_submit(e) {
        

        e.preventDefault()

        const {profilepicture, fullname, lastname, email, telno, addressline1, addressline2, gender, role, dob, password, confirmpassword} = data

        try {

            const res = await axios.post("http://localhost:5000/register", {profilepicture, fullname, lastname, email, telno, addressline1, addressline2, gender, role, dob, password, confirmpassword})

            if(res.data.success){
                toast.success(res.data.message)
                navuigate("/login")
            }

            else{
                toast.error(res.data.error)
            }
            
        } catch (error) {
            console.log(error);
            
        }

    }

    return (
        <>

            <div className='registration_page_container'>

                <div className='registration_inner_container'>

                    <form onSubmit={handle_submit}>

                        <h1>Create Account</h1>
                        <p>Please register to book an appointment!</p>


                        <div className='profile-co'>

                            <label htmlFor="image-upload">

                                <img src={image?.url || imgAvator} alt="" style={{ width: '5rem', height: '5rem', objectFit: 'contain', cursor: 'pointer', borderRadius: '50%' }} />

                            </label>

                            <span>Your Profile</span>
                            <input type="file" accept='image/*' id='image-upload' style={{ display: 'none' }} onChange={handle_change} />

                        </div>
                        <label>Full Name</label>
                        <input type='text' name='name' placeholder='Please enter your full name' onChange={(e) => setData({...data, fullname: e.target.value})} />
                        <label>Last Name</label>
                        <input type='text' name='lastname' placeholder='Please enter your last name' onChange={(e) => setData({...data, lastname: e.target.value})} />
                        <label>Email Address</label>
                        <input type='email' name='email' placeholder='Please enter your email address' onChange={(e) => setData({...data, email: e.target.value}) } />
                        <label>Tel No:</label>
                        <input type='tel' name='telephone' minLength={10} maxLength={10} pattern='^0[0-9]{9}$' placeholder='Please enter your telephon number' onChange={(e) => setData({...data, telno: e.target.value})} />
                        <label>Address Line 1:</label>
                        <input type='text' name='address' placeholder='Please enter your address line 1' onChange={(e) => setData({...data, addressline1: e.target.value})} />
                        <label>Address Line 2: &nbsp; <span style={{ color: 'red' }}>optional</span></label>
                        <input type='text' name='address' placeholder='Please enter your address line 2' onChange={(e) => setData({...data, addressline2: e.target.value})} />
                        <label>Gender</label>
                        <select onChange={(e) => setData({...data, gender: e.target.value})}>

                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>

                        </select>
                        <label>Date Of Birth</label>
                        <input type="date" name='dob' onChange={(e) => setData({...data, dob: e.target.value})} />
                        <label>Password</label>
                        <input type="password" name='password' placeholder='Enter your password' onChange={(e) => setData({...data, password: e.target.value})} />
                        <label>Confirm Password</label>
                        <input type="password" name='password' placeholder='Please confirm your password' onChange={(e) => setData({...data, confirmpassword:e.target.value})} />
                        <button className='btnRegister'>Register</button>
                        <p>Already have an account? <NavLink to={'/login/'} style={{ color: 'blue' }}>Click here</NavLink></p>

                    </form>

                </div>

            </div>

        </>
    )
}

export default Registration
