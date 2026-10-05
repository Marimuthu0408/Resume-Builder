import { ResumeData } from '../types/resume';

export const SAMPLE_RESUME_ENGINEER: ResumeData = {
  id: 'resume-sde-sample',
  title: 'Full Stack Software Engineer',
  updatedAt: new Date().toISOString(),
  personal: {
    fullName: 'Aarav Sharma',
    jobTitle: 'Senior Full Stack Engineer',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    website: 'https://aaravsharma.dev',
    linkedin: 'linkedin.com/in/aaravsharma-dev',
    github: 'github.com/aaravsharma',
    photoUrl: '',
    summary: 'High-impact Software Engineer with 5+ years of experience architecting distributed cloud systems, modern React frontends, and scalable Node.js microservices. Proven record reducing latency by 42% and driving revenue growth across fintech and SaaS platforms.'
  },
  experiences: [
    {
      id: 'exp-1',
      jobTitle: 'Lead Software Engineer',
      company: 'RazorPay Technologies',
      location: 'Bengaluru, India',
      startDate: '2023-01',
      endDate: '',
      isCurrent: true,
      highlights: [
        'Architected high-throughput payment settlement microservices processing 12M+ daily transactions with 99.99% system availability.',
        'Engineered real-time reconciliation engine using Kafka and Go, shrinking settlement processing cycles from 4 hours to 12 minutes.',
        'Mentored a cross-functional team of 8 engineers, instituting rigorous TypeScript coding standards and CI/CD automated test suites.'
      ]
    },
    {
      id: 'exp-2',
      jobTitle: 'Full Stack Developer',
      company: 'Flipkart Internet',
      location: 'Bengaluru, India',
      startDate: '2021-06',
      endDate: '2022-12',
      isCurrent: false,
      highlights: [
        'Built responsive checkout and product listing surfaces in React and Next.js, elevating mobile conversion rates by 18.5%.',
        'Implemented Redis distributed caching layer and query optimization, dropping P99 API latency from 450ms down to 85ms.',
        'Authored reusable UI design system component library adopted across 4 major product engineering divisions.'
      ]
    },
    {
      id: 'exp-3',
      jobTitle: 'Software Engineer',
      company: 'Zomato Media',
      location: 'Gurugram, India',
      startDate: '2019-07',
      endDate: '2021-05',
      isCurrent: false,
      highlights: [
        'Developed real-time order tracking WebSocket services supporting 250,000 concurrent delivery partner connections.',
        'Migrated legacy monolithic endpoints to containerized Docker services orchestrated with Kubernetes on AWS.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Technology (B.Tech)',
      fieldOfStudy: 'Computer Science and Engineering',
      institution: 'Indian Institute of Technology (IIT) Delhi',
      location: 'New Delhi, India',
      startDate: '2015-08',
      endDate: '2019-05',
      score: '8.9 / 10.0 CGPA'
    }
  ],
  skills: [
    { id: 'sk-1', name: 'TypeScript / JavaScript', category: 'technical', level: 5 },
    { id: 'sk-2', name: 'React.js & Next.js', category: 'technical', level: 5 },
    { id: 'sk-3', name: 'Node.js & Express', category: 'technical', level: 5 },
    { id: 'sk-4', name: 'Golang & Microservices', category: 'technical', level: 4 },
    { id: 'sk-5', name: 'PostgreSQL & Redis', category: 'technical', level: 5 },
    { id: 'sk-6', name: 'Docker & Kubernetes', category: 'tools', level: 4 },
    { id: 'sk-7', name: 'AWS & Cloud Architecture', category: 'tools', level: 4 },
    { id: 'sk-8', name: 'System Design & Distributed Systems', category: 'soft', level: 5 },
    { id: 'sk-9', name: 'Agile Team Mentorship', category: 'soft', level: 4 }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Distributed Event-Driven Task Broker',
      description: 'Fault-tolerant message queue built in Go with Raft consensus protocol, processing 50k msgs/sec with persistent disk write-ahead logs.',
      techStack: ['Go', 'gRPC', 'Raft Consensus', 'Docker'],
      link: 'https://github.com/aaravsharma/task-broker',
      github: 'github.com/aaravsharma/task-broker'
    },
    {
      id: 'proj-2',
      title: 'DevPulse - Open Source API Observability Platform',
      description: 'Distributed tracing dashboard collecting metrics across Node.js microservices with real-time anomaly alerts and interactive flame graphs.',
      techStack: ['React', 'TypeScript', 'ClickHouse', 'TailwindCSS'],
      link: 'https://devpulse-demo.dev',
      github: 'github.com/aaravsharma/devpulse'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2023-04',
      credentialUrl: 'aws.amazon.com/verify/credential-89234'
    },
    {
      id: 'cert-2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation (CNCF)',
      issueDate: '2022-10',
      credentialUrl: 'cncf.io/verify/cka-582910'
    }
  ],
  languages: [
    { id: 'lang-1', name: 'English', proficiency: 'Fluent' },
    { id: 'lang-2', name: 'Hindi', proficiency: 'Native' }
  ],
  customSections: [
    {
      id: 'custom-1',
      title: 'Honors & Achievements',
      items: [
        {
          id: 'item-1',
          title: '1st Place Winner - National Smart India Hackathon',
          subtitle: 'Ministry of Education & Tech Giants',
          date: '2019',
          description: 'Awarded first prize out of 1,200 participating teams for building an AI-powered emergency dispatch system.'
        },
        {
          id: 'item-2',
          title: 'Top Performer Award 2023',
          subtitle: 'RazorPay Annual Tech Summit',
          date: '2023',
          description: 'Recognized for zero-downtime Diwali festival surge handling supporting ₹800+ Crore in daily merchant payments.'
        }
      ]
    }
  ],
  design: {
    templateId: 'modern',
    colorTheme: '#1E40AF',
    fontId: 'sans',
    fontSize: 'base',
    lineSpacing: 'normal',
    margins: 'normal',
    showPhoto: false,
    photoStyle: 'rounded',
    sectionOrder: ['personal', 'experiences', 'education', 'skills', 'projects', 'certifications', 'languages', 'custom']
  }
};

export const AI_BULLET_SUGGESTIONS: Record<string, string[]> = {
  'Software & IT': [
    'Engineered high-throughput REST and GraphQL endpoints servicing 1M+ daily active requests with sub-100ms response times.',
    'Reduced cloud infrastructure compute expenditures by 34% by optimizing Docker containers and migrating to auto-scaling serverless workflows.',
    'Implemented comprehensive unit and end-to-end test automation with Jest and Cypress, elevating test coverage from 45% to 92%.',
    'Spearheaded database indexing and query restructuring in PostgreSQL, cutting query execution times by 68%.',
    'Collaborated with product managers and UX designers in two-week agile sprints to ship 6 major customer-facing features on schedule.'
  ],
  'Product & Design': [
    'Conducted 40+ user research interviews and usability tests to identify friction points, driving a 24% uplift in onboarding completion.',
    'Crafted end-to-end design system tokens and Figma components reducing design-to-development turnaround from 3 weeks to 4 days.',
    'Defined product roadmap and North Star metrics, aligning cross-functional teams across engineering, marketing, and customer success.',
    'Launched A/B pricing experiment resulting in a ₹1.4M ARR incremental increase within the first fiscal quarter.'
  ],
  'Business & Marketing': [
    'Spearheaded organic SEO and technical content strategy, increasing search impressions by 140% and inbound leads by 55%.',
    'Managed paid acquisition campaigns across Meta and Google Ads with a ₹15 Lakh monthly budget, achieving a 4.2x ROAS.',
    'Orchestrated automated email nurturing workflows in HubSpot, recovering 22% of abandoned signups.',
    'Negotiated partnerships with 15 Tier-1 regional vendors, expanding brand reach to 250,000+ new verified users.'
  ],
  'Data Science & Analytics': [
    'Trained and deployed XGBoost customer churn prediction models with 88% precision, identifying at-risk accounts 60 days in advance.',
    'Constructed automated ETL data pipelines in Apache Airflow aggregating 45GB of daily transactional records into Snowflake.',
    'Designed executive PowerBI and Tableau dashboards tracking real-time KPI metrics for C-level leadership.',
    'Formulated customer segmentation algorithms in Python (Pandas, Scikit-learn), improving targeted campaign conversions by 31%.'
  ]
};

export const POPULAR_SKILLS = [
  'JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Node.js',
  'Python', 'Java', 'C++', 'SQL', 'PostgreSQL',
  'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'Git',
  'TailwindCSS', 'Figma', 'System Design', 'REST APIs', 'Agile'
];
