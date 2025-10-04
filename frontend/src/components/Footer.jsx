import React from 'react'
import { FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa'
import logo1 from '../assets/logo.png'
import logo2 from '../assets/FITBY.png'


const Footer = () => {
  return (
    <footer className="bg-white text-black px-6 py-10 mt-20 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Logo & Description */}
        {/* Logo & Description with Images */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img src={logo1} alt="Logo 1" className="h-10 w-10 object-contain" />
            <img src={logo2} alt="Logo 2" className="h-10 object-contain" />
          </div>
          <p className="text-gray-600 text-sm">
            Your personal AI fitness coach, workout planner, and health tracker — all in one smart platform.
          </p>
        </div>


        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/about" className="hover:text-white">About</a></li>
            <li><a href="/blogs" className="hover:text-white">Blogs</a></li>
            <li><a href="/genderpage" className="hover:text-white">Workout Plans</a></li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect with us</h3>
          <div className="flex gap-4 text-xl text-gray-600">
            <a href="#"><FaInstagram className="hover:text-white transition" /></a>
            <a href="#"><FaTwitter className="hover:text-white transition" /></a>
            <a href="#"><FaFacebookF className="hover:text-white transition" /></a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} Fitby. All rights reserved.
        <div className="mt-2">
          Made with <span className="text-red-500">❤️</span> by Anjali Dass , Diya Arora , Dakshita Agarwal, Aakshi Mehta
        </div>
      </div>

    </footer>
  )
}

export default Footer
