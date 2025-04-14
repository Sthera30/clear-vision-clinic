import React, { useState } from 'react'
import imgAvator from '../../public/avator.png'
import '../css/addServices.css'
import axios from 'axios'
import toast from 'react-hot-toast'

function AddServices() {

    const [image, setImage] = useState({})
    const [upload, setUploading] = useState(false)
    const [data, setData] = useState({ profilePicture: '', serviceHeading: '', serviceDescription: '' })


    async function handle_change(e) {

        const file = e.target.files[0]
        const formData = new FormData()
        formData.append("image", file)

        setUploading(true)

        try {

            const { data } = await axios.post("https://clear-vision-clinic-backend.vercel.app/upload", formData)

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

        const { profilePicture, serviceHeading, serviceDescription } = data

        try {

            const res = await axios.post("https://clear-vision-clinic-backend.vercel.app/addServices", { profilePicture, serviceHeading, serviceDescription })

            if (res.data.success) {
                toast.success(res.data.message)
            }

            else{
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

                    <h1>Add Services</h1>

                    <form onSubmit={handle_submit}>


                        <div className='profile-co'>

                            <label htmlFor="image-upload">

                                <img src={image?.url || imgAvator} alt="" style={{ width: '5rem', height: '5rem', objectFit: 'contain', cursor: 'pointer', borderRadius: '50%' }} />

                            </label>

                            <span>Your Profile</span>
                            <input type="file" accept='image/*' id='image-upload' style={{ display: 'none' }} onChange={handle_change} />

                        </div>

                        <label>Services Heading</label>
                        <input type='text' placeholder='Enter services heading...' onChange={(e) => setData({...data, serviceHeading: e.target.value})} />
                        <label>Services description</label>
                        <textarea cols={10} rows={10} placeholder='Enter services descrption...' onChange={(e) => setData({...data, serviceDescription: e.target.value})}></textarea>
                        <button type='submit'>Add services</button>

                    </form>

                </div>

            </div>

        </>
    )
}

export default AddServices
