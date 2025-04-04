import React, { useEffect, useState } from 'react'
import '../css/ourServices.css'
import { motion } from 'framer-motion'
import Services from '../components/Services.jsx'
import Burner from './Burner.jsx'
import Service from './Service.jsx'


const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (

    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button
        className="faq-question"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <svg
          className="faq-arrow"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
};


function OurServices() {


  const faqData = [
    {
      question: "How long does it take to complete a website design?",
      answer: "Our typical website design process takes 3-4 weeks depending on the project scope and complexity."
    },
    {
      question: "What technologies do you use to build websites?",
      answer: "Our web applications are built with a robust, modern technology stack: For Frontend we use React js which is a powerful JavaScript library for building responsive and dynamic user interfaces. For backend we use Node.js - An efficient, event-driven JavaScript runtime for scalable server-side applications. For database we use MySQL - A reliable, high-performance relational database management system for secure data storage and retrieval"
    },
    {
      question: "How do we make payments for the website design?",
      answer: "We operate on a straightforward 50/50 payment structure to ensure mutual commitment and satisfaction. A 50% deposit is required upfront to secure your project in our schedule and begin the design process. The remaining 50% is due upon project completion, before the website goes live."
    },

  ];



  useEffect(() => {

    window.scrollTo(0, 0)

  }, [])


  return (


    <>
      <div className='service-burner'>

        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: '.8', delay: '.7' }} className='service-burner-inner'>

          <h1>SERVICES</h1>

        </motion.div>

      </div>

      <Services />
      <Service />


      <div className='burner-questions-container'>

        <div className='burner-questions-inner'>

          <h1>Frequently Asked Questions</h1>

        </div>


        <div className="faq-list">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <FAQItem question={faq.question} answer={faq.answer} />
            </motion.div>
          ))}
        </div>


      </div>








      <Burner />

    </>

  )
}

export default OurServices
