import React, { useEffect, useState } from 'react'
import '../css/about.css'
import img1 from '../../public/woman-getting-her-eyes-checked.jpg'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useUserContext } from '../context/userContext.jsx'

function About() {


    const [aboutUs, setAboutUs] = useState([])

    const { user } = useUserContext()

    async function handle_fetch_about_us() {

        try {

            const res = await axios.get(`http://localhost:5000/getAllAboutUs`)

            if (res.data.success) {
                setAboutUs(res.data.data.aboutUs)
            }

            else {
                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);

        }

    }

    async function handle_remove_about_us(id) {

        try {

            const res = await axios.delete(`http://localhost:5000/removeAboutUs?id=${id}`)

            if (res.data.success) {
                toast.success(res.data.message)
                handle_fetch_about_us()
            }

            else {
                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);

        }

    }


    useEffect(() => {

        handle_fetch_about_us()

    }, [])


    return (
        <>

            <div className='about-us-heading'>

                <h2>ABOUT&nbsp;<span>US</span></h2>

            </div>


            <div className='about-us-container'>


                <div className='about-us-left'>

                    <h1>{aboutUs[0]?.aboutUsHeading}</h1>

                    <p>{aboutUs[0]?.aboutUsDescription}</p>

                    <div className='about-us-button-container'>

                        <NavLink to={'/about-us/'} className='btnReadMore'>Read More</NavLink>
                        {user?.role === "admin" ? <NavLink to={`/edit-about-us/${aboutUs[0]?.id}`} className='btnEdit'>Edit</NavLink> : ""}
                        {user?.role === "admin" ? <button onClick={() => handle_remove_about_us(aboutUs[0]?.id)} className='btnRemove'>Remove</button> : ""}

                    </div>
                </div>

                <div className='about-us-right'>

                    <img src={aboutUs[0]?.profilePicture} alt="Woman getting here eyes checked" />

                </div>

            </div>

        </>
    )
}

export default About
