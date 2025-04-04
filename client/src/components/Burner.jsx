import React from 'react'
import '../css/burner.css'
import {motion} from 'framer-motion'
import {NavLink} from 'react-router-dom'

function Burner() {
    return (
        <div className='burner-content-container'>

            <div className='burder-content'>

                <div className='left-content'>

                    <motion.h1 initial={{opacity: 0, y:-50}} whileInView={{opacity: 1, y:0}} viewport={{once: true}} transition={{duration: .8, delay: .8}}>LETS GET STARTED ON YOUR PROJECT</motion.h1>
                    <NavLink to={"/contact-us"} className="btnGetStarted" initial={{opacity: 0, y:50}} whileInView={{opacity: 1, y:0}} viewport={{once: true}} transition={{duration: .8, delay: .8}}>Get Started</NavLink>

                </div>

                <div className='right-content'>

                    <motion.img initial={{opacity: 0, y:-50}} whileInView={{opacity: 1, y:0}} viewport={{once: true}} transition={{duration: .8, delay: .8}} src={img1} alt="Quantum code services logo" />
                    <motion.span initial={{opacity: 0, x:-50}} whileInView={{opacity: 1, x:0}} viewport={{once: true}} transition={{duration: .8, delay: .8}}>QUANTUM CODE</motion.span>

                </div>

            </div>

        </div>
    )
}

export default Burner
