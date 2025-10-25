import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, MapPin, Users, Star, Briefcase, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import Navbar from '../components/Navbar'

const companies = [
  { 
    id: 'a', 
    name: 'TechCorp', 
    industry: 'Software', 
    location: 'Remote',
    size: '100-500 employees',
    founded: '2015',
    description: 'Leading software company building innovative solutions for modern businesses.',
    jobs: 12,
    rating: 4.5,
    logo: 'TC'
  },
  { 
    id: 'b', 
    name: 'FinTech Solutions', 
    industry: 'Financial Technology', 
    location: 'New York, NY',
    size: '50-200 employees',
    founded: '2018',
    description: 'Revolutionizing financial services with cutting-edge technology and AI.',
    jobs: 8,
    rating: 4.3,
    logo: 'FS'
  },
  { 
    id: 'c', 
    name: 'Design Studio', 
    industry: 'Design & UX', 
    location: 'San Francisco, CA',
    size: '20-100 employees',
    founded: '2016',
    description: 'Creative design agency focused on user experience and digital innovation.',
    jobs: 5,
    rating: 4.7,
    logo: 'DS'
  },
  { 
    id: 'd', 
    name: 'StartupXYZ', 
    industry: 'Technology', 
    location: 'Austin, TX',
    size: '10-50 employees',
    founded: '2020',
    description: 'Fast-growing startup building the future of work and collaboration.',
    jobs: 15,
    rating: 4.2,
    logo: 'SX'
  },
  { 
    id: 'e', 
    name: 'CloudTech', 
    industry: 'Cloud Computing', 
    location: 'Seattle, WA',
    size: '500-1000 employees',
    founded: '2012',
    description: 'Enterprise cloud solutions provider helping businesses scale globally.',
    jobs: 25,
    rating: 4.4,
    logo: 'CT'
  },
  { 
    id: 'f', 
    name: 'AI Innovations', 
    industry: 'Artificial Intelligence', 
    location: 'Boston, MA',
    size: '100-500 employees',
    founded: '2017',
    description: 'Pioneering AI research and development for next-generation applications.',
    jobs: 18,
    rating: 4.6,
    logo: 'AI'
  }
]

export default function Companies(){
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterIndustry, setFilterIndustry] = useState('all')
  const [filterLocation, setFilterLocation] = useState('all')
  const [filteredCompanies, setFilteredCompanies] = useState(companies)

  useEffect(() => {
    let filtered = companies

    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterIndustry !== 'all') {
      filtered = filtered.filter(company => 
        company.industry.toLowerCase().includes(filterIndustry.toLowerCase())
      )
    }

    if (filterLocation !== 'all') {
      filtered = filtered.filter(company => 
        company.location.toLowerCase().includes(filterLocation.toLowerCase())
      )
    }

    setFilteredCompanies(filtered)
  }, [searchTerm, filterIndustry, filterLocation])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with animation */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl">
                <Building2 className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Discover Amazing Companies
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find your next career opportunity with top companies that match your skills and interests
            </p>
          </motion.div>

          {/* Search and Filters with animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="mb-8 shadow-lg border-2 bg-gradient-to-br from-blue-50/50 to-violet-50/50 dark:from-blue-950/20 dark:to-violet-950/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Search Companies
                    </label>
                    <Input
                      type="text"
                      placeholder="Company name, industry..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Industry
                    </label>
                    <select
                      value={filterIndustry}
                      onChange={(e) => setFilterIndustry(e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="all">All Industries</option>
                      <option value="software">Software</option>
                      <option value="fintech">Financial Technology</option>
                      <option value="design">Design & UX</option>
                      <option value="technology">Technology</option>
                      <option value="cloud">Cloud Computing</option>
                      <option value="ai">Artificial Intelligence</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </label>
                    <select
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
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
                        setFilterIndustry('all')
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
          </motion.div>

          {/* Results Count */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-muted-foreground font-medium">
              Showing <span className="text-foreground font-bold">{filteredCompanies.length}</span> of <span className="text-foreground font-bold">{companies.length}</span> companies
            </p>
          </motion.div>

          {/* Companies Grid with staggered animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      {/* Company Logo */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                        {company.logo}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                          {company.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Building2 className="h-3.5 w-3.5" />
                          <span className="truncate">{company.industry}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="truncate">{company.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {company.description}
                    </p>
                    
                    {/* Company Info Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {company.size.split(' ')[0]}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {company.rating}
                      </Badge>
                      <Badge className="text-xs bg-gradient-to-r from-blue-600 to-violet-600 text-white">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {company.jobs} jobs
                      </Badge>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={() => navigate(`/companies/${company.id}`)}
                        variant="outline"
                        className="flex-1"
                      >
                        View Company
                      </Button>
                      <Button 
                        onClick={() => navigate('/jobs')}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
                      >
                        View Jobs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="text-center py-16 border-2">
                <CardContent>
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 rounded-full">
                      <Building2 className="w-16 h-16 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No companies found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search criteria or clear filters
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm('')
                      setFilterIndustry('all')
                      setFilterLocation('all')
                    }}
                    className="bg-gradient-to-r from-blue-600 to-violet-600"
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
