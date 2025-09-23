// Fallback data to use when API is slow/unavailable
// This ensures your site always shows content even when backend is down

export const fallbackPersonalInfo = {
    name: 'Garrett Hawkins',
    title: 'Full Stack Developer',
    email: 'hawkpdx@icloud.com',
    phone: null, // No phone number in deployment
    location: 'Portland, Oregon',
    linkedin: 'https://linkedin.com/in/hawkpdx',
    github: 'https://github.com/HawkPDX',
    website: 'https://rosecitydev.tech',
    summary: 'Passionate full-stack developer with expertise in React, Python, and Flask. Experienced in building scalable web applications and passionate about clean code and user experience.'
};

export const fallbackProjects = [
    {
        id: 1,
        title: 'FS Software Developer Portfolio',
        description: 'Resume template for aspiring full-stack software developers',
        technologies: 'JavaScript, React, Python, Flask, PostgreSQL',
        github_url: 'https://github.com/Hawk-PDX/project-dev-resume.git',
        live_url: '',
        image_url: '',
        featured: true,
        order: 1
    },
    {
        id: 2,
        title: 'PDX Underground',
        description: 'Python CLI-based RPG',
        technologies: 'Python',
        github_url: 'https://github.com/Hawk-PDX/python_final_project.git',
        live_url: '',
        image_url: '',
        featured: true,
        order: 2
    }
];

export const fallbackSkills = {
    frontend: [
        { name: 'React', level: 5, category: 'frontend' },
        { name: 'JavaScript', level: 5, category: 'frontend' },
        { name: 'TypeScript', level: 4, category: 'frontend' },
        { name: 'HTML5', level: 5, category: 'frontend' },
        { name: 'CSS3', level: 5, category: 'frontend' },
        { name: 'Tailwind CSS', level: 4, category: 'frontend' },
        { name: 'Vue.js', level: 3, category: 'frontend' }
    ],
    backend: [
        { name: 'Python', level: 5, category: 'backend' },
        { name: 'Flask', level: 5, category: 'backend' },
        { name: 'Django', level: 3, category: 'backend' },
        { name: 'Node.js', level: 4, category: 'backend' },
        { name: 'Express', level: 4, category: 'backend' },
        { name: 'RESTful APIs', level: 5, category: 'backend' }
    ],
    database: [
        { name: 'PostgreSQL', level: 4, category: 'database' },
        { name: 'MySQL', level: 4, category: 'database' },
        { name: 'MongoDB', level: 3, category: 'database' },
        { name: 'Redis', level: 3, category: 'database' },
        { name: 'SQLite', level: 5, category: 'database' }
    ],
    tools: [
        { name: 'Git', level: 5, category: 'tools' },
        { name: 'AWS', level: 3, category: 'tools' },
        { name: 'Linux', level: 4, category: 'tools' },
        { name: 'CI/CD', level: 4, category: 'tools' }
    ]
};

export const fallbackCertificates = [
    {
        id: 1,
        entity: 'Udemy',
        course: 'React Development',
        topics: 'React, JavaScript',
        description: 'Advanced React development course covering modern React patterns and best practices.',
        credit_hrs: null,
        issue_date: '2024-01-15',
        expiry_date: null,
        credential_id: 'XYZ789',
        credential_url: null
    }
];
