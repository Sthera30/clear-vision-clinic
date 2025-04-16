import React, { useEffect, useState } from 'react'
import '../css/editMyProfile.css'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useUserContext } from '../context/userContext.jsx'

function EditMyProfile() {

    const [data, setData] = useState({ fullname: '', lastname: '', email: '', telno: '', addressline1: '', addressline2: '', gender: '', role: '', dob: '' })

    const { id } = useParams()

    const {user, setUser} = useUserContext()

    const navigate = useNavigate()

    async function handle_fetch_user_info_by_id(id) {

        try {

            const res = await axios.get(`https://clear-vision-clinic-backend.vercel.app/getUserInfoById?id=${id}`)

            if (res.data.success) {
                setData(res.data.data.userInfo)
            }

            else {
                toast.success(res.data.error)
            }

        } catch (error) {
            console.log(error);
        }

    }

    async function handle_submit(e) {

        e.preventDefault()

        const { fullname, lastname, email, telno, addressline1, addressline2, gender, role, dob } = data

        try {

            const res = await axios.put(`https://clear-vision-clinic-backend.vercel.app/updateUserProfile`, { id, fullname, lastname, email, telno, addressline1, addressline2, gender, role, dob })


            if (res.data.success) {
                toast.success(res.data.message)

                // Update user context so MyProfile gets updated immediately
                setUser(prevUser => ({
                    ...prevUser,
                    fullname,
                    lastname,
                    email,
                    telno,
                    addressline1,
                    addressline2,
                    gender,
                    role,
                    dob
                }));

                navigate("/my-profile")
            }

            else {

                toast.error(res.data.error)

            }

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {

        handle_fetch_user_info_by_id(id)

    }, [id])

    return (
        <>

            <div className='edit-my-profile-page-container'>

                <h1>Edit My Profile</h1>

            </div>


            <div className='edit-my-profile-page-inner'>

                <div className='edit-my-profile-inner'>


                    <form onSubmit={handle_submit}>

                        <h1>Update My Profile</h1>

                        <label>FullName</label>
                        <input type='text' value={data.fullname} placeholder='Enter your full name' onChange={(e) => setData({ ...data, fullname: e.target.value })} />

                        <label>LastName</label>
                        <input type='text' value={data.lastname} placeholder='Enter your last name' onChange={(e) => setData({ ...data, lastname: e.target.value })} />

                        <label>Email</label>
                        <input type='email' value={data.email} placeholder='Enter your email' onChange={(e) => setData({ ...data, email: e.target.value })} />

                        <label>telNo</label>
                        <input type='text' value={data.telno} placeholder='Enter your tel no' onChange={(e) => setData({ ...data, telno: e.target.value })} />

                        <label>AddressLine1</label>
                        <input type='text' value={data.addressline1} placeholder='Enter your address line 1' onChange={(e) => setData({ ...data, addressline1: e.target.value })} />

                        <label>AddressLine2</label>
                        <input type='text' value={data.addressline2} placeholder='Enter your address line 2' onChange={(e) => setData({ ...data, addressline2: e.target.value })} />

                        <label>Gender</label>
                        <input type='text' value={data.gender} placeholder='Enter your gender' onChange={(e) => setData({ ...data, gender: e.target.value })} />

                        <label>Role</label>
                        <input type='text' value={data.role} placeholder='Enter your role' onChange={(e) => setData({ ...data, role: e.target.value })} />

                        <label>DOB</label>
                        <input type='text' value={data.dob} placeholder='Enter your date of birth' onChange={(e) => setData({ ...data, dob: e.target.value })} />

                        <div className='button-container--'>

                            <NavLink to={"/my-profile"} className='btnCancel'>Cancel</NavLink>

                            <button type='submit' className='btnSave'>Save changes</button>


                        </div>


                    </form>

                </div>


            </div>


        </>
    )
}

export default EditMyProfile
