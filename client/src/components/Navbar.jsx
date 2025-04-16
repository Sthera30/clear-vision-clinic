import React, { useEffect, useState } from 'react'
import '../css/navbar.css'
import { FaBars } from 'react-icons/fa'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaEye } from 'react-icons/fa'
import { useUserContext } from '../../src/context/userContext.jsx'
import { FaCog } from 'react-icons/fa'
import axios from 'axios'
import toast from 'react-hot-toast'

function Navbar() {

    const [isClicked, setIsClicked] = useState(false)
    const [isGearClicked, setIsGearClicked] = useState(false)
    const [isVisible, setIsVisible] = useState(false);


    const navigate = useNavigate()

    const { user } = useUserContext()

    useEffect(() => {

        window.scrollTo(0, 0)

    }, [])


    useEffect(() => {
        const handleScroll = () => {
            if (isGearClicked) {
                setIsGearClicked(false);
            }
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isGearClicked]);

    const toggleGearClick = () => {
        setIsGearClicked(!isGearClicked);
    };



    async function handle_logout() {

        try {

            const res = await axios.post("https://clear-vision-clinic-backend.vercel.app/logout", {}, { withCredentials: true })

            if (res.data.success) {
                toast.success(res.data.message)
                navigate("/login", { replace: true })
                window.location.reload()
            }

            else {

                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);

        }

    }


    return (
        <div className='header'>

            <div className='logo-design'>

                <FaEye className='eyeIcon' style={{ color: '#fff', fontSize: '2.5rem', fontFamily: 'cursive', fontStyle: 'oblique' }} />
                <span>Clear Vision Clinic</span>

            </div>

            <div className='right-design'>

                <div className={`right-design-inner ${isClicked ? "show" : "hide"}`}>

                    <NavLink to={"/"}>Home</NavLink>
                    <NavLink style={{color: '#fff'}} to={"/about-us/"}>About us</NavLink>
                    <NavLink to={"/our-services/"}>Services</NavLink>
                    <NavLink to={"/doctors/"}>Doctors</NavLink>
                    <NavLink to={"/contact-us/"}>Contact</NavLink>

                </div>

                <div className='bars-container'>

                    <FaBars onClick={() => setIsClicked(prev => !prev)} className='bars' style={{ color: '#333', marginLeft: '1rem', cursor: 'pointer', display: 'none' }} />

                </div>

                {user ? <>
                    <div className='settings' style={{ marginLeft: '1rem' }}>

                        <FaCog onClick={() => setIsGearClicked(prev => !prev)} style={{ color: '#fff', fontSize: '2rem', cursor: 'pointer' }} />

                    </div>
                </> : ""}

                <div className={`admin-functionality ${isGearClicked ? "showInfo" : "hideInfo"}`} style={{
                    transition: 'all 0.3s ease-in-out',
                    opacity: isGearClicked ? 1 : 0,
                    visibility: isGearClicked ? 'visible' : 'hidden',
                    transform: isGearClicked ? 'translateY(0)' : 'translateY(-20px)',
                    maxHeight: isGearClicked ? '350px' : '0',
                    overflow: 'hidden'
                }}>

                    {user?.role === "user" ? <>

                        <a className='admin'>User Functions</a>
                        <NavLink to={'/my-profile'}>My profile</NavLink>
                        <NavLink to={'/my-appointments'}>My Appointments</NavLink>


                    </> : <>

                        <a className='admin'>Admin Functions</a>
                        <NavLink to={"/admin"}>Dashboard</NavLink>
                        <NavLink to={"/management-appointment"}>Manage Appointments</NavLink>
                        <NavLink to={"/doctor-list/"}>Doctor List</NavLink>
                        <NavLink to={"/add-doctor/"}>Add Doctor</NavLink>
                        <NavLink to={"/doctor-availability/"}>Manage Doctor Availability</NavLink>

                    </>}

                </div>

                <div className='login-con'>

                    {user ? <>

                        <button onClick={handle_logout} className='btnLogout'>Logout</button>

                    </> : <>

                        <NavLink to={"/login/"} className='btnLogin'>Login</NavLink>

                    </>}


                </div>


            </div>

        </div>
    )
}

export default Navbar
