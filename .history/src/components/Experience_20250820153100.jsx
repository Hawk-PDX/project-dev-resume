import React from 'react';
import { useExperience } from '../hooks/useData';

const Experience = () => {
  const { data: experiences, loading } = useExperience();

  if (loading) return <div className="py-20 text-center">Loading experience...</div>;

  return (
    <section id="experience" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Experience</h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            My professional journey and key achievements
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-8 bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-indigo-600 font-medium">{exp.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">
                    {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{exp.description}</p>
              
              {exp.technologies && (
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">Technologies:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {exp.technologies.split(',').map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {exp.achievements && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Key Achievements:</span>
                  <div className="mt-2 text-gray-600 whitespace-pre-line">
                    {exp.achievements}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
