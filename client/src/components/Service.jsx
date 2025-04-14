import React, { useEffect, useState } from 'react'
import '../css/service.css'
import { FaArrowRight } from 'react-icons/fa'
import axios from 'axios'
import toast from 'react-hot-toast'
import { NavLink } from 'react-router-dom'
import { useUserContext } from '../context/userContext.jsx'

function Service() {


    const [service, setService] = useState([])

    const { user } = useUserContext()

    async function handle_fetch_services() {

        try {

            const res = await axios.get("https://clear-vision-clinic-backend.vercel.app/getAllServices")

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

            const res = await axios.delete(`https://clear-vision-clinic-backend.vercel.app/removeServices?id=${id}`)

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

    }, [])


    return (
        <>

            <div className='service-heading'>

                <h1><span>Clear Vision</span> Clinic Services</h1>
                <p>At Clear Vision Clinic, we provide comprehensive eye care services using the latest technology. Our team of experts is committed to delivering personalized care for all your vision needs.</p>

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

        </>
    )
}

export default Service

