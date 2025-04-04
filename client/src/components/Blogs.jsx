import React, { useEffect, useState } from 'react'
import '../css/blog.css'
import { motion } from 'framer-motion'
import { FaUser, FaArrowDown } from 'react-icons/fa'
import { Calendar } from 'lucide-react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import Burner from '../components/Burner.jsx'

function Blog() {


    const [article, setArticle] = useState([])




    async function handle_fetch_article() {

        try {

            const res = await axios.get(`http://localhost:1337/api/articles?populate[0]=cover&populate[1]=blocks&populate[2]=author`)

            if (res.data.data.length > 0) {
                setArticle(res.data.data);
            }

            else {
                console.log("Tshayiwe?");

            }

        } catch (error) {
            console.log(error);

        }

    }


    useEffect(() => {

        handle_fetch_article()
        window.scrollTo(0, 0)

    }, [])


    const truncateDescription = (text, length = 300) => {
        return text.length > length ? text.substring(0, length) + '...' : text;
    };


    return (

        <>

            <div className='blog-burner' style={{marginBottom:'8rem'}}>

                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: '.8', delay: '.7' }} className='blog-burner-inner'>

                    <h1>Blogs</h1>

                </motion.div>


            </div>

            <div className='blog-heading'>

                <h1>Blogs</h1>
                <FaArrowDown style={{ color: 'red', fontSize: '2rem' }} />
                <h2>Latest Articles</h2>

            </div>

            <div className='blog-container'>

                {article.map((articles, index) => (

                    <div className='blog-box' key={index}>

                        <img src={`http://localhost:1337${articles?.cover?.url}`} alt={articles?.cover?.alternativeText} title={articles?.cover?.caption} loading='lazy' />

                        <div className='content'>

                            <NavLink to={`/article/${articles.slug}`}><h1 style={{ color: '#333' }}>{articles.title}</h1></NavLink>
                            <div className='blog-content-info'>
                                <p><FaUser />&nbsp;{articles?.author?.name}</p>
                                <p><Calendar />

                                    {new Date(articles?.createdAt).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>

                            </div>
                            <p className='desc' style={{ marginBottom: '2rem' }}>                {truncateDescription(articles.description)}
                            </p>
                            <NavLink className={"btnReadMore"} style={{ marginTop: '1rem' }} to={`/article/${articles.slug}`}>Read more</NavLink>

                        </div>

                    </div>

                ))}

            </div>

            <Burner />


        </>


    )
}

export default Blog
