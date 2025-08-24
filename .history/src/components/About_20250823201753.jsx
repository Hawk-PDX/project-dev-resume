import React from 'react';
import { usePersonalInfo } from '../hooks/useData';

const About = () => {
  const { data: personalInfo, loading } = usePersonalInfo();

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Me</h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-600 leading-relaxed">
            {personalInfo?.summary || 'Full-stack developer passionate about creating innovative solutions while streamlining production, cutting back on "clutter" and maintaining a responsive, well-rounded, product.'}
          </p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Email:</strong> {personalInfo?.email || 'hawkpdx@icloud.com'}</p>
                <p><strong>Location:</strong> {personalInfo?.location || 'Portland, Oregon'}</p>
                <p><strong>Phone:</strong> {personalInfo?.phone || '+1 (971) 438-6340'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect With Me</h3>
              <div className="space-y-2">
                {personalInfo?.github && (
                  <a href={personalInfo.github} className="text-indigo-600 hover:text-indigo-800 block">
                    GitHub Profile
                  </a>
                )}
                {personalInfo?.linkedin && (
                  <a href={personalInfo.linkedin} className="text-indigo-600 hover:text-indigo-800 block">
                    LinkedIn Profile
                  </a>
                )}
                {personalInfo?.website && (
                  <a href={personalInfo.website} className="text-indigo-600 hover:text-indigo-800 block">
                    Personal Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
