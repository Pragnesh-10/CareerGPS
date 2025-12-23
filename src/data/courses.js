export const courses = {
    'Data Scientist': {
        beginner: [
            { title: 'Python for Data Science', platform: 'Coursera', duration: '20h', rating: 4.8, outcome: 'Python Basics, Pandas, NumPy', link: 'https://www.coursera.org/learn/python-for-applied-data-science-ai' },
            { title: 'Intro to SQL', platform: 'Udemy', duration: '12h', rating: 4.6, outcome: 'Querying Databases', link: 'https://www.udemy.com/course/the-complete-sql-bootcamp/' },
            { title: 'Statistics 101', platform: 'Udacity', duration: '15h', rating: 4.7, outcome: 'Probability & Distributions', link: 'https://www.udacity.com/course/intro-to-statistics--st101' }
        ],
        intermediate: [
            { title: 'Machine Learning A-Z', platform: 'Udemy', duration: '40h', rating: 4.8, outcome: 'Regression, Classification, Clustering', link: 'https://www.udemy.com/course/machinelearning/' },
            { title: 'Data Visualization with Tableau', platform: 'Coursera', duration: '25h', rating: 4.5, outcome: 'Dashboards & Storytelling', link: 'https://www.coursera.org/specializations/data-visualization' }
        ],
        advanced: [
            { title: 'Deep Learning Specialization', platform: 'Coursera', duration: '60h', rating: 4.9, outcome: 'Neural Networks, CNNs, RNNs', link: 'https://www.coursera.org/specializations/deep-learning' },
            { title: 'MLOps: Model Deployment', platform: 'Udacity', duration: '30h', rating: 4.7, outcome: 'Productionizing ML Models', link: 'https://www.udacity.com/course/machine-learning-dev-ops-engineer-nanodegree--nd0821' }
        ]
    },
    'Backend Developer': {
        beginner: [
            { title: 'Node.js Basics', platform: 'Udemy', duration: '15h', rating: 4.7, outcome: 'Express, REST APIs', link: 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/' },
            { title: 'Database Design', platform: 'Coursera', duration: '20h', rating: 4.5, outcome: 'SQL, NoSQL, Schema Design', link: 'https://www.coursera.org/learn/database-management' }
        ],
        intermediate: [
            { title: 'Advanced Backend Architecture', platform: 'Udacity', duration: '35h', rating: 4.8, outcome: 'Microservices, Caching, Queues', link: 'https://www.udacity.com/course/cloud-native-application-architecture-nanodegree--nd063' }
        ],
        advanced: [
            { title: 'System Design Interview', platform: 'Udemy', duration: '20h', rating: 4.9, outcome: 'Scalability, Load Balancing', link: 'https://www.udemy.com/course/system-design-interview-prep/' }
        ]
    },
    // Default fallback for other domains
    'default': {
        beginner: [
            { title: 'Domain Fundamentals', platform: 'Coursera', duration: '10h', rating: 4.5, outcome: 'Core Concepts', link: 'https://www.coursera.org/' }
        ],
        intermediate: [
            { title: 'Practical Application', platform: 'Udemy', duration: '20h', rating: 4.6, outcome: 'Real-world Projects', link: 'https://www.udemy.com/' }
        ],
        advanced: [
            { title: 'Mastery & Leadership', platform: 'Udacity', duration: '30h', rating: 4.8, outcome: 'Expert Level Skills', link: 'https://www.udacity.com/' }
        ]
    }
};
