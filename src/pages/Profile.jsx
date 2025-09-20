import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import Navbar from '../components/Navbar'


const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [resume, setResume] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [matchedJobs, setMatchedJobs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user')
    console.log('User data from localStorage:', userData)
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        console.log('Parsed user:', parsedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    } else {
      console.log('No user data found in localStorage')
      // Redirect to login if no user data
      setTimeout(() => {
        navigate('/')
      }, 2000)
    }
  }, [])

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('resume', file)
    formData.append('userId', user.id)

    try {
      const response = await fetch('http://localhost:3000/api/users/upload-resume', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()
      
      if (response.ok) {
        setResume(data.resume)
        alert('Resume uploaded successfully!')
        // Automatically get job matches
        await getJobMatches(data.resume)
      } else {
        alert(data.message || 'Failed to upload resume')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload resume')
    } finally {
      setUploading(false)
    }
  }

  const getJobMatches = async (resumeData) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3000/api/users/get-matched-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ resumeData })
      })

      const data = await response.json()
      
      if (response.ok) {
        setMatchedJobs(data.jobs)
      } else {
        console.error('Failed to get job matches:', data.message)
      }
    } catch (error) {
      console.error('Error getting job matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadResume = () => {
    if (resume && resume.filePath) {
      window.open(`http://localhost:3000/${resume.filePath}`, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
            <p className="text-lg text-gray-600">Manage your resume and discover job opportunities</p>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* User Information */}
            <div className="xl:col-span-1">
              <Card className="h-fit shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {user ? (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{user.name || 'User'}</h3>
                          <p className="text-gray-600">{user.email || 'No email'}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Profile Complete</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Ready for Job Matching</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-500 mb-4">
                        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-lg font-medium">Please log in to view your profile</p>
                        <p className="text-sm mb-4">You need to be logged in to access this page.</p>
                        <Button 
                          onClick={() => navigate('/')}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Go to Login
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Resume Upload Section */}
            <div className="xl:col-span-2">
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Resume Upload & Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Resume</h3>
                          <p className="text-gray-600 mb-4">Drag and drop your resume here, or click to browse</p>
                          <div className="flex items-center justify-center space-x-4">
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileUpload}
                              disabled={uploading}
                              className="hidden"
                              id="resume-upload"
                            />
                            <Button
                              onClick={() => document.getElementById('resume-upload').click()}
                              disabled={uploading}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                            >
                              {uploading ? (
                                <div className="flex items-center space-x-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  <span>Uploading...</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  <span>Choose File</span>
                                </div>
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Supports PDF, DOC, DOCX files up to 5MB</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Current Resume Display */}
                    {resume && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Resume Uploaded Successfully</h3>
                              <p className="text-sm text-gray-600">{resume.originalName}</p>
                              <p className="text-xs text-gray-500">Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <Button 
                            onClick={downloadResume} 
                            variant="outline" 
                            size="sm"
                            className="border-green-300 text-green-700 hover:bg-green-50"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Matched Jobs */}
          {matchedJobs.length > 0 && (
            <Card className="mt-8 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  Recommended Jobs Based on Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                      <span className="text-gray-600">Finding matching jobs...</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matchedJobs.map((job, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                            <p className="text-gray-600 font-medium mb-2">{job.company}</p>
                            <p className="text-sm text-gray-500 mb-3">{job.location}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-2">
                              {job.matchScore}% Match
                            </div>
                            <div className="text-sm text-gray-600">{job.salary}</div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{job.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills:</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.skills && job.skills.map((skill, skillIndex) => (
                                <span key={skillIndex} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {job.matchedSkills && job.matchedSkills.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-green-700 mb-2">Your Matching Skills:</h4>
                              <div className="flex flex-wrap gap-2">
                                {job.matchedSkills.map((skill, skillIndex) => (
                                  <span key={skillIndex} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
