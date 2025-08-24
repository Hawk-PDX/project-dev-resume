import React from 'react';
import { usePersonalInfo } from '../hooks/useData';

const Footer = () => {
  const { data: personalInfo } = usePersonalInfo();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">
            {personalInfo?.name || 'Garrett Hawkins'}
          </p>
          <div className="flex justify-center space-x-6 mb-4">
            {personalInfo?.email && (
              <a href={`mailto:${personalInfo.email}`} className="text-gray-300 hover:text-white">
                {personalInfo.email}
            </a>
            )}
            {personalInfo?.phone && (
              <span className="text-gray-300">{personalInfo.phone}</span>
            )}
            {personalInfo?.linkedin && (
              <a href={personalInfo.linkedin} className="text-gray-300 hover:text-white">
                LinkedIn
              </a>
            )}
            {personalInfo?.github && (
              <a href={personalInfo.github} className="text-gray-300 hover:text-white">
                GitHub
              </a>
            )}
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 {personalInfo?.name || 'Garrett Hawkins'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
