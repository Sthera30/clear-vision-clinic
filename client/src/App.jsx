import React from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import Main_layout from './layout/Main_layout.jsx'
import HomePage from './pages/HomePage.jsx'
import RegistartionPage from '../src/pages/RegistrationPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AddDoctorPage from './pages/AddDoctorPage.jsx'
import DoctorAvailabilityPage from './pages/DoctorAvailabilityPage.jsx'
import AddServicesPage from './pages/AddServicesPage.jsx'
import EditServicePage from './pages/EditServicePage.jsx'
import AddAboutUsPage from './pages/AddAboutUsPage.jsx'
import EditAboutUsPage from './pages/EditAboutUsPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ServicePage from './pages/ServicePage.jsx'
import AppointmentPage from './pages/AppointmentPage.jsx'
import MyAppointmentsPage from './pages/MyAppointmentsPage.jsx'
import EditAppointmentPage from './pages/EditAppointmentPage.jsx'
import MyProfilePage from './pages/MyProfilePage.jsx'
import EditProfilePage from './pages/EditProfilePage.jsx'
import DoctorPage from './pages/DoctorPage.jsx'
import DoctorsPage from './pages/DoctorsPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import ManagementAppointmentPage from './pages/ManagementAppointmentPage.jsx'
import UpdateAppointmentManagementPage from './pages/UpdateAppointmentManagementPage.jsx'
import DoctorListPage from './pages/DoctorListPage.jsx'
import EditDoctorPage from './pages/EditDoctorPage.jsx'
import { Toaster } from 'react-hot-toast'
import ContactUsPage from './pages/ContactUsPage.jsx'
import EmailVerificationPage from './pages/EmailVerificationPage.jsx'
import VerifyOtpPage from './pages/VerifyOtpPage.jsx'
import ChangePassword from './pages/ChangePasswordPage.jsx'

function App() {


    const router = createBrowserRouter(

        createRoutesFromElements(



            <Route path={"/"} element={<Main_layout />}>

                <Route index element={<HomePage />} />
                <Route path={'/registration/'} element={<RegistartionPage />} />
                <Route path={'/login/'} element={<LoginPage />} />
                <Route path={'/add-doctor/'} element={<AddDoctorPage />} />
                <Route path={'/doctor-availability/'} element={<DoctorAvailabilityPage />} />
                <Route path={'/add-services/'} element={<AddServicesPage />} />
                <Route path={'/add-services/'} element={<AddServicesPage />} />
                <Route path={'/edit-services/:id'} element={<EditServicePage />} />
                <Route path={'/add-about-us/'} element={<AddAboutUsPage />} />
                <Route path={'/edit-about-us/:id'} element={<EditAboutUsPage />} />
                <Route path={'/edit-doctor/:id'} element={<EditDoctorPage />} />
                <Route path={'/about-us/'} element={<AboutPage />} />
                <Route path={'/our-services/'} element={<ServicePage />} />
                <Route path={'/appointment/:id'} element={<AppointmentPage />} />
                <Route path={'/my-appointments'} element={<MyAppointmentsPage />} />
                <Route path={'/edit-appointment/:id'} element={<EditAppointmentPage />} />
                <Route path={'/my-profile'} element={<MyProfilePage />} />
                <Route path={'/edit-profile/:id'} element={<EditProfilePage />} />
                <Route path={'/doctor/'} element={<DoctorPage />} />
                <Route path={'/doctors/'} element={<DoctorsPage />} />
                <Route path={'/admin/'} element={<AdminPage />} />
                <Route path={'/management-appointment'} element={<ManagementAppointmentPage />} />
                <Route path={'/edit-appointment-management/:id'} element={<UpdateAppointmentManagementPage />} />
                <Route path={'/doctor-list/'} element={<DoctorListPage />} />
                <Route path={'/contact-us/'} element={<ContactUsPage />} />
                <Route path={'/email-verification/'} element={<EmailVerificationPage />} />
                <Route path={'/verify-otp/'} element={<VerifyOtpPage />} />
                <Route path={"/change-password"} element={<ChangePassword />} />

            </Route>


        )

    )

    return (
        <>
            <Toaster position='top-center' gutter={8} toastOptions={{ style: { zIndex: 9999 } }} />
            <RouterProvider router={router} />
        </>

    )

}

export default App
