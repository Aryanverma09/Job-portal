import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Users,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Building2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import Navbar from '../components/Navbar'
import { useToast } from '../components/ui/toast'
import AIInterviewAssistant from '../components/AIInterviewAssistant'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import axios from 'axios'

export default function EmployerDashboard() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [activeTab, setActiveTab] = useState('applications')

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    if (selectedJob) {
      fetchApplications(selectedJob)
    }
  }, [selectedJob])

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const headers = { Authorization: `Bearer ${token}` }
      
      // Try unified dashboard endpoint first
      try {
        const dashboardRes = await axios.get('/api/dashboard/employer', { headers })
        const data = dashboardRes.data
        setJobs(data.jobs || [])
        setApplications(data.jobs?.find(j => j.id === selectedJob)?.applications || [])
        
        if (data.jobs?.length > 0 && !selectedJob) {
          setSelectedJob(data.jobs[0].id)
        }
      } catch (dashErr) {
        // Fallback to individual endpoint
        const res = await axios.get('/api/jobs', { headers })
        setJobs(res.data.jobs || [])
        
        if (res.data.jobs?.length > 0 && !selectedJob) {
          setSelectedJob(res.data.jobs[0].id)
        }
      }
    } catch (err) {
      error('Failed to load jobs')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Poll for updates every 30 seconds
  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        fetchJobs()
        if (selectedJob) {
          fetchApplications(selectedJob)
        }
      }, 30000) // 30 seconds
      return () => clearInterval(interval)
    }
  }, [loading, selectedJob])

  const fetchApplications = async (jobId) => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      const res = await axios.get(`/api/applications/job/${jobId}`, { headers })
      setApplications(res.data.applications || [])
    } catch (err) {
      error('Failed to load applications')
      console.error(err)
    }
  }

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      await axios.put(
        `/api/applications/${applicationId}/status`,
        { status: newStatus },
        { headers }
      )
      success(`Application ${newStatus.toLowerCase()} successfully`)
      fetchApplications(selectedJob)
    } catch (err) {
      error('Failed to update application status')
      console.error(err)
    }
  }

  const handleViewResume = (resumePath) => {
    if (resumePath) {
      window.open(`/api/${resumePath}`, '_blank')
    } else {
      error('Resume not available')
    }
  }

  const stats = {
    totalJobs: jobs.length,
    totalApplications: applications.length,
    pending: applications.filter(app => app.status === 'Applied').length,
    accepted: applications.filter(app => app.status === 'Accepted').length,
    rejected: applications.filter(app => app.status === 'Rejected').length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Employer <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage your job postings and review applicants
              </p>
            </div>
            <Button onClick={() => navigate('/admin/jobs/new')}>
              <Briefcase className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Jobs</p>
                    <p className="text-3xl font-bold">{stats.totalJobs}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Applications</p>
                    <p className="text-3xl font-bold">{stats.totalApplications}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-3xl font-bold">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Accepted</p>
                    <p className="text-3xl font-bold">{stats.accepted}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-2">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="interview">
              <FileText className="h-4 w-4 mr-2" />
              Interview Questions
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            {/* Job Selector */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select Job to Review Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-center">
                  <Select value={selectedJob || ''} onValueChange={setSelectedJob}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a job..." />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title} - {job.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedJob && (
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/jobs/${selectedJob}`)}
                    >
                      View Job Details
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Applications List */}
            <Card>
          <CardHeader>
            <CardTitle>
              Applications
              {selectedJob && jobs.find(j => j.id === selectedJob) && (
                <span className="text-lg font-normal text-muted-foreground ml-2">
                  for {jobs.find(j => j.id === selectedJob)?.title}
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Review and manage applications for your job postings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedJob ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a job to view applications</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No applications for this job yet</p>
              </div>
            ) : (
              applications.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="text-lg font-bold">{app.applicant.name}</h3>
                            <p className="text-muted-foreground">{app.applicant.email}</p>
                          </div>

                          {app.coverLetter && (
                            <div>
                              <h4 className="font-semibold mb-2">Cover Letter:</h4>
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {app.coverLetter}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-4">
                            <Badge className={getStatusColor(app.status)}>
                              {app.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Applied {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <Button
                            variant="outline"
                            onClick={() => handleViewResume(app.applicant.resume?.filePath)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            View Resume
                          </Button>

                          {app.status === 'Applied' && (
                            <>
                              <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatusUpdate(app.id, 'Accepted')}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Accept
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}

                          {app.status === 'Accepted' && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Accepted
                            </Badge>
                          )}

                          {app.status === 'Rejected' && (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              Rejected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
          </TabsContent>

          {/* Interview Assistant Tab */}
          <TabsContent value="interview">
            <Card>
              <CardHeader>
                <CardTitle>AI Interview Question Generator</CardTitle>
                <CardDescription>
                  Generate interview questions for your job postings to assess candidates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIInterviewAssistant />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Accepted':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'Rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'Applied':
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  }
}

