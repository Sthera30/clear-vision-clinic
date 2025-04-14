import React, { useEffect, useState } from 'react'
import '../css/managementAppointment.css'
import { FaSearch } from 'react-icons/fa'
import { FaUserDoctor } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { IoMdTime } from "react-icons/io";
import { FaUser, FaHospital } from "react-icons/fa";
import { BsCalendarCheck } from "react-icons/bs";
import axios from 'axios'
import toast from 'react-hot-toast';
import { NavLink } from 'react-router-dom';


function ManageAppointment() {

    const [appointments, setAppointments] = useState([])
    const [searchTerm, setSearchTerm] = useState("");


    // Fetch doctors from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(
                    `https://clear-vision-clinic-backend.vercel.app/usersSearch?search=${searchTerm}`
                );
                setAppointments(response.data);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };

        fetchUsers();
    }, [searchTerm]); // Refetch doctors when search term changes





    return (
        <>

            <div className='management-appointment-container'>

                <div className='management-apointment-left'>

                    <h2>Appointment Management</h2>

                </div>


                <div className='management-apointment-right'>

                    <FaSearch style={{ fontWeight: 300 }} />
                    <input type='search' placeholder='Search appontments' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                </div>

            </div>

            <div className='box-conatiner'>

                {appointments.map((appointment, index) => (

                    <div className='box' key={index}>

                        <div className='box-content'>

                            <div className='box-content-left'>

                                <p><FaUserDoctor style={{ color: 'black', fontSize: '1.5rem' }} />&nbsp;&nbsp;Doctor Name: {appointment?.doctorname}</p>

                            </div>


                            <div className='box-content-right'>

                                <p>Appointment status:&nbsp;{appointment?.status === "Rejected" ? <span className='rejected'>{appointment?.status}</span> : appointment?.status === "Approved" ? <span className='approved'>{appointment?.status}</span> : <span className='approved'>{appointment?.status}</span>}</p>

                            </div>

                        </div>

                        <p><FaUser style={{ color: 'black', fontSize: '1.5rem' }} />&nbsp;&nbsp;User Name: {appointment?.username}</p>
                        <p><SlCalender style={{ color: 'black', fontSize: '1.5rem' }} />&nbsp;&nbsp;Appointment Date: {new Date(appointment?.appointmentdate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            weekday: 'long',
                            year: 'numeric'
                        })}</p>
                        <p><IoMdTime style={{ color: 'black', fontSize: '1.5rem' }} />&nbsp;&nbsp;Appointment Time: {appointment?.appointmenttime}</p>
                        <p><BsCalendarCheck style={{ color: 'black', fontSize: '1.5rem' }} />&nbsp;&nbsp;Appointment Type: {appointment?.appointmenttype}</p>
                        <p><FaHospital style={{ color: 'black', fontSize: '1.5rem' }} />&nbsp;&nbsp;Reason For Visit: {appointment?.reasonforvisit}</p>

                        <div className='button-edit'>

                            <NavLink to={`/edit-appointment-management/${appointment?.id}`} className='btnEdit'>Edit Appointment Status</NavLink>

                        </div>

                    </div>

                ))}

            </div>

        </>
    )
}

export default ManageAppointment
