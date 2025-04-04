import React, { useEffect, useState } from 'react'
import '../css/appointment.css'
import img1 from '../../public/doctor-patient-ophthalmologist-s-office.jpg'
import { NavLink, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useUserContext } from '../context/userContext.jsx'

function Appointmenr() {

  const [data, setData] = useState("")
  const [doc, setDoc] = useState([])
  const [docTimeSlot, setDocTimeSlot] = useState([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [dataAppointment, setDataAppointment] = useState({ appointmentDate: '', appointmentTime: '', appointmentType: '', reasonForVisit: '' })

  const { user, setUser } = useUserContext()



  const { id } = useParams()

  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  async function handle_fetch_doc_by_id(id) {

    try {

      const res = await axios.get(`http://localhost:5000/getDoctorById?id=${id}`)

      if (res.data.success) {
        setData(res.data.data.doctor)
        handle_fetch_doctor_availibility_by_name(res.data.data.doctor.doctorName)
        handle_fetch_doc_time_slot(res.data.data.doctor.doctorName)
      }

      else {
        setData(res.data.error)
      }

    } catch (error) {
      console.log(error);

    }

  }

  async function handle_fetch_doctor_availibility_by_name(doctorName) {

    try {

      const res = await axios.get(`http://localhost:5000/getDoctorAvailabilityByName?doctorName=${doctorName}`)

      if (res.data.success) {
        setDoc(res.data.data.doctorAvailability);
      }

      else {
        toast.error(res.data.error)
      }

    } catch (error) {
      console.log(error);

    }

  }

  async function handle_fetch_doc_time_slot(doctorName) {

    try {

      const res = await axios.get(`http://localhost:5000/getDocAvailabilityTimeByDocName?doctorName=${doctorName}`)

      if (res.data.success) {
        setDocTimeSlot(res.data.data.docTimeSlot)
      }

      else {
        toast.error(res.data.error)
      }

    } catch (error) {
      console.log(error);

    }

  }


  async function handle_submit(e) {

    e.preventDefault()

    const { appointmentDate, appointmentTime, appointmentType, reasonForVisit } = dataAppointment

    try {

      const res = await axios.post('http://localhost:5000/addAppointment', { doctorName: data?.doctorName, userName: user?.fullName, email: user?.email, appointmentDate, appointmentTime, appointmentType, reasonForVisit })

      if (res.data.success) {
        toast.success(res.data.message)
      }

      else {
        toast.error(res.data.error)
      }

    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {

    handle_fetch_doc_by_id(id)
    window.scrollTo(0, 0)

  }, [id])


  return (
    <>

      <div className='appointment-container-'>

        <div className='appointment-left'>

          <img src={data?.profilePicture} alt="" />

        </div>

        <div className='appointment-right'>

          <h1>{data.doctorName}</h1>
          <p>Doctor qualification: <span>{data.doctorQualification}</span></p>
          <p>Doctor speciality: <span>{data.doctorSpeciality}</span></p>
          <p>Experience: <span>{data.doctorExperience}</span></p>
          <h2>About</h2>
          <p className='about'>{data.aboutDoctor}</p>
          <p>Doctor fee: <span>{`R${data.doctorFee}`}</span></p>

          <div className='booking-info'>

            <h1>Book an Appointment with {data.doctorName}</h1>
            <p>Select an available date and time slot below</p>

            <form onSubmit={handle_submit}>

              <div className='date-selecion'>

                <label>Select Date:</label>

                <select onChange={(e) => setDataAppointment({ ...dataAppointment, appointmentDate: e.target.value })}>

                  <option value="">Select a date</option> {/* Default placeholder */}

                  {doc
                    .filter(doctor_ => new Date(doctor_.date) >= new Date()) // Hide expired dates
                    .map((doctor_, index) => (
                      <option
                        key={index}
                        value={new Date(doctor_.date).toISOString().split('T')[0]}
                      >
                        {formatDate(doctor_.date)}
                      </option>
                    ))}

                </select>

              </div>

              <label>Available Time Slots:</label>

              <div className='button-time-slots'>


                <select onChange={(e) => setDataAppointment({ ...dataAppointment, appointmentTime: e.target.value })}>

                  {docTimeSlot.filter(docTimeSlots => docTimeSlots.timeSlot).map((docTimeSlots, index) => (
                    <option key={index}>{docTimeSlots.timeSlot}</option>
                  ))}

                </select>


              </div>



              <div className='date-selections'>

                <label>Appointment Type</label>
                <select onChange={(e) => setDataAppointment({ ...dataAppointment, appointmentType: e.target.value })}>

                  <option>Consultation</option>
                  <option>Follow-up</option>
                  <option>Surgery</option>

                </select>

                <label>Reason for visit:</label>
                <textarea onChange={(e) => setDataAppointment({ ...dataAppointment, reasonForVisit: e.target.value })} rows={10} cols={10} placeholder='brief description of the patients concern...'></textarea>

              </div>

              {user ? <>

                <button type='submit' className='btnBook'>Book appointment</button>

              </> : <>

                <NavLink to={"/login"} className='btnBook'>Book appointment</NavLink>

              </>}


            </form>

          </div>

        </div>

      </div>


      <div className='appointment-co'>

        <div className='appointment-inner'>

          <h2>Appointment Information</h2>
          <p>Please arrive 15 minutes before your scheduled appointment time.</p>
          <p>Bring your insurance card and ID.</p>
          <p>Cancellations must be made at least 24 hours in advance.</p>
          <p>For any questions, please call our office at (+27) 41 236 9490 </p>

        </div>

      </div>

    </>
  )
}

export default Appointmenr
