import React, { useState } from 'react'
import imgAvator from '../../public/avator.png'
import '../css/addAboutUs.css'
import toast from 'react-hot-toast'
import axios from 'axios'

function AddAboutUs() {

    const [image, setImage] = useState({})
    const [upload, setUploading] = useState(false)
    const [data, setData] = useState({ profilePicture: '', aboutUsHeading: '', aboutUsDescription: '' })


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

        const {profilePicture, aboutUsHeading, aboutUsDescription} = data

        try {

            const res = await axios.post("http://localhost:5000/addAboutUs", { profilePicture, aboutUsHeading, aboutUsDescription })

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

    return (

        <div className='add-about-us-container'>

            <div className='add-about-us-container-inner'>

                <h1>Add About Us</h1>

                <form onSubmit={handle_submit}>


                    <div className='profile-co'>

                        <label htmlFor="image-upload">

                            <img src={image?.url || imgAvator} alt="" style={{ width: '5rem', height: '5rem', objectFit: 'contain', cursor: 'pointer', borderRadius: '50%' }} />

                        </label>

                        <span>Your Profile</span>
                        <input type="file" accept='image/*' id='image-upload' style={{ display: 'none' }} onChange={handle_change} />

                    </div>

                    <label>About Us Heading</label>
                    <input type='text' placeholder='Enter about us heading...' onChange={(e) => setData({ ...data, aboutUsHeading: e.target.value })} />
                    <label>About Us description</label>
                    <textarea cols={10} rows={10} placeholder='Enter about us description...' onChange={(e) => setData({ ...data, aboutUsDescription: e.target.value })}></textarea>
                    <button type='submit'>Add about us</button>

                </form>

            </div>

        </div>
    )
}

export default AddAboutUs
