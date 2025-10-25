import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Users,
  TrendingUp,
  Eye,
  Plus,
  Calendar,
  DollarSign,
  MapPin,
  Building2,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import AdminNavbar from '../../components/AdminNavbar'
import { getToken } from '../../utils/auth'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [overview, setOverview] = useState(null)
  const [charts, setCharts] = useState(null)

  // Mock data for demo
  const mockOverview = {
    totals: {
      'Total Jobs': 24,
      'Total Applicants': 156,
      'Active Jobs': 18,
      'Pending Reviews': 45
    }
  }

  const mockCharts = {
    userGrowth: [
      { date: '2024-01-15', count: 12 },
      { date: '2024-01-16', count: 15 },
      { date: '2024-01-17', count: 20 },
      { date: '2024-01-18', count: 18 },
      { date: '2024-01-19', count: 25 },
      { date: '2024-01-20', count: 30 },
      { date: '2024-01-21', count: 28 }
    ],
    jobsByCategory: [
      { category: 'Engineering', count: 45 },
      { category: 'Design', count: 23 },
      { category: 'Marketing', count: 18 },
      { category: 'Sales', count: 15 }
    ],
    applicationTrends: [
      { date: '2024-01-15', count: 8 },
      { date: '2024-01-16', count: 12 },
      { date: '2024-01-17', count: 15 },
      { date: '2024-01-18', count: 20 },
      { date: '2024-01-19', count: 18 },
      { date: '2024-01-20', count: 25 },
      { date: '2024-01-21', count: 22 }
    ]
  }

  const mockPostedJobs = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $180k',
      applicants: 45,
      views: 234,
      posted: '2 days ago',
      status: 'Active'
    },
    {
      id: 2,
      title: 'Product Designer',
      location: 'Remote',
      type: 'Full-time',
      salary: '$90k - $130k',
      applicants: 67,
      views: 189,
      posted: '1 week ago',
      status: 'Active'
    },
    {
      id: 3,
      title: 'Marketing Manager',
      location: 'Boston, MA',
      type: 'Full-time',
      salary: '$85k - $120k',
      applicants: 52,
      views: 156,
      posted: '5 days ago',
      status: 'Active'
    }
  ]

  const mockRecentApplicants = [
    {
      id: 1,
      name: 'John Doe',
      position: 'Senior Full Stack Developer',
      appliedDate: '2024-01-20',
      status: 'Under Review',
      experience: '5+ years',
      avatar: 'JD'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      position: 'Product Designer',
      appliedDate: '2024-01-19',
      status: 'Interview Scheduled',
      experience: '3+ years',
      avatar: 'SJ'
    },
    {
      id: 3,
      name: 'Michael Chen',
      position: 'Marketing Manager',
      appliedDate: '2024-01-18',
      status: 'New',
      experience: '4+ years',
      avatar: 'MC'
    }
  ]

  useEffect(() => {
    const load = async () => {
      try {
        setError('')
        setLoading(true)
        const token = getToken()
        
        try {
          const [ovRes, chRes] = await Promise.all([
            fetch('/api/admin/metrics/overview', { headers: { Authorization: `Bearer ${token}` } }),
            fetch('/api/admin/metrics/charts', { headers: { Authorization: `Bearer ${token}` } })
          ])
          
          if (ovRes.ok && chRes.ok) {
            setOverview(await ovRes.json())
            setCharts(await chRes.json())
          } else {
            // Use mock data if API fails
            setOverview(mockOverview)
            setCharts(mockCharts)
          }
        } catch (apiError) {
          // Use mock data if API fails
          setOverview(mockOverview)
          setCharts(mockCharts)
        }
      } catch (e) {
        setError(e.message || 'Failed to load')
        setOverview(mockOverview)
        setCharts(mockCharts)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Interview Scheduled':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'New':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Employer <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage your job postings and applicants
              </p>
            </div>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => navigate('/admin/jobs/new')}
            >
              <Plus className="h-5 w-5 mr-2" />
              Post New Job
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive">{error}</p>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {overview && Object.entries(overview.totals || {}).map(([label, value], index) => {
                const icons = {
                  'Total Jobs': <Briefcase className="h-6 w-6" />,
                  'Total Applicants': <Users className="h-6 w-6" />,
                  'Active Jobs': <TrendingUp className="h-6 w-6" />,
                  'Pending Reviews': <Clock className="h-6 w-6" />
                }
                const colors = [
                  'from-blue-500 to-indigo-600',
                  'from-green-500 to-emerald-600',
                  'from-purple-500 to-pink-600',
                  'from-orange-500 to-red-600'
                ]
                
                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-2 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${colors[index % colors.length]} text-white`}>
                            {icons[label] || <Briefcase className="h-6 w-6" />}
                          </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{value}</div>
                        <div className="text-sm text-muted-foreground">{label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Charts Section */}
            {charts && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
              >
                {/* User Growth */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Application Trends</CardTitle>
                    <CardDescription>Applications received over the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-end justify-between gap-2">
                      {charts.applicationTrends.map((point, i) => {
                        const maxCount = Math.max(...charts.applicationTrends.map(p => p.count))
                        const height = (point.count / maxCount) * 100
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div className="text-xs font-semibold mb-1">{point.count}</div>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ delay: i * 0.1 }}
                              className="w-full bg-gradient-to-t from-blue-600 to-indigo-600 rounded-t-lg min-h-[20px]"
                            />
                            <div className="text-xs text-muted-foreground mt-2">
                              {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Jobs by Category */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Jobs by Category</CardTitle>
                    <CardDescription>Distribution of your job postings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {charts.jobsByCategory.map((cat, i) => {
                        const maxCount = Math.max(...charts.jobsByCategory.map(c => c.count))
                        const width = (cat.count / maxCount) * 100
                        const colors = [
                          'bg-blue-500',
                          'bg-green-500',
                          'bg-purple-500',
                          'bg-orange-500'
                        ]
                        return (
                          <div key={cat.category}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{cat.category}</span>
                              <span className="text-sm font-semibold">{cat.count}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${width}%` }}
                                transition={{ delay: i * 0.1 }}
                                className={`h-full ${colors[i % colors.length]} rounded-full`}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Tabs for Jobs and Applicants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Tabs defaultValue="jobs" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="jobs">My Jobs</TabsTrigger>
                  <TabsTrigger value="applicants">Recent Applicants</TabsTrigger>
                </TabsList>

                {/* My Jobs Tab */}
                <TabsContent value="jobs">
                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Posted Jobs</CardTitle>
                          <CardDescription>Manage your active job listings</CardDescription>
                        </div>
                        <Button variant="outline" onClick={() => navigate('/admin/jobs')}>
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mockPostedJobs.map((job) => (
                        <Card key={job.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="text-lg font-bold mb-1">{job.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        <span>{job.location}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Briefcase className="h-4 w-4" />
                                        <span>{job.type}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{job.posted}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <Badge className={getStatusColor(job.status)}>
                                    {job.status}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-6 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-blue-600" />
                                    <span><strong>{job.applicants}</strong> applicants</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-green-600" />
                                    <span><strong>{job.views}</strong> views</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                                    <DollarSign className="h-4 w-4" />
                                    <span>{job.salary}</span>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => navigate(`/jobs/${job.id}`)}
                                  >
                                    View Details
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => navigate(`/admin/jobs/${job.id}`)}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Recent Applicants Tab */}
                <TabsContent value="applicants">
                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Recent Applicants</CardTitle>
                          <CardDescription>Review and manage job applications</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mockRecentApplicants.map((applicant) => (
                        <Card key={applicant.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                                {applicant.avatar}
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-bold text-lg">{applicant.name}</h3>
                                    <p className="text-sm text-muted-foreground">{applicant.position}</p>
                                  </div>
                                  <Badge className={getStatusColor(applicant.status)}>
                                    {applicant.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Briefcase className="h-4 w-4" />
                                    <span>{applicant.experience}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Applied {applicant.appliedDate}</span>
                                  </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                                    View Profile
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Schedule Interview
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
