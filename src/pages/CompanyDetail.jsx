import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import Navbar from '../components/Navbar'

const companies = {
  'a': { 
    id: 'a', 
    name: 'TechCorp', 
    industry: 'Software', 
    location: 'Remote',
    size: '100-500 employees',
    founded: '2015',
    about: 'Leading software company building innovative solutions for modern businesses. We focus on creating tools that help teams collaborate more effectively and ship faster.',
    mission: 'To empower teams worldwide with cutting-edge software solutions that drive productivity and innovation.',
    values: ['Innovation', 'Collaboration', 'Excellence', 'Growth'],
    benefits: ['Remote work', 'Health insurance', 'Learning budget', 'Flexible hours'],
    jobs: 12,
    rating: 4.5,
    logo: 'TC'
  },
  'b': { 
    id: 'b', 
    name: 'FinTech Solutions', 
    industry: 'Financial Technology', 
    location: 'New York, NY',
    size: '50-200 employees',
    founded: '2018',
    about: 'Revolutionizing financial services with cutting-edge technology and AI. We build secure, scalable platforms that power the future of finance.',
    mission: 'To democratize financial services through innovative technology solutions.',
    values: ['Security', 'Innovation', 'Trust', 'Accessibility'],
    benefits: ['Competitive salary', 'Stock options', 'Health coverage', 'Professional development'],
    jobs: 8,
    rating: 4.3,
    logo: 'FS'
  },
  'c': { 
    id: 'c', 
    name: 'Design Studio', 
    industry: 'Design & UX', 
    location: 'San Francisco, CA',
    size: '20-100 employees',
    founded: '2016',
    about: 'Creative design agency focused on user experience and digital innovation. We help brands create meaningful connections with their users.',
    mission: 'To create beautiful, functional designs that solve real problems and delight users.',
    values: ['Creativity', 'User-centric', 'Quality', 'Collaboration'],
    benefits: ['Creative freedom', 'Design tools', 'Conference budget', 'Flexible schedule'],
    jobs: 5,
    rating: 4.7,
    logo: 'DS'
  }
}

export default function CompanyDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const company = companies[id]

  if(!company) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="text-center p-8">
        <CardContent>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Company Not Found</h1>
          <p className="text-gray-600 mb-6">The company you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/companies')} className="bg-blue-600 hover:bg-blue-700 text-white">
            Browse All Companies
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="mb-6"
          >
            ← Back to Companies
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Company Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company Header */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-2xl font-bold">
                      {company.logo}
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-bold">{company.name}</CardTitle>
                      <div className="flex items-center space-x-4 text-orange-100 mt-2">
                        <span>{company.industry}</span>
                        <span>•</span>
                        <span>{company.location}</span>
                        <span>•</span>
                        <span>{company.size}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* About */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">About {company.name}</h3>
                      <p className="text-gray-700 leading-relaxed">{company.about}</p>
                    </div>

                    {/* Mission */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Mission</h3>
                      <p className="text-gray-700 leading-relaxed">{company.mission}</p>
                    </div>

                    {/* Values */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Values</h3>
                      <div className="flex flex-wrap gap-2">
                        {company.values.map((value, index) => (
                          <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Employee Benefits</h3>
                      <ul className="space-y-2">
                        {company.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
              {/* Company Stats */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Founded:</span>
                      <span className="font-medium">{company.founded}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{company.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry:</span>
                      <span className="font-medium">{company.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{company.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-medium">{company.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Open Jobs */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Open Positions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-orange-600 mb-1">{company.jobs}</div>
                    <div className="text-sm text-gray-500">Open positions</div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/jobs')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    View All Jobs
                  </Button>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm mb-4">
                    Interested in joining {company.name}? Check out our open positions or get in touch with our team.
                  </p>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => navigate('/jobs')}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      View Jobs
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full"
                    >
                      Contact Company
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
