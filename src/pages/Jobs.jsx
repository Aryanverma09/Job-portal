import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock,
  Building2,
  Filter,
  X,
  ChevronDown,
  Bookmark,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Label } from '../components/ui/label'
import Navbar from '../components/Navbar'

// Fallback/Mock data
const mockJobs = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "TechCorp Inc",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "5+ years",
    salary: "$120k - $180k",
    posted: "2 days ago",
    applicants: 45,
    description: "We're looking for an experienced Full Stack Developer to join our dynamic team...",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    logo: "🚀"
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Design Studio",
    location: "Remote",
    type: "Full-time",
    experience: "3+ years",
    salary: "$90k - $130k",
    posted: "1 week ago",
    applicants: 67,
    description: "Join our creative team to design beautiful and intuitive user experiences...",
    skills: ["Figma", "UI/UX", "Prototyping", "Design Systems"],
    logo: "🎨"
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "DataTech Solutions",
    location: "New York, NY",
    type: "Full-time",
    experience: "4+ years",
    salary: "$130k - $170k",
    posted: "3 days ago",
    applicants: 89,
    description: "Help us build cutting-edge machine learning models and drive data insights...",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
    logo: "📊"
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudScale",
    location: "Austin, TX",
    type: "Contract",
    experience: "5+ years",
    salary: "$100k - $150k",
    posted: "1 day ago",
    applicants: 34,
    description: "Looking for a DevOps engineer to help scale our cloud infrastructure...",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    logo: "☁️"
  },
  {
    id: 5,
    title: "Marketing Manager",
    company: "Growth Marketing Co",
    location: "Boston, MA",
    type: "Full-time",
    experience: "4+ years",
    salary: "$85k - $120k",
    posted: "5 days ago",
    applicants: 52,
    description: "Lead our marketing team to drive growth and brand awareness...",
    skills: ["SEO", "Content Marketing", "Analytics", "Social Media"],
    logo: "📈"
  },
  {
    id: 6,
    title: "Frontend Developer",
    company: "WebDev Studios",
    location: "Remote",
    type: "Part-time",
    experience: "2+ years",
    salary: "$60k - $90k",
    posted: "1 week ago",
    applicants: 78,
    description: "Build beautiful and responsive web applications with modern technologies...",
    skills: ["React", "CSS", "JavaScript", "Responsive Design"],
    logo: "💻"
  }
]

export default function Jobs() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [experienceFilter, setExperienceFilter] = useState('all')
  const [salaryFilter, setSalaryFilter] = useState('all')
  const [allJobs, setAllJobs] = useState(mockJobs)
  const [filteredJobs, setFilteredJobs] = useState(mockJobs)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState(new Set())

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await fetch('/api/jobs')
        if (!res.ok) {
          // Use mock data if API fails
          setAllJobs(mockJobs)
          setFilteredJobs(mockJobs)
        } else {
          const data = await res.json()
          setAllJobs(data.jobs || mockJobs)
          setFilteredJobs(data.jobs || mockJobs)
        }
      } catch (e) {
        setAllJobs(mockJobs)
        setFilteredJobs(mockJobs)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  useEffect(() => {
    let filtered = allJobs

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (locationFilter) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(job => job.type === filterType)
    }

    if (experienceFilter !== 'all') {
      filtered = filtered.filter(job => job.experience.includes(experienceFilter))
    }

    setFilteredJobs(filtered)
  }, [searchTerm, locationFilter, filterType, experienceFilter, salaryFilter, allJobs])

  const handleApply = (jobId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please log in to apply for jobs')
      navigate('/login')
      return
    }
    
    alert('Application submitted successfully!')
  }

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setLocationFilter('')
    setFilterType('all')
    setExperienceFilter('all')
    setSalaryFilter('all')
  }

  const FiltersSidebar = () => (
    <div className="space-y-6">
      {/* Job Type Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Job Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {['all', 'Full-time', 'Part-time', 'Contract', 'Internship'].map(type => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer hover:bg-accent p-2 rounded-md transition-colors">
              <input
                type="radio"
                name="jobType"
                value={type}
                checked={filterType === type}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm capitalize">{type}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Experience Level */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Experience Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { value: 'all', label: 'All Levels' },
            { value: '0-2', label: 'Entry Level (0-2 years)' },
            { value: '2-5', label: 'Mid Level (2-5 years)' },
            { value: '5+', label: 'Senior (5+ years)' }
          ].map(exp => (
            <label key={exp.value} className="flex items-center space-x-2 cursor-pointer hover:bg-accent p-2 rounded-md transition-colors">
              <input
                type="radio"
                name="experience"
                value={exp.value}
                checked={experienceFilter === exp.value}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">{exp.label}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={clearFilters}
      >
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2">
            Discover Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dream Job</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore {allJobs.length}+ opportunities from top companies
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 shadow-lg border-2">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Job title, keywords, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Location or remote..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 px-8"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="md:hidden h-12"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {loading ? (
              <p className="text-muted-foreground">Loading jobs...</p>
            ) : error ? (
              <p className="text-destructive">{error}</p>
            ) : (
              <>
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredJobs.length}</span> of{' '}
                  <span className="font-semibold text-foreground">{allJobs.length}</span> jobs
                </p>
                {(searchTerm || locationFilter || filterType !== 'all') && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-primary"
                  >
                    Clear filters
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden md:block w-80 shrink-0">
            <div className="sticky top-24">
              <FiltersSidebar />
            </div>
          </aside>

          {/* Mobile Filters */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
                onClick={() => setShowMobileFilters(false)}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25 }}
                  className="absolute left-0 top-0 bottom-0 w-80 bg-background border-r shadow-2xl overflow-y-auto p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowMobileFilters(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <FiltersSidebar />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Jobs Grid */}
          <div className="flex-1">
            {filteredJobs.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <Search className="h-16 w-16" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">No jobs found</h3>
                      <p>Try adjusting your search criteria or filters</p>
                    </div>
                    <Button onClick={clearFilters} variant="outline">
                      Clear All Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 hover:border-primary/50 border-2 group">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Company Logo */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg">
                              {job.logo}
                            </div>
                          </div>

                          {/* Job Details */}
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 
                                  className="text-xl font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer"
                                  onClick={() => navigate(`/jobs/${job.id}`)}
                                >
                                  {job.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                                  <Building2 className="h-4 w-4" />
                                  <span className="font-medium">{job.company}</span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="shrink-0"
                                onClick={() => toggleSaveJob(job.id)}
                              >
                                <Bookmark 
                                  className={`h-5 w-5 ${savedJobs.has(job.id) ? 'fill-primary text-primary' : ''}`} 
                                />
                              </Button>
                            </div>

                            {/* Job Meta Info */}
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                <span>{job.type}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>{job.experience}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{job.posted}</span>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-muted-foreground line-clamp-2">
                              {job.description}
                            </p>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-2">
                              {job.skills.slice(0, 4).map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="px-3 py-1">
                                  {skill}
                                </Badge>
                              ))}
                              {job.skills.length > 4 && (
                                <Badge variant="outline" className="px-3 py-1">
                                  +{job.skills.length - 4} more
                                </Badge>
                              )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center gap-4">
                                <div className="text-lg font-bold text-green-600">
                                  {job.salary}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {job.applicants} applicants
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline"
                                  onClick={() => navigate(`/jobs/${job.id}`)}
                                >
                                  View Details
                                </Button>
                                <Button 
                                  onClick={() => handleApply(job.id)}
                                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                  Apply Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
