// Sample resume JSON matching the backend's ResumeIn schema
export const sampleResume = {
  name: "Alex Chen",
  email: "alex.chen@example.com",
  phone: "+12025550100",
  location: {
    country: "US",
    state: "CA",
    city: "San Francisco",
  },
  urls: [
    "https://alexchen.dev",
    "https://github.com/alexchen",
    "https://linkedin.com/in/alexchen",
  ],
  experience: [
    {
      company: "TechCorp Inc.",
      position: ["Senior Software Engineer"],
      start_date: "2021-03-01",
      end_date: null,
      description: [
        "Architected microservices migration reducing latency by 40%",
        "Mentored team of 5 junior developers",
        "Implemented CI/CD pipelines reducing deploy time from 2h to 15min",
      ],
      location: "San Francisco, CA",
    },
    {
      company: "StartupXYZ",
      position: ["Full Stack Developer"],
      start_date: "2018-06-01",
      end_date: "2021-02-01",
      description: [
        "Developed real-time collaboration features using WebSockets",
        "Reduced page load time by 60% through optimization",
        "Led migration from monolith to React frontend",
      ],
      location: "San Francisco, CA",
    },
  ],
  skills: [
    "Python",
    "Node.js",
    "PostgreSQL",
    "Redis",
    "GraphQL",
    "React",
    "TypeScript",
    "Next.js",
    "Tailwind CSS",
    "Docker",
    "Kubernetes",
    "AWS",
  ],
  education: [
    {
      school: "University of California, Berkeley",
      degree: "Bachelor of Science in Computer Science",
      start_date: "2012-09-01",
      graduation_date: "2016-05-01",
      gpa: 3.8,
    },
  ],
}

export const sampleResumeJson = JSON.stringify(sampleResume, null, 2)
