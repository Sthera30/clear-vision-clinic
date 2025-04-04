import React, { useEffect, useState } from 'react'
import '../css/contact.css'
import { IoLocationOutline } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { BsClockHistory } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";
import { FaTwitter } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";



function Contact() {



    const [result, setResult] = useState("")

    const onSubmit = async (event) => {
        event.preventDefault();
        setResult("Sending....");

        const formData = new FormData(event.target);

        formData.append("access_key", "eb6025cf-c28c-4ad9-b96e-d3b44e44269c");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            setResult("Email sent...");
            event.target.reset();
        } else {
            console.log("Error", data);
            setResult(data.message);
        }
    };


    useEffect(() => {

        window.scrollTo(0, 0)

    }, [])

    return (
        <>

            <div className='contact-us-container'>

                <div className='contact-us-inner'>

                    <h1>Contact Us</h1>
                    <p>We're here to help with all your vision care needs. Reach out to us with any questions or to schedule an appointment.</p>

                </div>

            </div>

            <div className='contact-container'>


                <div className='contact-left'>

                    <h3>Get In Touch</h3>

                    <div className='info-conatiner'>

                        <div className='info-inner-left'>

                            <IoLocationOutline style={{ color: 'skyblue', fontSize: '2.2rem' }} />

                        </div>

                        <div className='info-inner-right'>

                            <h2 style={{ fontWeight: '300' }}>Our Location</h2>
                            <p style={{ marginTop: '-.5rem' }}>23 Caledon Street, Uitenhage</p>

                        </div>

                    </div>


                    <div className='info-conatiner'>

                        <div className='info-inner-left'>

                            <FaPhone style={{ color: 'skyblue', fontSize: '2.2rem' }} />

                        </div>

                        <div className='info-inner-right'>

                            <h2 style={{ fontWeight: '300' }}>Phone</h2>
                            <p style={{ marginTop: '-.5rem' }}> (+27) 41 236 9490</p>

                        </div>

                    </div>


                    <div className='info-conatiner'>

                        <div className='info-inner-left'>

                            <MdEmail style={{ color: 'skyblue', fontSize: '2.2rem' }} />

                        </div>

                        <div className='info-inner-right'>

                            <h2 style={{ fontWeight: '300' }}>Email</h2>
                            <p style={{ marginTop: '-.5rem' }}> info@clearvisionclinic.com</p>

                        </div>

                    </div>


                    <div className='info-conatiner'>

                        <div className='info-inner-left'>

                            <BsClockHistory style={{ color: 'skyblue', fontSize: '2.2rem' }} />

                        </div>

                        <div className='info-inner-right'>

                            <h2 style={{ fontWeight: '300' }}>Hours</h2>
                            <p style={{ marginTop: '-.5rem' }}>Monday - Friday: 8:00 AM - 18:00 PM</p>
                            <p style={{ marginTop: '-.5rem' }}>Saturday: 8:00 AM - 14:00 PM</p>
                            <p style={{ marginTop: '-.5rem' }}>Sunday: <span style={{ color: 'red' }}>Closed</span></p>



                        </div>

                    </div>


                </div>


                <div className='contact-right'>

                    <h1>Send Us a Message</h1>

                    <form onSubmit={async (event) => onSubmit(event)}>

                        <label>Full Name</label>
                        <input type='text' placeholder='Enter your name' required />
                        <label>Email</label>
                        <input type='email' placeholder='Enter your email' required />
                        <label>Message</label>
                        <textarea placeholder='Write your message here....' rows={10} cols={10} required></textarea>
                        <button type='submit'><IoIosSend />&nbsp;Send Message</button>
                        <br />
                        <span style={{ color: 'green' }}>{result}</span>
                        
                        
                    </form>

                </div>

            </div>

        </>
    )
}

export default Contact
