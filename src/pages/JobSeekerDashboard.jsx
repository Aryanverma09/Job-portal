import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Sparkles,
  FileText,
  Bell,
  MessageSquare
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import Navbar from '../components/Navbar'
import { useToast } from '../components/ui/toast'
import AIInterviewAssistant from '../components/AIInterviewAssistant'
import axios from 'axios'

export default function JobSeekerDashboard() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [notifications, setNotifications] = useState([])
  const [activeTab, setActiveTab] = useState('applications')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const headers = { Authorization: `Bearer ${token}` }
      
      // Fetch all dashboard data from unified endpoint
      try {
        const dashboardRes = await axios.get('/api/dashboard/jobseeker', { headers })
        const data = dashboardRes.data
        
        setApplications(data.applications || [])
        setNotifications(data.notifications || [])
        
        // Fetch recommendations separately
        try {
          const recRes = await axios.get('/api/ai/recommendations', { headers })
          setRecommendations(recRes.data.recommendations || [])
        } catch (err) {
          console.error('Failed to fetch recommendations:', err)
          setRecommendations([])
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err)
        // Fallback: try individual endpoints
        try {
          const appsRes = await axios.get('/api/applications/my-applications', { headers })
          setApplications(appsRes.data.applications || [])
        } catch (e) {
          console.error('Failed to fetch applications:', e)
        }
        
        try {
          const notifRes = await axios.get('/api/notifications', { headers })
          setNotifications(notifRes.data.notifications || [])
        } catch (e) {
          console.error('Failed to fetch notifications:', e)
        }
        
        error('Some dashboard data failed to load')
      }
    } catch (err) {
      error('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Poll for updates every 30 seconds
  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        fetchData()
      }, 30000) // 30 seconds
      return () => clearInterval(interval)
    }
  }, [loading])

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle2 className="h-4 w-4" />
      case 'Rejected':
        return <XCircle className="h-4 w-4" />
      case 'Applied':
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  })

  useEffect(() => {
    setStats({
      total: applications.length,
      pending: applications.filter(app => app.status === 'Applied').length,
      accepted: applications.filter(app => app.status === 'Accepted').length,
      rejected: applications.filter(app => app.status === 'Rejected').length
    })
  }, [applications])

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
                My <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Track your applications and discover opportunities
              </p>
            </div>
            <Button onClick={() => navigate('/jobs')}>
              <Briefcase className="h-4 w-4 mr-2" />
              Browse Jobs
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
                    <p className="text-sm text-muted-foreground">Total Applications</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-blue-600" />
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
                    <p className="text-sm text-muted-foreground">Pending</p>
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
            transition={{ delay: 0.3 }}
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <p className="text-3xl font-bold">{stats.rejected}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-4">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="recommendations">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Recommendations
            </TabsTrigger>
            <TabsTrigger value="interview">
              <MessageSquare className="h-4 w-4 mr-2" />
              Interview Prep
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <Badge className="ml-2">{notifications.filter(n => !n.read).length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Track the status of your job applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">You haven't applied to any jobs yet</p>
                    <Button onClick={() => navigate('/jobs')}>
                      Browse Available Jobs
                    </Button>
                  </div>
                ) : (
                  applications.map((app) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => navigate(`/jobs/${app.job.id}`)}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-3">
                              <div>
                                <h3 className="text-lg font-bold">{app.job.title}</h3>
                                <p className="text-muted-foreground">{app.job.company}</p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{app.job.type}</Badge>
                                <Badge variant="secondary">{app.job.location}</Badge>
                                {app.job.skills?.slice(0, 3).map((skill, idx) => (
                                  <Badge key={idx} variant="outline">{skill}</Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Badge className={getStatusColor(app.status)}>
                                <span className="flex items-center gap-2">
                                  {getStatusIcon(app.status)}
                                  {app.status}
                                </span>
                              </Badge>
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

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  AI-Powered Job Recommendations
                </CardTitle>
                <CardDescription>
                  Jobs matched to your skills and experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No recommendations available. Upload your resume to get personalized recommendations!</p>
                    <Button onClick={() => navigate('/profile')}>
                      Update Profile
                    </Button>
                  </div>
                ) : (
                  recommendations.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-bold">{job.title}</h3>
                                  <p className="text-muted-foreground">{job.company}</p>
                                </div>
                                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600">
                                  {job.matchScore}% Match
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {job.matchReason}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{job.type}</Badge>
                                <Badge variant="secondary">{job.location}</Badge>
                                {job.skills?.slice(0, 3).map((skill, idx) => (
                                  <Badge key={idx} variant="outline">{skill}</Badge>
                                ))}
                              </div>
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
                <CardTitle>AI Interview Preparation</CardTitle>
                <CardDescription>
                  Practice with AI-generated interview questions tailored to your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIInterviewAssistant />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Stay updated on your applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className={notif.read ? '' : 'border-2 border-blue-500'}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{notif.title}</h4>
                              <p className="text-sm text-muted-foreground">{notif.message}</p>
                              {notif.relatedJob && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  {notif.relatedJob.title} at {notif.relatedJob.company}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(notif.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {!notif.read && (
                              <div className="h-2 w-2 rounded-full bg-blue-600" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

