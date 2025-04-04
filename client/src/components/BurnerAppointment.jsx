import React from 'react'
import '../css/burnerAppointment.css'
import { NavLink } from 'react-router-dom'

function BurnerAppointment() {
    return (
        <div className='burner-appointment-container'>

            <div className='burner-appointment-inner'>

                <h1>Ready to Experience Clear Vision?</h1>
                <p>Schedule your comprehensive eye exam today and take the first step toward optimal eye health and crystal-clear vision.</p>

                <div className='appointment-button-container'>

                    <NavLink to={"/doctors"} className='btnSchedule'>Schedule an Appointment</NavLink>
                    <NavLink to={"/contact-us"} className='btnContactUs'>Contact Us</NavLink>

                </div>

                <p>Questions? Call us at (+27) 41 236 9490</p>

            </div>

        </div>
    )
}

export default BurnerAppointment
