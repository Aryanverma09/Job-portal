import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import Navbar from '../components/Navbar'

const jobsData = [
  { 
    id: '1', 
    title: 'Senior Frontend Engineer', 
    company: 'TechCorp', 
    location: 'Remote', 
    salary: '$90k - $120k',
    type: 'Full-time',
    experience: '3-5 years',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    description: 'We are looking for a talented Frontend Engineer to join our team and help build amazing user experiences.',
    posted: '2 days ago',
    applicants: 45
  },
  { 
    id: '2', 
    title: 'Backend Developer', 
    company: 'FinTech Solutions', 
    location: 'New York, NY', 
    salary: '$100k - $140k',
    type: 'Full-time',
    experience: '2-4 years',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'AWS'],
    description: 'Join our backend team to build scalable APIs and microservices for our financial platform.',
    posted: '1 week ago',
    applicants: 32
  },
  { 
    id: '3', 
    title: 'Product Designer', 
    company: 'Design Studio', 
    location: 'San Francisco, CA', 
    salary: '$110k - $150k',
    type: 'Full-time',
    experience: '4-6 years',
    skills: ['Figma', 'Sketch', 'User Research', 'Prototyping'],
    description: 'Create beautiful and intuitive user experiences for our design-focused products.',
    posted: '3 days ago',
    applicants: 28
  },
  { 
    id: '4', 
    title: 'Full Stack Developer', 
    company: 'StartupXYZ', 
    location: 'Austin, TX', 
    salary: '$85k - $115k',
    type: 'Full-time',
    experience: '2-3 years',
    skills: ['React', 'Node.js', 'MongoDB', 'Express'],
    description: 'Work on both frontend and backend development for our growing startup.',
    posted: '5 days ago',
    applicants: 67
  },
  { 
    id: '5', 
    title: 'DevOps Engineer', 
    company: 'CloudTech', 
    location: 'Seattle, WA', 
    salary: '$120k - $160k',
    type: 'Full-time',
    experience: '3-5 years',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
    description: 'Manage our cloud infrastructure and deployment pipelines.',
    posted: '1 day ago',
    applicants: 23
  },
  { 
    id: '6', 
    title: 'Data Scientist', 
    company: 'AI Innovations', 
    location: 'Boston, MA', 
    salary: '$130k - $170k',
    type: 'Full-time',
    experience: '4-6 years',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
    description: 'Build machine learning models and data pipelines for our AI products.',
    posted: '4 days ago',
    applicants: 41
  }
]

export default function Jobs() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterLocation, setFilterLocation] = useState('all')
  const [filteredJobs, setFilteredJobs] = useState(jobsData)

  useEffect(() => {
    let filtered = jobsData

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(job => job.type === filterType)
    }

    if (filterLocation !== 'all') {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filterLocation.toLowerCase())
      )
    }

    setFilteredJobs(filtered)
  }, [searchTerm, filterType, filterLocation])

  const handleApply = (jobId) => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please log in to apply for jobs')
      navigate('/')
      return
    }
    
    // In a real app, this would make an API call to apply
    alert('Application submitted successfully!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
            <p className="text-lg text-gray-600">Discover opportunities that match your skills and passion</p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Jobs</label>
                  <Input
                    type="text"
                    placeholder="Job title, company, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Locations</option>
                    <option value="remote">Remote</option>
                    <option value="new york">New York</option>
                    <option value="san francisco">San Francisco</option>
                    <option value="austin">Austin</option>
                    <option value="seattle">Seattle</option>
                    <option value="boston">Boston</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchTerm('')
                      setFilterType('all')
                      setFilterLocation('all')
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredJobs.length} of {jobsData.length} jobs
            </p>
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-xl transition-shadow duration-300 bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                        {job.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <span className="font-medium">{job.company}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{job.type}</span>
                        <span>•</span>
                        <span>{job.experience}</span>
                        <span>•</span>
                        <span>{job.posted}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{job.salary}</div>
                      <div className="text-sm text-gray-500">{job.applicants} applicants</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{job.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      variant="outline"
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    <Button 
                      onClick={() => handleApply(job.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
