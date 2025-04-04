import React, { useEffect, useState } from 'react'
import '../css/editDoctor.css'
import { useNavigate, useParams } from 'react-router-dom'
import imgAvator from '../../public/avator.png'
import { FaPlus } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'

function EditDoctor() {

    const [image, setImage] = useState({})
    const [upload, setUploading] = useState(false)
    const [data, setData] = useState({ profilePicture: '', doctorName: '', doctorEmail: '', doctorExperience: '', doctorFee: '', doctorAddressLine1: '', doctorQualification: '', doctorSpeciality: '', doctorAddressLine2: '', aboutDoctor: '', password: '', confirmPassword: '' })

    const { id } = useParams()

    const navigate = useNavigate()

    async function handle_change(e) {

        const file = e.target.files[0]
        const formData = new FormData()
        formData.append("image", file)

        setUploading(true)

        try {

            const { data } = await axios.post("http://localhost:5000/upload", formData)

            setUploading(false)

            setImage({
                url: data.url,
                public_id: data.public_id
            })

            setData(prevData => ({ ...prevData, profilePicture: data.url }))

        } catch (error) {
            console.log(error);

        }

    }


    async function handle_submit(e) {

        e.preventDefault()

        const { profilePicture, doctorName, doctorEmail, doctorExperience, doctorFee, doctorAddressLine1, doctorQualification, doctorSpeciality, doctorAddressLine2, aboutDoctor, password, confirmPassword } = data

        try {

            const res = await axios.put("http://localhost:5000/updateDoctor", { id, profilePicture, doctorName, doctorEmail, doctorExperience, doctorFee, doctorAddressLine1, doctorQualification, doctorSpeciality, doctorAddressLine2, aboutDoctor, password, confirmPassword })

            if (res.data.success) {
                toast.success(res.data.message)
                navigate("/doctor-list/")
            }

            else {
                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);
        }

    }

    async function handle_fetch_doctor_by_id(id) {

        try {

            const res = await axios.get(`http://localhost:5000/getDoctorById?id=${id}`)

            if (res.data.success) {
                setData(res.data.data.doctor)
                console.log("Hello bro!");

            }

            else {
                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);

        }

    }

    useEffect(() => {

        handle_fetch_doctor_by_id(id)
        window.scrollTo(0, 0)

    }, [id])

    return (
        <div className='add-doctor-container'>

            <div className='add-doctor-inner'>

                <h1>Edit Doctor</h1>

                <form onSubmit={handle_submit}>


                    <div className='profile-co'>

                        <label htmlFor="image-upload">

                            <img src={image?.url || imgAvator} alt="" style={{ width: '5rem', height: '5rem', objectFit: 'contain', cursor: 'pointer', borderRadius: '50%' }} />

                        </label>

                        <span>Your Profile</span>
                        <input type="file" accept='image/*' id='image-upload' style={{ display: 'none' }} onChange={handle_change} />

                    </div>

                    <div className='doc-inner-container'>

                        <div className='doc-container'>

                            <div className='doc-left'>


                                <label>Enter doctor name</label>
                                <input type="text" placeholder='Enter doctor name' value={data?.doctorName} onChange={(e) => setData({ ...data, doctorName: e.target.value })} />
                                <label>Enter doctor email</label>
                                <input type='email' placeholder='Enter doctor email' value={data?.doctorEmail} onChange={(e) => setData({ ...data, doctorEmail: e.target.value })} />
                                <label>Experience</label>
                                <select value={data.doctorExperience} onChange={(e) => setData({ ...data, doctorExperience: e.target.value })}>
                                    <option>1 Year</option>
                                    <option>2 Years</option>
                                    <option>3 Years</option>
                                    <option>4 Years</option>
                                    <option>5 Years</option>
                                </select>

                                <label>Enter doctor fee</label>
                                <input type="number" placeholder='Enter doctor fee' value={data.doctorFee} onChange={(e) => setData({ ...data, doctorFee: e.target.value })} />

                                <label>Enter doctor address line 1</label>
                                <input type="text" placeholder='Enter address line 1' value={data.doctorAddressLine1} onChange={(e) => setData({ ...data, doctorAddressLine1: e.target.value })} />


                            </div>

                            <div className='doc-right'>

                                <label>Enter password</label>
                                <input type="password" placeholder='Enter password' onChange={(e) => setData({ ...data, password: e.target.value })} />
                                <label>Confirm password</label>
                                <input type="password" placeholder='Confirm password' onChange={(e) => setData({ ...data, confirmPassword: e.target.value })} />

                                <label>Qualification</label>
                                <select value={data.doctorQualification} onChange={(e) => setData({ ...data, doctorQualification: e.target.value })}>

                                    <option>MBBS (Bachelor of Medicine, Bachelor of Surgery)</option>
                                    <option>MD (Doctor of Medicine)</option>
                                    <option>MS (Master of Surgery) in Ophthalmology</option>

                                </select>

                                <label>Speciality</label>
                                <select value={data.doctorSpeciality} onChange={(e) => setData({ ...data, doctorSpeciality: e.target.value })}>

                                    <option>General Ophthalmology</option>
                                    <option>Comprehensive Eye Care</option>
                                    <option>Eye Surgery</option>
                                    <option>Vision Therapy</option>

                                </select>

                                <label>Enter doctor address line 2&nbsp;&nbsp;<span style={{ color: 'red' }}>optional</span></label>
                                <input type="text" placeholder='Enter address line 2' value={data.doctorAddressLine2} onChange={(e) => setData({ ...data, doctorAddressLine2: e.target.value })} />

                            </div>

                        </div>



                        <label className='about-doc'>About doctor</label>
                        <textarea value={data.aboutDoctor} cols={10} rows={10} placeholder='Write about doctor' onChange={(e) => setData({ ...data, aboutDoctor: e.target.value })}></textarea>

                        <div className='button-add'>

                            <button type='submit'>Update Doctor <FaPlus className='plus' style={{ color: '#fff' }} /> </button>

                        </div>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default EditDoctor
