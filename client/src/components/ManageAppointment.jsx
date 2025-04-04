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
                    `http://localhost:5000/usersSearch?search=${searchTerm}`
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

                                <p><FaUserDoctor style={{ color: 'black', fontSize: '1.5rem' }} />&nbsp;&nbsp;Doctor Name: {appointment?.doctorName}</p>

                            </div>


                            <div className='box-content-right'>

                                <p>Appointment status:&nbsp;{appointment?.Status === "Rejected" ? <span className='rejected'>{appointment?.Status}</span> : appointment?.Status === "Approved" ? <span className='approved'>{appointment?.Status}</span> : <span className='approved'>{appointment?.Status}</span>}</p>

                            </div>

                        </div>

                        <p><FaUser style={{ color: 'black', fontSize: '1.5rem' }} />&nbsp;&nbsp;User Name: {appointment?.userName}</p>
                        <p><SlCalender style={{ color: 'black', fontSize: '1.5rem' }} />&nbsp;&nbsp;Appointment Date: {new Date(appointment?.appointmentDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            weekday: 'long',
                            year: 'numeric'
                        })}</p>
                        <p><IoMdTime style={{ color: 'black', fontSize: '1.5rem' }} />&nbsp;&nbsp;Appointment Time: {appointment?.appointmentTime}</p>
                        <p><BsCalendarCheck style={{ color: 'black', fontSize: '1.5rem' }} />&nbsp;&nbsp;Appointment Type: {appointment?.appointmentType}</p>
                        <p><FaHospital style={{ color: 'black', fontSize: '1.5rem' }} />&nbsp;&nbsp;Reason For Visit: {appointment?.reasonForVisit}</p>

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
