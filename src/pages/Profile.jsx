import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Upload,
  Edit,
  Save,
  X,
  CheckCircle2,
  Clock,
  Building2,
  DollarSign,
  ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import Navbar from '../components/Navbar'

export default function Profile() {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    bio: '',
    skills: [],
    experience: '',
    education: '',
    linkedin: '',
    github: '',
    portfolio: ''
  })

  // Mock applied jobs data
  const [appliedJobs, setAppliedJobs] = useState([
    {
      id: 1,
      title: "Senior Full Stack Developer",
      company: "TechCorp Inc",
      location: "San Francisco, CA",
      appliedDate: "2024-01-15",
      status: "Under Review",
      salary: "$120k - $180k",
      logo: "🚀"
    },
    {
      id: 2,
      title: "Product Designer",
      company: "Design Studio",
      location: "Remote",
      appliedDate: "2024-01-10",
      status: "Interview Scheduled",
      salary: "$90k - $130k",
      logo: "🎨"
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "DataTech Solutions",
      location: "New York, NY",
      appliedDate: "2024-01-05",
      status: "Rejected",
      salary: "$130k - $170k",
      logo: "📊"
    }
  ])

  // Mock saved jobs
  const [savedJobs, setSavedJobs] = useState([
    {
      id: 5,
      title: "Marketing Manager",
      company: "Growth Marketing Co",
      location: "Boston, MA",
      type: "Full-time",
      salary: "$85k - $120k",
      logo: "📈"
    },
    {
      id: 6,
      title: "Frontend Developer",
      company: "WebDev Studios",
      location: "Remote",
      type: "Part-time",
      salary: "$60k - $90k",
      logo: "💻"
    }
  ])

  useEffect(() => {
    const userJson = localStorage.getItem('user')
    if (userJson) {
      const userData = JSON.parse(userJson)
      setUser(userData)
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '+1 (555) 123-4567',
        location: userData.location || 'San Francisco, CA',
        title: userData.title || 'Full Stack Developer',
        bio: userData.bio || 'Passionate developer with 5+ years of experience building modern web applications.',
        skills: userData.skills || ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
        experience: userData.experience || '5+ years',
        education: userData.education || 'BS Computer Science, Stanford University',
        linkedin: userData.linkedin || '',
        github: userData.github || '',
        portfolio: userData.portfolio || ''
      })
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // Save to localStorage
    const updatedUser = { ...user, ...formData }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setEditing(false)
    alert('Profile updated successfully!')
  }

  const handleSkillAdd = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }))
    }
  }

  const handleSkillRemove = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Interview Scheduled':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Please log in to view your profile.</p>
              <Button onClick={() => navigate('/login')} className="mt-4">
                Go to Login
              </Button>
            </CardContent>
          </Card>
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
          <h1 className="text-4xl font-bold mb-2">
            My <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your profile and track your applications
          </p>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <Card className="border-2">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                        {formData.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </div>
                    </div>
                    {editing ? (
                      <div className="space-y-3">
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Full Name"
                        />
                        <Input
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Job Title"
                        />
                      </div>
                    ) : (
                      <>
                        <CardTitle className="text-2xl">{formData.name}</CardTitle>
                        <CardDescription className="text-base">{formData.title}</CardDescription>
                      </>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-3">
                      {editing ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <Input
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Email"
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <Input
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="Phone"
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <Input
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              placeholder="Location"
                              className="flex-1"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{formData.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{formData.phone}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{formData.location}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span>{formData.experience}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t space-y-2">
                      {editing ? (
                        <>
                          <Button 
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                            onClick={handleSave}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setEditing(false)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            className="w-full"
                            onClick={() => setEditing(true)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Resume
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-6"
                >
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Applied Jobs</span>
                        <span className="font-bold text-lg">{appliedJobs.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Saved Jobs</span>
                        <span className="font-bold text-lg">{savedJobs.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Profile Views</span>
                        <span className="font-bold text-lg">127</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Details Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2 space-y-6"
              >
                {/* About Me */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editing ? (
                      <Textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    ) : (
                      <p className="text-muted-foreground">{formData.bio}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                          {skill}
                          {editing && (
                            <button
                              onClick={() => handleSkillRemove(skill)}
                              className="ml-2 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                      {editing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const skill = prompt('Enter a skill:')
                            if (skill) handleSkillAdd(skill)
                          }}
                        >
                          + Add Skill
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Experience & Education */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editing ? (
                        <Input
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          placeholder="e.g., 5+ years"
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                          <span>{formData.experience}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Education</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editing ? (
                        <Input
                          name="education"
                          value={formData.education}
                          onChange={handleInputChange}
                          placeholder="e.g., BS Computer Science"
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-indigo-600" />
                          <span>{formData.education}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Links */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Professional Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editing ? (
                      <div className="space-y-3">
                        <Input
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          placeholder="LinkedIn URL"
                        />
                        <Input
                          name="github"
                          value={formData.github}
                          onChange={handleInputChange}
                          placeholder="GitHub URL"
                        />
                        <Input
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleInputChange}
                          placeholder="Portfolio URL"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {formData.linkedin && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={formData.linkedin} target="_blank" rel="noopener noreferrer">
                              LinkedIn <ExternalLink className="h-3 w-3 ml-2" />
                            </a>
                          </Button>
                        )}
                        {formData.github && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={formData.github} target="_blank" rel="noopener noreferrer">
                              GitHub <ExternalLink className="h-3 w-3 ml-2" />
                            </a>
                          </Button>
                        )}
                        {formData.portfolio && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={formData.portfolio} target="_blank" rel="noopener noreferrer">
                              Portfolio <ExternalLink className="h-3 w-3 ml-2" />
                            </a>
                          </Button>
                        )}
                        {!formData.linkedin && !formData.github && !formData.portfolio && (
                          <p className="text-sm text-muted-foreground">No links added yet</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>My Applications</CardTitle>
                  <CardDescription>Track the status of your job applications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appliedJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl">
                              {job.logo}
                            </div>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="text-lg font-bold">{job.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 className="h-4 w-4" />
                                <span>{job.company}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Applied {job.appliedDate}</span>
                              </div>
                              <div className="flex items-center gap-1 text-green-600 font-semibold">
                                <DollarSign className="h-4 w-4" />
                                <span>{job.salary}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge className={getStatusColor(job.status)}>
                                {job.status}
                              </Badge>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/jobs/${job.id}`)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Saved Jobs Tab */}
          <TabsContent value="saved">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Saved Jobs</CardTitle>
                  <CardDescription>Jobs you've bookmarked for later</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {savedJobs.map((job) => (
                      <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)}>
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl flex-shrink-0">
                              {job.logo}
                            </div>
                            <div className="flex-1 space-y-2">
                              <h3 className="font-bold">{job.title}</h3>
                              <p className="text-sm text-muted-foreground">{job.company}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center justify-between pt-2">
                                <span className="text-sm font-semibold text-green-600">{job.salary}</span>
                                <Badge variant="secondary">{job.type}</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
