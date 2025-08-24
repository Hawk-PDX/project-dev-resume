
import React from 'react';
import { useProjects } from '../hooks/useData';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const Projects = () => {
  const { data: projects, loading } = useProjects();

  if (loading) return <div className="py-20 text-center">Loading projects...</div>;

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and experience:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-xl font-bold">{project.title}</span>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">Technologies:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies?.split(',').map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      className="flex items-center text-gray-600 hover:text-indigo-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GithubIcon className="h-5 w-5 mr-1" />
                      Code
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      className="flex items-center text-gray-600 hover:text-indigo-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-1" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
