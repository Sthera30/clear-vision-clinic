import React from 'react'
import Navbar from '../components/Navbar.jsx'
import { Outlet } from 'react-router-dom'
import WhatsAppButton from '../components/WhatsAppButton.jsx'
import ScrollToTop from '../components/ScrollToTop.jsx'

function Main_layout() {
  return (
    <div>

      <Navbar />
      <Outlet />
      {/* <WhatsAppButton phoneNumber="1234567890" /> */}
      {/*  <ScrollToTop /> */}

    </div>
  )
}

export default Main_layout
