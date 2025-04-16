import React, { useEffect, useState } from 'react'
import img1 from '../../public/woman-getting-her-eyes-checked.jpg'
import '../css/aboutUs.css'
import axios from 'axios'
import toast from 'react-hot-toast'
import { NavLink } from 'react-router-dom'

function AboutUs() {


  const [doc, setDoc] = useState([])


  async function handle_fetch() {

    try {

      const res = await axios.get("https://clear-vision-clinic-backend.vercel.app/getAllDoctor")

      if (res.data.success) {
        setDoc(res.data.data.doctors)
      }

      else {
        toast.error(res.data.error)
      }

    } catch (error) {
      console.log(error);
    }

  }


  useEffect(() => {

    handle_fetch()
    window.scrollTo(0, 0)

  }, [])

  return (

    <>


      <div className='about-us-heading'>

        <h2 style={{ marginTop: '12rem' }}>ABOUT&nbsp;<span>US</span></h2>

      </div>


      <div className='about-us-container'>


        <div className='about-us-right'>

          <img src={img1} alt="Woman getting here eyes checked" />

        </div>

        <div className='about-us-left'>

          <h1>Expert Eye Care with a Personal Touch</h1>

          <p>Clear Vision Clinic has been providing exceptional eye care services to our community since 2005. Our team of highly skilled optometrists and ophthalmologists combine their expertise with state-of-the-art technology to deliver comprehensive eye examinations and personalized treatment plans. We believe that everyone deserves clear vision and healthy eyes. Our mission is to provide accessible, high-quality eye care in a comfortable and friendly environment. We take the time to understand your unique visual needs and develop tailored solutions that enhance your quality of life.</p>

        </div>

      </div>


      <div className='about-us-content'>

        <h1>Our Journey</h1>
        <p>What began as a small practice with just two optometrists has grown into a comprehensive eye care center serving thousands of patients throughout the region. Dr. Sandy Chen and Dr. Michael Chen founded Clear Vision Clinic with a simple goal: to combine clinical excellence with compassionate care. Today, our expanded team continues to uphold these founding principles while embracing the latest advancements in eye care technology.</p>

        <h1>Our Approach</h1>
        <p>At Clear Vision Clinic, we take a holistic approach to eye health. We understand that your eyes are connected to your overall wellness, which is why we:</p>

        <ul>

          <li>conduct thorough examinations that look beyond vision correction</li>
          <li>Take the time to explain our findings and recommendations</li>
          <li>Create personalized treatment plans based on your lifestyle needs</li>
          <li>Provide ongoing education about maintaining eye health</li>
          <li>Offer flexible scheduling to accommodate your busy life</li>

        </ul>

      </div>

      <div className='meet-our-doctors'>

        <div className='meet-our-doctor-inner'>

          <h1>Meet our <span>team</span></h1>
          <h2>Our Doctors</h2>

        </div>

      </div>

      <div className='doc-container'>

        {doc.map((doctor, index) => (


          <div className='doc-box' key={index}>

            <img src={doctor.profilepicture} alt="" />

            <div className='doc-content'>

              <h2>{doctor.doctorname}</h2>
              <p>
                {doctor.aboutdoctor}
              </p>

              <div className='button-container'>

                <NavLink to={`/appointment/${doctor.id}`} className='btnBiography'>Full Biography</NavLink>
                <NavLink to={`/appointment/${doctor.id}`} className='btnAppointment'>Schedule Appointment</NavLink>

              </div>

            </div>

          </div>


        ))}

      </div>

    </>

  )
}

export default AboutUs
