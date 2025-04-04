import React from 'react'
import '../css/contact.css'
import {FaLongArrowAltRight} from 'react-icons/fa'

function ContactUs() {
    return (
        <div className='contact-us-container'>

            <div className='contact-us-container-inner'>

                <h1>Contact Us Today&nbsp; <FaLongArrowAltRight style={{color: 'red', fontWeight: '300'}} /></h1>
                <p>(+27) 62 419 2299 | <a href="">info@quantumcode.co.za</a></p>
                <button>Get in touch</button>
 
            </div>

        </div>
    )
}

export default ContactUs
