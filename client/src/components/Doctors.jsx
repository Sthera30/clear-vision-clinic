import React, { useEffect, useState } from 'react'
import '../css/doctors.css'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { FaCalendar } from 'react-icons/fa'

function Doctors() {


    const [doctor, setDoctor] = useState([])


    async function handle_fetch_doctor_info() {

        try {

            const res = await axios.get("http://localhost:5000/getAllDoctor")

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

    useEffect(() => {

        handle_fetch_doctor_info()
        window.scrollTo(0, 0)

    }, [])

    return (
        <>


            {/* THE BOOKING BUTTON MUST CHECK IF A USER IS LOGGED IN OR NOT  */}



            <div className='doc-container-'>

                <div className='doc-container-inner-'>

                    <FaCalendar style={{ color: '#fff', fontSize: '4rem', background: 'lightskyblue', padding: '1.2rem', borderRadius: '50%', cursor: 'pointer' }} />
                    <h3 style={{ color: '#333', fontSize: '2rem' }}>Select a Specialist for Your Appointment</h3>
                    <p>Choose from our team of qualified healthcare professionals below and book your consultation with just a few clicks.</p>

                </div>

            </div>

            <div className='doc-container'>

                {doctor.map((doc, index) => (

                    <div className='doc-box' key={index}>

                        <img src={doc.profilepicture} alt="" />

                        <div className='content'>

                            <h1>{doc.doctorname}
                            </h1>
                            <p>{doc.qualification}</p>
                            <p>{doc.aboutdoctor}</p>


                            <div className='button-container'>

                                <NavLink to={`/appointment/${doc.id}`} className='btnBiography'>Full Biography</NavLink>
                                <NavLink to={`/appointment/${doc.id}`} className='btnSchedule'>Schedule Appointment</NavLink>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </>
    )
}

export default Doctors
