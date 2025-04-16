import React, { useEffect, useState } from 'react'
import '../css/myAppointments.css'
import { MdCalendarMonth, MdMedicalServices } from 'react-icons/md'
import { FaPhone } from "react-icons/fa6";
import { FaCalendar, FaStethoscope } from "react-icons/fa";
import img1 from '../../public/team-1.jpg'
import { CiLocationOn } from "react-icons/ci";
import { BsCalendarDate } from "react-icons/bs";
import { IoMdTime } from "react-icons/io";
import axios from 'axios'
import toast from 'react-hot-toast';
import { useUserContext } from '../context/userContext.jsx';
import { NavLink } from 'react-router-dom';


function MyAppointments() {

    const [myAppointments, setMyAppointments] = useState([])
    const [doctorProfile, setDoctorProfile] = useState([])
    const { user, setUser } = useUserContext()


    async function handle_fetch() {

        try {

            if (!user?.fullname) return

            const res = await axios.get(`http://localhost:5000/myAppointments?username=${user.fullname}`)

            if (res.data.success) {
                setMyAppointments(res.data.data.appointments)
                console.log(res.data.data.appointments[0]);

                handle_fetch_doc_profile(res.data.data.appointments[0].doctorname)
            }

            else {
                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);
        }

    }

    async function handle_fetch_doc_profile(doctorname) {

        try {

            const res = await axios.get(`http://localhost:5000/doctorProfilePic?doctorname=${doctorname}`)

            if (res.data.success) {
                setDoctorProfile(res.data.data.doctor)
            }

            else {
                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);
        }
    }
    const handlePhoneCall = () => {
        const phoneNumber = "0412345549";
        window.location.href = `tel:${phoneNumber}`;
    };

    useEffect(() => {

        handle_fetch()

    }, [user])


    useEffect(() => {

        window.scrollTo(0, 0)

    }, [])


    return (
        <>

            {myAppointments ? <>

                {myAppointments.map((myAppointment, index) => (



                    < div className='my-appointments-container' key={index} >

                        <div className='my-appointments-inner'>

                            <h1>Your Upcoming Appointment</h1>
                            <p><MdCalendarMonth style={{ fontSize: '1.5rem' }} />&nbsp;{new Date(myAppointment.appointmentdate).toLocaleDateString('en-US', {
                                day: '2-digit',
                                weekday: 'long',
                                month: 'long',
                                year: 'numeric'
                            })}</p>

                        </div>

                        {myAppointment.status === "Rejected" ?
                            <div className='status-reject'>

                                <h2>Status:&nbsp;{myAppointment.status}</h2>

                            </div> : myAppointment.status === "Approved" ? <div className='status-check'>

                                <h2>Status:&nbsp;{myAppointment.status}</h2>

                            </div> : <div className='status-check'>

                                <h2>Status:&nbsp;{myAppointment.status}</h2>

                            </div>

                        }

                        <div className='appointment-details'>

                            <h1>Your Doctor</h1>

                            <div className='doc-details'>

                                {doctorProfile.map((doc, index) => (

                                    <>
                                        <div className='doc-left' key={index}>

                                            <img src={doc.profilepicture} alt="" />

                                        </div>

                                        <div className='doc-right'>

                                            <h2>{doc.doctorname}</h2>
                                            <p>{doc.doctorqualification}</p>

                                            <div className='button-co'>

                                                <button className='btnCall' onClick={handlePhoneCall}><FaPhone />&nbsp;Call</button>

                                            </div>

                                        </div>
                                    </>
                                ))}

                            </div>

                            <div className='user-appointment-details'>

                                <h3>Appointment Details</h3>

                                <div className='service-container'>

                                    <div className='service-icon'>

                                        <MdMedicalServices style={{ color: 'skyblue', fontSize: '2.2rem' }} />

                                    </div>


                                    <div className='service-content'>

                                        <h4>Reason For Visit</h4>

                                        <p>{myAppointment.reasonforvisit}</p>

                                    </div>

                                </div>

                                <div className='service-container'>

                                    <div className='service-icon'>

                                        <CiLocationOn style={{ color: 'skyblue', fontSize: '2.2rem' }} />

                                    </div>


                                    {doctorProfile.map((doc, index) => (

                                        <div className='service-content' key={index}>

                                            <h4>Location</h4>
                                            <p>{doc.doctoraddressline1}</p>

                                        </div>

                                    ))}

                                </div>

                                <div className='service-container'>

                                    <div className='service-icon'>

                                        <BsCalendarDate style={{ color: 'skyblue', fontSize: '2.2rem' }} />

                                    </div>


                                    <div className='service-content'>

                                        <h4>Appointment Date</h4>
                                        <p>{new Date(myAppointment.appointmentdate).toLocaleDateString('en-US', {
                                            day: '2-digit',
                                            weekday: 'long',
                                            month: 'long',
                                            year: 'numeric'
                                        })}</p>

                                    </div>

                                </div>

                                <div className='service-container'>

                                    <div className='service-icon'>

                                        <IoMdTime style={{ color: 'skyblue', fontSize: '2.2rem' }} />

                                    </div>


                                    <div className='service-content'>

                                        <h4>Appointment Time</h4>
                                        <p>{myAppointment.appointmenttime}</p>

                                    </div>

                                </div>

                                <div className='service-container'>

                                    <div className='service-icon'>

                                        <FaStethoscope style={{ color: 'skyblue', fontSize: '2.2rem' }} />

                                    </div>


                                    <div className='service-content'>

                                        <h4>Appointment Type</h4>
                                        <p>{myAppointment.appointmenttype}</p>

                                    </div>

                                </div>

                                {myAppointment.status === "Rejected" ? "" :
                                    <NavLink to={`/edit-appointment/${myAppointment.id}`} className='btnReschedule'>Reschedule Appointment</NavLink>
                                }

                                <div className='border-bottom-'>

                                </div>

                                {/* */}


                            </div>

                        </div>

                    </div >

                ))}


                <div className='check-ins-container'>

                    <div className='check-ins'>

                        <h4>Check-in Opens Soon</h4>
                        <p>You can check in 15 minutes before your appointment time</p>

                    </div>


                </div>


            </> : <>

                <div className='app-container'>

                    <div className='app-inner'>

                        <FaCalendar style={{ color: 'blue', fontSize: '5rem', padding: '1rem', borderRadius: '50%' }} />
                        <h3>No Appointments Yet</h3>
                        <p style={{ marginBottom: '2.5rem' }}>You don't have any scheduled appointments. Create your first appointment to get started.</p>

                        {user ? <>

                            <NavLink to={`/doctors/`} className='btnBook'>Book Appointment</NavLink>

                        </> : <>

                            <NavLink to={`/login/`} className='btnBook'>Book Appointment</NavLink>

                        </>

                        }

                    </div>

                </div>

            </>}


        </>
    )
}

export default MyAppointments






