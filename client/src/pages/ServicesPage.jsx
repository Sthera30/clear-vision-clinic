import React from 'react'
import { Helmet } from 'react-helmet'


function ServicesPage() {
    return (
        <div>

            <Helmet>

                <title>Web Development Services | Quantum Code</title>
                <meta
                    name="description"
                    content="Professional web development services including custom website design, e-commerce solutions, and SEO optimization. Transform your online presence with Quantum Code."
                />
                <meta
                    name="keywords"
                    content="web development services, custom website design, e-commerce development, SEO optimization, South Africa web developer"
                />

                {/* Additional recommended tags */}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="canonical" href="https://www.quantumcode.com/services" />

                {/* Open Graph tags */}
                <meta property="og:title" content="Web Development Services | Quantum Code" />
                <meta property="og:description" content="Professional web development services including custom website design, e-commerce solutions, and SEO optimization. Transform your online presence with Quantum Code." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.quantumcode.com/services" />
                <meta property="og:image" content={`https://www.quantumcode.com/${img1.src}`} />

                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Web Development Services | Quantum Code" />
                <meta name="twitter:description" content="Professional web development services including custom website design, e-commerce solutions, and SEO optimization. Transform your online presence with Quantum Code." />
                <meta name="twitter:image" content={`https://www.quantumcode.com/${img2.src}`} />

            </Helmet>


        </div>
    )
}

export default ServicesPage
