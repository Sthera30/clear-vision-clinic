import React, { useEffect, useRef, useState } from 'react'
import '../css/article.css'
import img1 from '../../public/resizecom_craftsman-looking-inspiration-model-laptop-trying-find-design-craft-handmade-clothing-collection-male-tailor-manufacturing-fashion-line-checking-sketches-workshop.jpg'
import { motion } from 'framer-motion'
import { FaUser, FaArrowDown } from 'react-icons/fa'
import { Calendar } from 'lucide-react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { marked } from 'marked'
import DOMPurify from "dompurify";
import axios from 'axios'





const Article = () => {

    const [article, setArticle] = useState(null)
    const { slug } = useParams()
    const [processedContent, setProcessedContent] = useState('');




    async function handle_fetch() {

        try {

            const res = await axios.get(`http://localhost:1337/api/articles?filters[slug][$eq]=${slug}&populate=*`)

            if (res.data.data.length > 0) {
                setArticle(res.data.data[0]);
                console.log(res.data.data[0]);
                // Process the content when it's available
                if (res.data.data[0]?.blocks?.[0]?.body) {
                    processMarkdownContent(res.data.data[0].blocks[0].body);
                }
            }

            else {
                console.log('error baba!');

            }

        } catch (error) {
            console.log(error);
        }

    }


    // Process markdown to add IDs to headings
    const processMarkdownContent = (markdown) => {
        if (!markdown) return;

        // Add explicit IDs to all headings
        let processedMarkdown = markdown;

        // Add IDs to h1, h2, etc. headings
        const headingRegex = /^(#{1,6})\s+(.+)$/gm;
        processedMarkdown = processedMarkdown.replace(headingRegex, (match, hashes, title) => {
            const id = title.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');

            // Special case for specific headings we know from the error messages
            if (title.trim() === 'Introduction') {
                return `${hashes} <a id="introduction"></a>${title}`;
            }

            if (title.trim() === 'Reliability and Performance') {
                return `${hashes} <a id="reliability-performance"></a>${title}`;
            }

            if (title.trim() === 'Customer Support') {
                return `${hashes} <a id="customer-support"></a>${title}`;
            }

            if (title.trim() === 'Pricing and Value') {
                return `${hashes} <a id="pricing-value"></a>${title}`;
            }

            if (title.trim() === 'Security Features') {
                return `${hashes} <a id="security-features"></a>${title}`;
            }

            if (title.trim() === 'Local Hosting for South African Businesses') {
                return `${hashes} <a id="local-hosting-south-african-businesses"></a>${title}`;
            }

            if (title.trim() === 'Easy to Use and Manage') {
                return `${hashes} <a id="easy-to-use-manage"></a>${title}`;
            }

            if (title.trim() === 'Conclusion') {
                return `${hashes} <a id="conclusion"></a>${title}`;
            }

            if (title.trim() === 'Why Every Business Needs a Website in 2025') {
                return `${hashes} <a id="business-needs-website"></a>${title}`;
            }

            if (title.trim() === 'How a Website Improves Customer Engagement') {
                return `${hashes} <a id="website-customer-engagement"></a>${title}`;
            }

            if (title.trim() === 'The Role of a Website in Strengthening Your Brand Identity') {
                return `${hashes} <a id="website-brand-identity"></a>${title}`;
            }

            if (title.trim() === 'Why a Website is More Cost-Effective Than Traditional Advertising') {
                return `${hashes} <a id="website-cost-effective"></a>${title}`;
            }

            if (title.trim() === 'The Power of Content Marketing: How Your Website Can Drive Growth') {
                return `${hashes} <a id="content-marketing-growth"></a>${title}`;
            }

            if (title.trim() === 'How Website Analytics Help You Make Smarter Business Decisions') {
                return `${hashes} <a id="website-analytics"></a>${title}`;
            }

            if (title.trim() === 'Why a Website is Essential for Competing in Today’s Digital Market') {
                return `${hashes} <a id="competing-digital-market"></a>${title}`;
            }


            // Generic case for other headings
            return `${hashes} <a id="${id}"></a>${title}`;
        });

        // Set the processed content
        setProcessedContent(processedMarkdown);
    };

    useEffect(() => {

        handle_fetch()
        window.scrollTo(0, 0)

    }, [slug])


    // Function to handle anchor clicks
    const handleAnchorClick = (e) => {
        // Check if the clicked element is an anchor link
        const target = e.target;
        if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
            e.preventDefault();

            // Get the ID from the href
            const id = target.getAttribute('href').substring(1);
            console.log("Scrolling to:", id);

            // Find the element with that ID
            const element = document.getElementById(id) || document.querySelector(`a[id="${id}"]`);

            // If element exists, scroll to it
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.log("Element not found:", id);
                // As a fallback, try to find by element with the matching text
                const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                for (const heading of headings) {
                    const headingId = heading.textContent.toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-');
                    if (headingId === id) {
                        heading.scrollIntoView({ behavior: 'smooth' });
                        break;
                    }
                }
            }
        }
    };

    return (

        <>

            <div className='article-burner' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-6rem', height: '40rem' }}>

                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: '.8', delay: '.7' }} className='article-burner-inner'>

                    <h1 style={{ fontSize: '3.5rem', maxWidth: '45rem', textAlign: 'center', display: 'flex', alignItems: 'center' }}>{article?.title}</h1>

                </motion.div>


            </div>



            <div className='article-container'>

                <div className='article-content'>

                    <img src={`http://localhost:1337${article?.cover?.url}`} alt={article?.cover?.alternativeText} title={article?.cover?.caption} loading='lazy' />
                    <div className='article-content-desc'>

                        <h1>{article?.title}</h1>
                        <p>{article?.description}</p>

                    </div>

                    <div
                        className='table-contents'
                        onClick={handleAnchorClick}  // Add click handler here
                    >

                        <div
                            dangerouslySetInnerHTML={{
                                __html: processedContent ? marked(processedContent) : "",
                            }}
                        />

                    </div>

                    <div className='article-inner-content'>

                        <p><FaUser />&nbsp;{article?.author?.name}</p>
                        <p><Calendar />&nbsp;

                        {new Date(article?.createdAt).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                        </p>

                    </div>


                </div>



            </div>


        </>




    )
}

export default Article
