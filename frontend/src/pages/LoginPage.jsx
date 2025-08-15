import React, { useState } from 'react';
import loginImage from '../assets/login.jpg';
import LoginForm from '../components/LoginPage/LoginForm';
import SignUpForm from '../components/LoginPage/SignUpForm';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Column: Login / Sign Up */}
      <div className="flex-1 overflow-y-auto flex justify-center items-center px-6">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm switchToSignUp={() => setIsLogin(false)} />
          ) : (
            <SignUpForm switchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>

      {/* Right Column: Image */}
      <div className="hidden lg:block flex-1 h-full">
        <img
          src={loginImage}
          alt="Auth Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
