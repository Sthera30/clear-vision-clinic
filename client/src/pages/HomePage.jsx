import React from 'react'
import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import { Helmet } from 'react-helmet'
import Service from '../components/Service.jsx'
import Doctor from '../components/Doctor.jsx'
import Footer from '../components/Footer.jsx'
import BurnerAppointment from '../components/BurnerAppointment.jsx'

function HomePage() {
    return (
        <div>

            <Hero />
            <About />
            <Service />
            <Doctor />
            <BurnerAppointment />
            <Footer />

        </div >
    )
}

export default HomePage
