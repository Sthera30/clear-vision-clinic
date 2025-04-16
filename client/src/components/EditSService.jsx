import React, { useEffect, useState } from 'react'
import imgAvator from '../../public/avator.png'
import '../css/editService.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

function EditSService() {


    const [image, setImage] = useState({})
    const [upload, setUploading] = useState(false)
    const [data, setData] = useState({ profilepicture: '', serviceheading: '', servicedescription: '' })

    const { id } = useParams()

    async function handle_fetch_service_by_id(id) {

        try {

            const res = await axios.get(`http://localhost:5000/getServicesById?id=${id}`)

            if (res.data.success) {
                setData(res.data.data.services)
            }

            else {
                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);

        }

    }

    const navigate = useNavigate()

    useEffect(() => {

        handle_fetch_service_by_id(id)
        window.scrollTo(0, 0)

    }, [id])

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

        const { profilepicture, serviceheading, servicedescription } = data

        e.preventDefault()

        try {

            const res = await axios.put(`http://localhost:5000/updateServices`, { id, profilepicture, serviceheading, servicedescription })

            if (res.data.success) {
                toast.success(res.data.message)
                navigate("/")
            }

            else {
                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);

        }

    }

    return (
        <>

            <div className='add-services-container'>

                <div className='add-services-container-inner'>

                    <h1>Edit Services</h1>

                    <form onSubmit={handle_submit}>


                        <div className='profile-co'>

                            <label htmlFor="image-upload">

                                <img src={image?.url || imgAvator} alt="" style={{ width: '5rem', height: '5rem', objectFit: 'contain', cursor: 'pointer', borderRadius: '50%' }} />

                            </label>

                            <span>Your Profile</span>
                            <input type="file" accept='image/*' id='image-upload' style={{ display: 'none' }} onChange={handle_change} />

                        </div>

                        <label>Services Heading</label>
                        <input type='text' placeholder='Enter services heading...' value={data?.serviceheading} onChange={(e) => setData({ ...data, serviceheading: e.target.value })} />
                        <label>Services description</label>
                        <textarea cols={10} rows={10} placeholder='Enter services descrption...' value={data?.servicedescription} onChange={(e) => setData({ ...data, servicedescription: e.target.value })}></textarea>
                        <button type='submit'>Update services</button>

                    </form>

                </div>

            </div>

        </>
    )
}

export default EditSService

{/* 
Laser Vision Correction
Our specialists will evaluate your candidacy for LASIK and other laser vision correction procedures, providing guidance on the best options for you.
    
    */}