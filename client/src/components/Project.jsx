import React from 'react'
import '../css/project.css'
import img1 from '../../public/resizecom_close-up-photo-tennis-ball-hitting-net-sport-concept copy.jpg'
import {FaPlay} from 'react-icons/fa'
import {motion} from 'framer-motion'
import {FaArrowDown} from 'react-icons/fa'

function Project() {
    return (

        <>

            <div className='projects-container'>

                <motion.h1 initial={{opacity: 0, y:80}} whileInView={{opacity: 1, y: 0}} viewport={{ once: true}} transition={{duration: .8, delay: .8}}>Our Portfolio</motion.h1>
                <motion.p initial={{opacity: 0, y:-80}} whileInView={{opacity: 1, y: 0}} viewport={{ once: true}} transition={{duration: .8, delay: .8}}>Past Project(s)</motion.p>

            </div>


            <div className='project-box-container'>

                <div className='project-box'>

                    <img src={img1} alt="" />

                    <div className='content'>

                        <p>Kwano Sports Club</p>
                        <FaPlay style={{color: 'red'}} />

                    </div>


                </div>

            </div>


        </>


    )
}

export default Project
