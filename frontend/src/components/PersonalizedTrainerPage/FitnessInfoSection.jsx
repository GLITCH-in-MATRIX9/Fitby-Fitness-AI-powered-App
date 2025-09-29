import React from 'react';
import infoImage from '../../assets/personalized-trainer-info.png';

const FitnessInfoSection = () => {
  return (
    <section className="py-16 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden">
              <img 
                src={infoImage} 
                alt="Personal trainer helping client with plank exercise"
                className="w-full h-full object-cover"
                style={{ height: '100vh' }}
              />
              {/* Orange accent shape */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-orange-500 clip-triangle"></div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Get stronger and fitter with our most experienced trainers
            </h2>
            
            <p className="text-gray-300 mb-8 text-1xl leading-relaxed">
              Transform your fitness journey with our certified personal trainers who bring years of 
              expertise and passion. Whether you're a beginner or an advanced athlete, our trainers 
              create personalized workout plans tailored to your goals and fitness level.
            </p>

            {/* Progress Bars */}
            <div className="space-y-6">
              {/* Fitness Training */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">Fitness Training</span>
                  <span className="text-white font-medium">94%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: '94%' }}
                  ></div>
                </div>
              </div>

              {/* Cardio Training */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">Cardio Training</span>
                  <span className="text-white font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: '85%' }}
                  ></div>
                </div>
              </div>

              {/* Body Building */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">Body Building</span>
                  <span className="text-white font-medium">89%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: '89%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .clip-triangle {
          clip-path: polygon(0 0, 100% 0, 0 100%);
        }
      `}</style>
    </section>
  );
};

export default FitnessInfoSection;
