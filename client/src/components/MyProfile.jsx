import React, { useEffect, useState } from 'react'
import '../css/myProfile.css'
import { useUserContext } from '../context/userContext.jsx'
import axios from 'axios'
import toast from 'react-hot-toast'
import { NavLink } from 'react-router-dom'

function MyProfile() {


    const [userInfo, setUserInfo] = useState("")
    const { user } = useUserContext()


    async function handle_fetch_user_info_by_email() {

        if (!user?.email) {
            return
        }


        try {

            const res = await axios.get(`http://localhost:5000/getUserInfoByEmail?email=${user.email}`)

            if (res.data.success) {
                setUserInfo(res.data.data.userEmail);
            }

            else {

                toast.error(res.data.error)

            }

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {

        if (user) {
            handle_fetch_user_info_by_email()
        }

    }, [user])

    useEffect(() => {

        window.scrollTo(0, 0)

    }, [])

    return (
        <>

            <div className='my-profile-container'>

                <div className='my-profile-inner'>

                    <span>
                        {userInfo?.fullName?.charAt(0).toUpperCase()}{userInfo?.lastName?.charAt(0).toUpperCase()}
                    </span>
                    <p>{userInfo?.fullName + " " + userInfo?.lastName}</p>
                    {user?.role === "user" ? <p style={{paddingBottom: '1rem'}}>patient</p> : user?.role === "admin" ? <p style={{paddingBottom: '1rem'}}>admin</p> : <p>doctor</p>}
                    <div className='button-edit-profile'>

                        <NavLink to={`/edit-profile/${userInfo.id}`} className='btnEditProfile'>Edit</NavLink>

                    </div>

                </div>

            </div>

            <div className='my-profile-container-outside'>

                <h1>Personal Info</h1>

                <div className='my-profile-container-'>

                    <label>First Name</label>
                    <input type='text' value={user?.fullName} disabled />

                    <label>Last Name</label>
                    <input type='text' value={user?.lastName} disabled />

                    <label>Email</label>
                    <input type='text' value={user?.email} disabled />

                    <label>Tel No</label>
                    <input type='text' value={user?.telNo} disabled />

                    <label>AddressLine 1</label>
                    <input type='text' value={user?.addressLine1} disabled />

                    <label>AddressLine 2</label>
                    <input type='text' value={user?.addressLine2} disabled />

                    <label>Gender</label>
                    <input type='text' value={user?.gender} disabled />

                    <label>Date of Birth</label>
                    <input type='text' value={user?.dob} disabled />

                </div>


            </div>

        </>
    )
}

export default MyProfile
