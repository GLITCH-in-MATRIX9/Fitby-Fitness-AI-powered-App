import React from 'react'
import heroBg from '../../assets/herosectionimage.jpg'
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
                    Unlock your true potential with<br />
                    <span className="text-white">Fitness and health guru</span>
                </h1>


                <div className="flex items-center gap-4">
                    <Link to="/ai">
                        <button className="bg-white text-gray-900 font-semibold px-5 py-2 rounded-md hover:bg-gray-200 transition">
                            Try Fitby-AI
                        </button>
                    </Link>
                    <Link to="/diet-plan">
                        <button className="bg-[#c41037] text-white font-semibold px-5 py-2 rounded-md shadow hover:bg-[#a30d2c] transition">
                            Generate Diet Plan
                        </button>
                    </Link>
                    <Link to="/blogs">
                        <button className="bg-white text-gray-900 font-semibold px-5 py-2 rounded-md flex items-center gap-2 shadow hover:bg-gray-100 transition">
                            <span>Read New Blogs</span>
                            <img
                                src={heroBg}
                                alt="blog icon"
                                className="h-6 w-6 rounded-full object-cover"
                            />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
