import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Companies</h1>
            <p className="text-lg text-gray-600">Find your next career opportunity with top companies</p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Companies</label>
                  <Input
                    type="text"
                    placeholder="Company name, industry, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select
                    value={filterIndustry}
                    onChange={(e) => setFilterIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredCompanies.length} of {companies.length} companies
            </p>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="hover:shadow-xl transition-shadow duration-300 bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                      {company.logo}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold text-gray-900 mb-1">
                        {company.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <span>{company.industry}</span>
                        <span>•</span>
                        <span>{company.location}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{company.size}</span>
                        <span>•</span>
                        <span>Founded {company.founded}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-medium">{company.rating}</span>
                      </div>
                      <div className="text-sm text-gray-500">{company.jobs} open jobs</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{company.description}</p>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => navigate(`/companies/${company.id}`)}
                      variant="outline"
                      className="flex-1"
                    >
                      View Company
                    </Button>
                    <Button 
                      onClick={() => navigate('/jobs')}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      View Jobs ({company.jobs})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="text-lg font-medium mb-2">No companies found</h3>
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
