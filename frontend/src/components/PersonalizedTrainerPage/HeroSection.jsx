import React from 'react'
import heroBg from '../../assets/personalized-trainer-hero.png'
import { Link } from 'react-router-dom'

const HeroSection = () => {
    return (
        <section
            className="relative w-full h-[600px] bg-cover bg-center rounded-xl overflow-hidden text-white"
            style={{ backgroundImage: `url(${heroBg})` }}
        >
            {/* Overlay (optional for contrast) */}
            <div className="absolute inset-0 bg-opacity-40"></div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end px-8 py-8 lg:px-16 max-w-4xl">
                <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4 text-shadow-md">
                    Meet your perfect fitness coach
                </h1>
            </div>
        </section>
    )
}

export default HeroSection
