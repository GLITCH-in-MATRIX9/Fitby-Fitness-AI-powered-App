import React from 'react'
import aiRunner from '../../assets/homepage-runner.png'
import poweredWithAI from '../../assets/powered-with-ai.png'
import healthIcon from '../../assets/icons/health-icon.png'

const WhyFitbySection = () => {
    return (
        <section className="my-16 px-6 md:px-12">
            <h2 className=" text-gray-500 text-center text-2xl font-medium mb-4">Why Fitby</h2>

            {/* Half-width line aligned to the right */}
            <div className="w-1/2 h-px bg-gray-300 ml-[50%] mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

                {/* Left Column */}
                <div className="text-left space-y-4">
                    <h4 className="text-gray-500 text-sm font-semibold">Daily Updates</h4>
                    <p className="text-lg font-medium text-black">
                        Fitby delivers fresh content every day — from personalized workout plans and nutrition tips
                        to wellness challenges and motivational insights — all tailored to keep your fitness journey exciting and consistent.
                    </p>
                </div>

                {/* Middle Column: Card */}
                <div className="bg-orange-500 rounded-xl p-6 text-white text-center space-y-4">

                    {/* Powered with AI Image */}
                    <img
                        src={poweredWithAI}
                        alt="Powered with AI"
                        className="mx-auto h-10 object-contain"
                    />

                    {/* Health & Icon Row */}
                    <div className="flex justify-between items-center">
                        {/* Health Percentage */}
                        <div className="text-left">
                            <p className="text-sm">Health</p>
                            <div className="text-7xl font-normal">
                                87<span className="text-3xl align-bottom">%</span>
                            </div>
                        </div>
                        {/* Health Icon */}
                        <img
                            src={healthIcon}
                            alt="Health Icon"
                            className="h-7 w-7 object-contain self-end"
                        />
                    </div>

                    {/* Daily / Weekly / Monthly */}
                    <div className="flex justify-between text-sm text-white font-medium px-2">
                        <span>Daily</span>
                        <span>Weekly</span>
                        <span>Monthly</span>
                    </div>

                    {/*Runner Image */}
                    <img
                        src={aiRunner}
                        alt="AI powered runner"
                        className="w-full h-full object-cover rounded-md"
                    />
                </div>

                {/* Right Column */}
                <div className="text-left text-gray-700 space-y-3 self-end">
                    <p>
                        Fitby uses intelligent algorithms to understand your goals, track your progress, and adapt your fitness experience in real time.
                        Whether you're a beginner or a seasoned athlete, Fitby helps you train smarter, not harder.
                    </p>
                    <p>
                        With long-term tracking, expert-backed insights, and a seamless interface, Fitby is your ultimate companion for achieving a healthier, more active lifestyle.
                    </p>
                </div>

            </div>

            {/* Half-width line aligned to the left */}
            <div className="w-1/2 h-px bg-gray-300 mr-[50%] mt-8"></div>
        </section>
    )
}

export default WhyFitbySection
