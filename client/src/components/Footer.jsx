import React from 'react'
import '../css/footer.css'
import { CiLocationOn } from 'react-icons/ci'
import { FaPhone } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import { NavLink } from 'react-router-dom';

function Footer() {
    return (
        <>

            <div className='footer-'>

                <div className='footer-container'>

                    <div className='footer-box'>

                        <h2>Contact Us</h2>
                        <p><CiLocationOn style={{ fontSize: '1.4rem' }} />&nbsp;123 Vision Street
                            Cityview, State 12345</p>
                        <p><FaPhone style={{ fontSize: '1.4rem' }} />&nbsp;(+27) 41 236 9490</p>
                        <p><MdOutlineMailOutline style={{ fontSize: '1.4rem' }} />&nbsp;info@clearvisionclinic.com</p>


                    </div>

                    <div className='footer-box'>

                        <h2>Quick Links</h2>
                        <NavLink to={"/"}>Home</NavLink>
                        <NavLink to={"/about-us/"}>About Us</NavLink>
                        <NavLink to={"/our-services/"}>Services</NavLink>
                        <NavLink to={"/doctors/"}>Doctors</NavLink>
                        <NavLink to={"/contact-us/"}>Contact</NavLink>

                    </div>


                    <div className='footer-box'>

                        <h2>Opening Hours</h2>
                        <p>Monday: <span>8:00 AM - 18:00 PM</span></p>
                        <p>Tuesday: <span>8:00 AM - 18:00 PM</span></p>
                        <p>Wednesday: <span>8:00 AM - 18:00 PM</span></p>
                        <p>Thursday: <span>8:00 AM - 18:00 PM</span></p>
                        <p>Friday: <span>8:00 AM - 18:00 PM</span></p>
                        <p>Saturday: <span>8:00 AM - 14:00 PM</span></p>
                        <p>Sunday: <span style={{ color: 'red' }}>Closed</span></p>

                    </div>

                </div>

                <p>© 2025 Clear Vision Clinic. All rights reserved. | Website Built By <a href="https://www.sthedigitalagency.co.za" target='_blank' rel='noopener noreferrer'>Sthe Digital Agency</a></p>

            </div>



        </>
    )
}

export default Footer
