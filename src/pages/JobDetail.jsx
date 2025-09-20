import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import Navbar from '../components/Navbar'

const jobsData = {
  '1': { 
    id: '1', 
    title: 'Senior Frontend Engineer', 
    company: 'TechCorp', 
    location: 'Remote', 
    salary: '$90k - $120k',
    type: 'Full-time',
    experience: '3-5 years',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    description: 'We are looking for a talented Frontend Engineer to join our team and help build amazing user experiences.',
    requirements: [
      '3+ years of experience with React and modern JavaScript',
      'Strong understanding of TypeScript',
      'Experience with CSS frameworks like Tailwind CSS',
      'Knowledge of Next.js or similar frameworks',
      'Experience with version control (Git)',
      'Strong problem-solving skills'
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      'Flexible work arrangements',
      'Professional development budget',
      'Team building events',
      '401(k) matching'
    ],
    posted: '2 days ago',
    applicants: 45
  },
  '2': { 
    id: '2', 
    title: 'Backend Developer', 
    company: 'FinTech Solutions', 
    location: 'New York, NY', 
    salary: '$100k - $140k',
    type: 'Full-time',
    experience: '2-4 years',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'AWS'],
    description: 'Join our backend team to build scalable APIs and microservices for our financial platform.',
    requirements: [
      '2+ years of backend development experience',
      'Proficiency in Node.js and Python',
      'Experience with PostgreSQL or similar databases',
      'Knowledge of AWS cloud services',
      'Understanding of RESTful API design',
      'Experience with microservices architecture'
    ],
    benefits: [
      'Competitive salary package',
      'Comprehensive health coverage',
      'Remote work options',
      'Learning and development opportunities',
      'Stock options',
      'Flexible PTO policy'
    ],
    posted: '1 week ago',
    applicants: 32
  },
  '3': { 
    id: '3', 
    title: 'Product Designer', 
    company: 'Design Studio', 
    location: 'San Francisco, CA', 
    salary: '$110k - $150k',
    type: 'Full-time',
    experience: '4-6 years',
    skills: ['Figma', 'Sketch', 'User Research', 'Prototyping'],
    description: 'Create beautiful and intuitive user experiences for our design-focused products.',
    requirements: [
      '4+ years of product design experience',
      'Proficiency in Figma and Sketch',
      'Strong user research skills',
      'Experience with prototyping tools',
      'Portfolio demonstrating design thinking',
      'Collaboration skills with cross-functional teams'
    ],
    benefits: [
      'Competitive salary and benefits',
      'Health and wellness programs',
      'Design conference attendance',
      'Latest design tools and software',
      'Creative work environment',
      'Career growth opportunities'
    ],
    posted: '3 days ago',
    applicants: 28
  }
}

export default function JobDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [applying, setApplying] = useState(false)
  const job = jobsData[id]

  if(!job) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="text-center p-8">
        <CardContent>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/jobs')} className="bg-blue-600 hover:bg-blue-700 text-white">
            Browse All Jobs
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const handleApply = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please log in to apply for this job')
      navigate('/')
      return
    }
    
    setApplying(true)
    // Simulate application process
    setTimeout(() => {
      setApplying(false)
      alert('Application submitted successfully!')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="mb-6"
          >
            ← Back to Jobs
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Job Content */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-blue-100 mt-2">
                    <span className="font-medium">{job.company}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Job Overview */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Overview</h3>
                      <p className="text-gray-700 leading-relaxed">{job.description}</p>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                      <ul className="space-y-2">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits & Perks</h3>
                      <ul className="space-y-2">
                        {job.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Apply for this position</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">{job.salary}</div>
                    <div className="text-sm text-gray-500">{job.experience}</div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Posted:</span>
                      <span>{job.posted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Applicants:</span>
                      <span>{job.applicants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{job.type}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {applying ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Applying...</span>
                      </div>
                    ) : (
                      'Apply Now'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Skills Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Company Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">About {job.company}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm mb-4">
                    Learn more about {job.company} and their mission to build innovative solutions.
                  </p>
                  <Button 
                    onClick={() => navigate('/companies')}
                    variant="outline"
                    className="w-full"
                  >
                    View Company
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
