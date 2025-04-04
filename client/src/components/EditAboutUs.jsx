import React, { useEffect, useState } from 'react'
import '../css/EditAboutUs.css'
import { useParams } from 'react-router-dom'
import imgAvator from '../../public/avator.png'
import toast from 'react-hot-toast'
import axios from 'axios'

function EditAboutUs() {


    const [image, setImage] = useState({})
    const [upload, setUploading] = useState(false)
    const [data, setData] = useState({ profilePicture: '', aboutUsHeading: '', aboutUsDescription: '' })


    const { id } = useParams()


    async function handle_about_use_by_id(id) {

        console.log(`Hello${id}`);
        

        try {
            const res = await axios.get(`http://localhost:5000/getAboutUsById?id=${id}`)

            if (res.data.success) {
                setData(res.data.data.aboutUs)
            }

            else {
                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);
        }

    }

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

        const { profilePicture, aboutUsHeading, aboutUsDescription } = data

        try {

            const res = await axios.put("http://localhost:5000/updateAboutUs", { id, profilePicture, aboutUsHeading, aboutUsDescription })

            if (res.data.success) {
                toast.success(res.data.message)
            }

            else {
                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);

        }

    }

    useEffect(() => {

        handle_about_use_by_id(id)
        window.scrollTo(0, 0)

    },[id])

    return (
        <div className='add-about-us-container'>

            <div className='add-about-us-container-inner'>

                <h1>Edit About Us</h1>

                <form onSubmit={handle_submit}>


                    <div className='profile-co'>

                        <label htmlFor="image-upload">

                            <img src={image?.url || imgAvator} alt="" style={{ width: '5rem', height: '5rem', objectFit: 'contain', cursor: 'pointer', borderRadius: '50%' }} />

                        </label>

                        <span>Your Profile</span>
                        <input type="file" accept='image/*' id='image-upload' style={{ display: 'none' }} onChange={handle_change} />

                    </div>

                    <label>About Us Heading</label>
                    <input type='text' placeholder='Enter about us heading...' value={data.aboutUsHeading} onChange={(e) => setData({ ...data, aboutUsHeading: e.target.value })} />
                    <label>About Us description</label>
                    <textarea cols={10} rows={10} placeholder='Enter about us description...' value={data.aboutUsDescription} onChange={(e) => setData({ ...data, aboutUsDescription: e.target.value })}></textarea>
                    <button type='submit'>Update about us</button>

                </form>

            </div>

        </div>
    )
}

export default EditAboutUs
