import React, { useEffect, useState } from 'react'
import '../css/updateAppointmentManagement.css'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useUserContext } from '../context/userContext.jsx';

function UpdateAppointmentManagement() {

    const [data, setData] = useState({ status: '' })
    const [appoint, setAppoint] = useState("")

    const { user } = useUserContext()

    const { id } = useParams()

    const navigate = useNavigate()

    async function handle_submit(e) {

        e.preventDefault()

        if (!user?.email) {
            console.log("User email is not available yet!");
        }

        const { status } = data

        try {

            const res = await axios.put(`https://clear-vision-clinic-backend.vercel.app/updateUserAppointment`, { id, status, doctorname: appoint?.doctorname, appointmentdate: appoint?.appointmentdate, appointmenttime: appoint?.appointmenttime, appointmenttype: appoint?.appointmenttype, fullname: appoint?.username, email: user?.email })

            if (res.data.success) {
                toast.success(res.data.message)
                navigate("/management-appointment")
            }

            else {
                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);
        }

    }

    async function handle_fetch_appointment_by_id(id) {

        try {

            const res = await axios.get(`https://clear-vision-clinic-backend.vercel.app/getAppointmentById?id=${id}`)

            if (res.data.success) {
                setAppoint(res.data.data.appointment)
            }

            else {

                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {

        handle_fetch_appointment_by_id(id)

    }, [id])


    useEffect(() => {

        window.scrollTo(0, 0)

    },[])


    return (
        <div className='update-management-container'>

            <div className='update-management-inner'>

                <form onSubmit={handle_submit}>

                    <h1>Update Appointment Status</h1>

                    <div className='app-status'>

                        <label>Appointment Status:</label>

                        <select onChange={(e) => setData({ ...data, status: e.target.value })}>

                            <option>Approved</option>
                            <option>Rejected</option>

                        </select>

                    </div>

                    <button type='submit' className='btnEdit'>Update</button>


                </form>

            </div>


        </div>
    )
}

export default UpdateAppointmentManagement
