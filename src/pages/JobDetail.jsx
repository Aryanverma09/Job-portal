import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  Users,
  Globe,
  Calendar,
  CheckCircle2,
  Share2,
  Bookmark,
  ArrowLeft,
  ExternalLink,
  X
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Textarea } from '../components/ui/textarea'
import Navbar from '../components/Navbar'
import { useToast } from '../components/ui/toast'
import axios from 'axios'

// Mock job data
const mockJobDetails = {
  id: 1,
  title: "Senior Full Stack Developer",
  company: "TechCorp Inc",
  companyDescription: "TechCorp is a leading technology company specializing in innovative software solutions. We're committed to building products that make a difference.",
  location: "San Francisco, CA",
  type: "Full-time",
  experience: "5+ years",
  salary: "$120k - $180k",
  posted: "2 days ago",
  applicants: 45,
  logo: "🚀",
  description: `We're looking for an experienced Full Stack Developer to join our dynamic team. You'll be working on cutting-edge projects that impact millions of users worldwide.

As a Senior Full Stack Developer, you'll be responsible for designing, developing, and maintaining our web applications. You'll work closely with product managers, designers, and other engineers to deliver high-quality software solutions.`,
  
  responsibilities: [
    "Design and develop scalable web applications using modern frameworks",
    "Collaborate with cross-functional teams to define and implement new features",
    "Write clean, maintainable, and well-documented code",
    "Participate in code reviews and mentor junior developers",
    "Optimize application performance and ensure security best practices",
    "Stay up-to-date with emerging technologies and industry trends"
  ],
  
  requirements: [
    "5+ years of experience in full stack development",
    "Strong proficiency in React, Node.js, and TypeScript",
    "Experience with cloud platforms (AWS, Azure, or GCP)",
    "Solid understanding of database design and optimization",
    "Excellent problem-solving and communication skills",
    "Bachelor's degree in Computer Science or related field"
  ],
  
  niceToHave: [
    "Experience with microservices architecture",
    "Knowledge of DevOps practices and CI/CD pipelines",
    "Contributions to open-source projects",
    "Experience leading technical teams"
  ],
  
  skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB", "Docker", "GraphQL", "Redis"],
  
  benefits: [
    "Competitive salary and equity package",
    "Comprehensive health, dental, and vision insurance",
    "401(k) matching program",
    "Flexible work schedule and remote work options",
    "Professional development budget",
    "Unlimited PTO policy",
    "State-of-the-art office with free meals",
    "Wellness programs and gym membership"
  ],
  
  companyInfo: {
    size: "500-1000 employees",
    founded: "2015",
    industry: "Technology",
    website: "www.techcorp.com",
    headquarters: "San Francisco, CA"
  }
}

const relatedJobs = [
  {
    id: 2,
    title: "Frontend Developer",
    company: "WebDev Studios",
    location: "Remote",
    type: "Full-time",
    salary: "$90k - $130k",
    logo: "💻",
    skills: ["React", "CSS", "JavaScript"]
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "DataTech Solutions",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100k - $150k",
    logo: "⚙️",
    skills: ["Node.js", "Python", "AWS"]
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudScale",
    location: "Austin, TX",
    type: "Contract",
    salary: "$110k - $160k",
    logo: "☁️",
    skills: ["Docker", "Kubernetes", "AWS"]
  }
]

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error, info } = useToast()
  const [job, setJob] = useState(mockJobDetails)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [applied, setApplied] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/jobs/${id}`)
        if (!res.ok) {
          setJob(mockJobDetails)
        } else {
          const data = await res.json()
          setJob(data.job || mockJobDetails)
        }
      } catch (e) {
        setJob(mockJobDetails)
      } finally {
        setLoading(false)
      }
    }
    fetchJobDetail()
  }, [id])

  const handleOneClickApply = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      error('Please log in to apply for jobs')
      navigate('/login')
      return
    }

    // Check if already applied
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const appsRes = await axios.get('/api/applications/my-applications', { headers })
      const hasApplied = appsRes.data.applications?.some(app => app.job.id === id)
      
      if (hasApplied) {
        setApplied(true)
        error('You have already applied for this job')
        return
      }
    } catch (err) {
      console.error('Failed to check applications:', err)
    }

    setApplying(true)
    try {
      const headers = { Authorization: `Bearer ${token}` }
      await axios.post('/api/applications/apply', {
        jobId: id,
        coverLetter: ''
      }, { headers })
      
      setApplied(true)
      setShowApplyModal(false)
      success('Application submitted successfully!')
    } catch (err) {
      console.error('Application error:', err)
      error(err.response?.data?.message || 'Failed to submit application')
    } finally {
      setApplying(false)
    }
  }

  const handleGenerateCoverLetter = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      error('Please log in to use this feature')
      return
    }

    setGeneratingCoverLetter(true)
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const res = await axios.post('/api/ai/cover-letter', {
        jobId: id
      }, { headers })
      
      setCoverLetter(res.data.coverLetter || '')
      success('Cover letter generated! Review and edit as needed.')
    } catch (err) {
      console.error('Cover letter generation error:', err)
      error('Failed to generate cover letter')
    } finally {
      setGeneratingCoverLetter(false)
    }
  }

  const handleApplyWithCoverLetter = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      error('Please log in to apply for jobs')
      navigate('/login')
      return
    }

    setApplying(true)
    try {
      const headers = { Authorization: `Bearer ${token}` }
      await axios.post('/api/applications/apply', {
        jobId: id,
        coverLetter: coverLetter
      }, { headers })
      
      setApplied(true)
      setShowApplyModal(false)
      success('Application submitted successfully!')
    } catch (err) {
      console.error('Application error:', err)
      error(err.response?.data?.message || 'Failed to submit application')
    } finally {
      setApplying(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job at ${job.company}`,
          url: window.location.href
        })
      } catch (err) {
        console.log('Share failed:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
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
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/jobs')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl shadow-lg">
                        {job.logo}
                      </div>
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                        <div className="flex items-center gap-2 text-lg text-muted-foreground">
                          <Building2 className="h-5 w-5" />
                          <span className="font-semibold">{job.company}</span>
                        </div>
                      </div>

                      {/* Job Meta */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{job.posted}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{job.applicants} applicants</span>
                        </div>
                      </div>

                      {/* Salary */}
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">{job.salary}</span>
                        <span className="text-muted-foreground">/ year</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <Button 
                          size="lg" 
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                          onClick={applied ? undefined : () => setShowApplyModal(true)}
                          disabled={applied || applying}
                        >
                          {applying ? (
                            'Applying...'
                          ) : applied ? (
                            <>
                              <CheckCircle2 className="h-5 w-5 mr-2" />
                              Applied
                            </>
                          ) : (
                            'Apply Now'
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={() => setShowApplyModal(true)}
                          disabled={applied}
                        >
                          Apply with Cover Letter
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={() => setSaved(!saved)}
                        >
                          <Bookmark className={`h-5 w-5 mr-2 ${saved ? 'fill-current' : ''}`} />
                          {saved ? 'Saved' : 'Save Job'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={handleShare}
                        >
                          <Share2 className="h-5 w-5 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Job Details Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <Tabs defaultValue="description" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="requirements">Requirements</TabsTrigger>
                      <TabsTrigger value="company">Company</TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="space-y-6 mt-6">
                      {/* Description */}
                      <div>
                        <h3 className="text-xl font-bold mb-3">About the Role</h3>
                        <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
                      </div>

                      {/* Responsibilities */}
                      <div>
                        <h3 className="text-xl font-bold mb-3">Responsibilities</h3>
                        <ul className="space-y-2">
                          {job.responsibilities.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className="text-xl font-bold mb-3">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div>
                        <h3 className="text-xl font-bold mb-3">Benefits & Perks</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {job.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                              <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="requirements" className="space-y-6 mt-6">
                      {/* Requirements */}
                      <div>
                        <h3 className="text-xl font-bold mb-3">Requirements</h3>
                        <ul className="space-y-2">
                          {job.requirements.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Nice to Have */}
                      <div>
                        <h3 className="text-xl font-bold mb-3">Nice to Have</h3>
                        <ul className="space-y-2">
                          {job.niceToHave.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>

                    <TabsContent value="company" className="space-y-6 mt-6">
                      {/* Company Description */}
                      <div>
                        <h3 className="text-xl font-bold mb-3">About {job.company}</h3>
                        <p className="text-muted-foreground">{job.companyDescription}</p>
                      </div>

                      {/* Company Info */}
                      <div>
                        <h3 className="text-xl font-bold mb-3">Company Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                            <Users className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="text-sm text-muted-foreground">Company Size</div>
                              <div className="font-semibold">{job.companyInfo.size}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                            <Calendar className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="text-sm text-muted-foreground">Founded</div>
                              <div className="font-semibold">{job.companyInfo.founded}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                            <Building2 className="h-5 w-5 text-purple-600" />
                            <div>
                              <div className="text-sm text-muted-foreground">Industry</div>
                              <div className="font-semibold">{job.companyInfo.industry}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                            <MapPin className="h-5 w-5 text-red-600" />
                            <div>
                              <div className="text-sm text-muted-foreground">Headquarters</div>
                              <div className="font-semibold">{job.companyInfo.headquarters}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Website */}
                      <div>
                        <Button variant="outline" className="w-full" asChild>
                          <a href={`https://${job.companyInfo.website}`} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-5 w-5 mr-2" />
                            Visit Company Website
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card - Sticky */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <Card className="border-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                <CardHeader>
                  <CardTitle>Ready to Apply?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Quick application process</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Hear back within 5 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Competitive compensation</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    size="lg"
                    onClick={applied ? undefined : handleOneClickApply}
                    disabled={applied || applying}
                  >
                    {applying ? (
                      'Applying...'
                    ) : applied ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Applied Successfully
                      </>
                    ) : (
                      'One-Click Apply'
                    )}
                  </Button>
                  {!applied && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowApplyModal(true)}
                    >
                      Apply with Cover Letter
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSaved(!saved)}
                  >
                    <Bookmark className={`h-5 w-5 mr-2 ${saved ? 'fill-current' : ''}`} />
                    {saved ? 'Saved' : 'Save for Later'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Related Jobs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Related Jobs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedJobs.map((relJob) => (
                    <div
                      key={relJob.id}
                      className="p-4 rounded-lg border hover:border-primary/50 hover:bg-accent transition-all cursor-pointer"
                      onClick={() => navigate(`/jobs/${relJob.id}`)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl flex-shrink-0">
                          {relJob.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1 truncate">{relJob.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{relJob.company}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <MapPin className="h-3 w-3" />
                            <span>{relJob.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {relJob.skills.slice(0, 2).map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs px-2 py-0">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/jobs')}
                  >
                    View All Jobs
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-lg border-2 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Apply for {job.title}</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowApplyModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Cover Letter (Optional)</label>
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write a cover letter or generate one using AI..."
                  rows={8}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleGenerateCoverLetter}
                  disabled={generatingCoverLetter}
                >
                  {generatingCoverLetter ? 'Generating...' : '🤖 Generate with AI'}
                </Button>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                  onClick={handleApplyWithCoverLetter}
                  disabled={applying}
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleOneClickApply}
                  disabled={applying}
                >
                  Quick Apply (No Cover Letter)
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
