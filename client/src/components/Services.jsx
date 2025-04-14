import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaArrowRight } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import '../css/services.css'
import img1 from '../../public/avator.png'
import { useUserContext } from '../context/userContext.jsx'

function Services() {



    const [service, setService] = useState([])

    const { user } = useUserContext()


    async function handle_fetch_services() {

        try {

            const res = await axios.get("http://localhost:5000/getAllServices")

            if (res.data.success) {
                setService(res.data.data.services)
            }

            else {

                toast.error(res.data.error)

            }

        } catch (error) {
            console.log(error);

        }

    }

    async function handle_remove(id) {

        try {

            const res = await axios.delete(`http://localhost:5000/removeServices?id=${id}`)

            if (res.data.success) {
                toast.success(res.data.message)
                handle_fetch_services()
                console.log("Hello");
            }

            else {
                toast.error(res.data.error)
                console.log("`fuck`");

            }

        } catch (error) {
            console.log(error);

        }

    }

    useEffect(() => {

        handle_fetch_services()
        window.scrollTo(0, 0)

    }, [])

    return (

        <>
            <div className='service-heading'>

                <h1><span>Clear Vision</span> Clinic Services</h1>
                <p>At Clear Vision Clinic, we provide comprehensive eye care services using the latest technology. Our team of experts is committed to delivering personalized care for all your vision needs.</p>

            </div>



            <div className='frame-container'>

                <div className='frame-inner-container'>

                    <h1>Premium Frame Selection</h1>
                    <p>Discover the perfect frames that complement your face shape, personal style, and lifestyle needs. Our extensive collection includes:</p>
                    <ul>
                        <li>Designer brands for fashion-forward individuals
                        </li>
                        <li>Lightweight titanium frames for all-day comfort
                        </li>
                        <li>Durable acetate frames in various colors and patterns
                        </li>
                        <li>Hypoallergenic options for sensitive skin

                        </li>
                        <li>Rimless, semi-rimless, and full-rim styles

                        </li>
                        <li>Sport frames for active lifestyles

                        </li>
                        <li>Children's frames designed for durability and comfort

                        </li>
                    </ul>

                </div>
                <div className='frame-inner-container'>

                    <h1>Advanced Lens Technology
                    </h1>
                    <p>Our cutting-edge lens options ensure optimal vision correction and protection for your eyes. Choose from:</p>
                    <ul>
                        <li>Single vision, bifocal, and progressive lenses
                        </li>
                        <li>High-index lenses for stronger prescriptions
                        </li>
                        <li>Polycarbonate impact-resistant lenses
                        </li>
                        <li>
                            Blue light filtering technology for digital screen users
                        </li>
                        <li>
                            Photochromic lenses that adjust to light conditions
                        </li>
                        <li>
                            Polarized lenses for reduced glare and UV protection
                        </li>
                        <li>
                            Premium anti-reflective coatings for clearer vision
                        </li>
                    </ul>

                </div>

                <div className='frame-inner-container'>

                    <h1>Expert Fitting Process
                    </h1>
                    <p>Our optical experts ensure your eyewear fits perfectly and provides optimal vision correction:</p>
                    <ul>
                        <li>Precise facial measurements for perfect frame fit
                        </li>
                        <li>Pupillary distance measurement for accurate lens placement
                        </li>
                        <li>Professional consultation on frame selection
                        </li>
                        <li>
                            Frame adjustments for maximum comfort
                        </li>
                        <li>
                            Follow-up adjustments included with purchase                        </li>
                        <li>
                            Polarized lenses for reduced glare and UV protection
                        </li>
                        <li>
                            Virtual try-on technology available
                        </li>
                    </ul>

                </div>

                <div className='frame-inner-container'>

                    <h1>Insurance & Payment Options
                    </h1>
                    <p>We make quality eyewear accessible with flexible payment solutions:
                    </p>
                    <ul>
                        <li>We accept most major vision insurance plans
                        </li>
                        <li>FSA and HSA cards accepted
                        </li>
                        <li>Financing options available
                        </li>
                        <li>
                            Special discounts for seniors and students
                        </li>
                        <li>
                            Family package deals
                        </li>
                        <li>
                            Second pair discounts
                        </li>
                        <li>
                            One-year warranty on most frames
                        </li>
                    </ul>

                </div>

            </div>

            <div className='service-box-container'>

                {service.map((serv, index) => (

                    <div className='service-box' key={index}>
                        <img src={serv.profilepicture} alt="Patient ophthalmologist office" />
                        <div className='content'>

                            <h2>{serv.serviceheading}</h2>
                            <p>{serv.servicedescription}</p>

                            <div className='button-learn'>

                                {user?.role === "admin" ? <NavLink to={`/edit-services/${serv.id}`} className='btnEdit'>Edit</NavLink> : ""}
                                {user?.role === "admin" ? <button onClick={() => handle_remove(serv.id)} className='btnRemove'>Remove</button> : ""}

                            </div>

                        </div>

                    </div>

                ))}

            </div>


            <div className='clients-container'>

                <h1>What Our Patients Say</h1>

                <div className='clients-inner-container'>

                    <div className='clients-inner-box'>

                        <p>he selection at Clear Vision Clinic is incredible! Their optical team helped me find frames that look great and feel comfortable all day. The anti-reflective coating has made a huge difference for my computer work.</p>

                        <div className='content'>

                            <div className='content-left'>

                                <img src={img1} alt="" />

                            </div>

                            <div className='content-right'>

                                <h2>Jennifer T.</h2>
                                <p>Patient since 2020</p>

                            </div>

                        </div>

                    </div>

                    <div className='clients-inner-box'>

                        <p>As someone with a strong prescription, I've always struggled to find stylish frames. The team at Clear Vision Clinic showed me high-index lens options that are thin and lightweight, even with my prescription. I couldn't be happier!</p>


                        <div className='content'>

                            <div className='content-left'>

                                <img src={img1} alt="" />

                            </div>

                            <div className='content-right'>

                                <h2>Marcus L</h2>
                                <p>Patient since 2018</p>

                            </div>

                        </div>

                    </div>

                </div>


            </div>

            <div className='appointment-burner'>

                <div className='appointment-inner-burner'>

                    <h1>Ready to Find Your Perfect Pair?</h1>
                    <p>Schedule an appointment for an eye exam or bring your current prescription to our optical shop.</p>
                    <NavLink to={"/doctors/"} className='btnAppointment'>Book an Appointment</NavLink>

                </div>

            </div>


        </>

    )
}

export default Services
