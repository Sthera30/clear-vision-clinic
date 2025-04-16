import React, { useEffect, useState } from 'react'
import '../css/admin.css'
import { FaUser, FaCalendar } from 'react-icons/fa'
import { FaUserGroup } from 'react-icons/fa6'
import { TrendingUp } from 'lucide-react'
import axios from 'axios'

function Admin() {


    const [doctor, setDoctor] = useState([])
    const [appoint, setAppoint] = useState([])
    const [user, setUser] = useState([])



    async function handle_fetch_doctor_info() {

        try {

            const res = await axios.get("https://clear-vision-clinic-backend.vercel.app/getAllDoctor")

            if (res.data.success) {
                setDoctor(res.data.data.doctors)
            }

            else {
                setDoctor(res.data.error)
            }

        } catch (error) {
            console.log(error);
        }

    }


    async function handle_fetch_appointment() {

        try {

            const res = await axios.get("https://clear-vision-clinic-backend.vercel.app/getAllAppointments")

            if (res.data.success) {
                setAppoint(res.data.data.appointment)
            }

            else {
                setAppoint(res.data.error)
            }

        } catch (error) {
            console.log(error);
        }

    }


    async function handle_fetch_users() {

        try {

            const res = await axios.get("https://clear-vision-clinic-backend.vercel.app/getAllUsers")

            if (res.data.success) {
                setUser(res.data.data.users)
            }

            else {
                setUser(res.data.error)
            }

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {

        handle_fetch_doctor_info()
        handle_fetch_appointment()
        handle_fetch_users()
        window.scrollTo(0, 0)

    }, [])



    return (

        <>

            <div className='admin-heading'>

                <h1>Admin <span style={{ color: 'skyblue' }}>Dashboard</span></h1>

            </div>

            <div className='admin-container'>


                <div className='admin-box'>


                    <div className='tending-container'>

                        <div className='trending-left'>

                            <FaUser style={{ color: 'blue', fontSize: '2.5rem' }} />

                        </div>

                        <div className='trending-right'>

                            <TrendingUp style={{ color: 'green', fontSize: '3rem' }} />

                        </div>

                    </div>

                    <p style={{ marginBottom: '-.8rem', fontWeight: '800' }}>Total Doctors</p>
                    <p style={{ color: '#333', fontSize: '2.5rem', fontWeight: '800' }}>{doctor.length}</p>

                </div>


                <div className='admin-box'>


                    <div className='tending-container'>

                        <div className='trending-left'>

                            <FaCalendar style={{ color: 'green', fontSize: '2.5rem' }} />

                        </div>

                        <div className='trending-right'>

                            <TrendingUp style={{ color: 'green', fontSize: '3rem' }} />

                        </div>

                    </div>

                    <p style={{ marginBottom: '-.8rem', fontWeight: '800' }}>Total Appointments</p>
                    <p style={{ color: '#333', fontSize: '2.5rem', fontWeight: '800' }}>{appoint.length}</p>

                </div>


                <div className='admin-box'>


                    <div className='tending-container'>

                        <div className='trending-left'>

                            <FaUserGroup style={{ color: 'purple', fontSize: '2.5rem' }} />

                        </div>

                        <div className='trending-right'>

                            <TrendingUp style={{ color: 'green', fontSize: '3rem' }} />

                        </div>

                    </div>

                    <p style={{ marginBottom: '-.8rem', fontWeight: '800' }}>Total Patients</p>
                    <p style={{ color: '#333', fontSize: '2.5rem', fontWeight: '800' }}>{user.filter((u) => u.role === 'user').length}</p>

                </div>


            </div>

        </>



    )
}

export default Admin
