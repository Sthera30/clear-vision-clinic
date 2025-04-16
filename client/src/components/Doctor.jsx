import React, { useEffect, useState } from 'react'
import '../css/doctor.css'
import img1 from '../../public/team-1.jpg'
import img2 from '../../public/team-2.jpg'
import img3 from '../../public/team-4.jpg'
import axios from 'axios'
import { NavLink } from 'react-router-dom'

function Doctor() {


    const [doctor, setDoctor] = useState([])


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

    useEffect(() => {

        handle_fetch_doctor_info()
        window.scrollTo(0, 0)

    }, [])

    return (
        <>



{/* THE BOOKING BUTTON MUST CHECK IF A USER IS LOGGED IN OR NOT  */}



            <div className='doc-heading'>

                <h1>Meet Our <span>Doctors</span></h1>
                <p>Our team of experienced ophthalmologists and optometrists are dedicated to providing exceptional eye care with compassion and expertise.</p>

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

export default Doctor
