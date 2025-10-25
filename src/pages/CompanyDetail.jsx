import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Building2,
  MapPin,
  Users,
  Calendar,
  Star,
  Globe,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  ArrowLeft,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle2,
  ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar'
import Navbar from '../components/Navbar'

// ============================================
// MOCK DATA - Enhanced company information
// ============================================
const companiesData = {
  'a': {
    id: 'a',
    name: 'TechCorp',
    tagline: 'Building the future of work',
    industry: 'Software Development',
    location: 'San Francisco, CA',
    size: '100-500 employees',
    founded: '2015',
    website: 'www.techcorp.com',
    email: 'careers@techcorp.com',
    phone: '+1 (555) 123-4567',
    rating: 4.5,
    logo: 'TC',
    coverImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    
    about: 'TechCorp is a leading software company building innovative solutions for modern businesses. We focus on creating tools that help teams collaborate more effectively and ship faster. Our products are used by over 10,000 companies worldwide.',
    
    mission: 'To empower teams worldwide with cutting-edge software solutions that drive productivity and innovation. We believe in the power of technology to transform how people work and collaborate.',
    
    values: ['Innovation', 'Collaboration', 'Excellence', 'Diversity', 'Growth Mindset', 'Customer First'],
    
    culture: 'We foster a culture of continuous learning, open communication, and work-life balance. Our team is diverse, passionate, and committed to making a positive impact.',
    
    benefits: [
      'Competitive salary + equity',
      'Comprehensive health, dental & vision',
      '401(k) matching',
      'Unlimited PTO',
      'Remote work options',
      'Learning & development budget',
      'Home office stipend',
      'Wellness programs',
      'Team building events',
      'Parental leave'
    ],
    
    socialLinks: {
      linkedin: 'https://linkedin.com/company/techcorp',
      twitter: 'https://twitter.com/techcorp',
      website: 'https://techcorp.com'
    },
    
    // Team members
    team: [
      { name: 'Sarah Johnson', role: 'CEO & Founder', avatar: 'SJ', image: null },
      { name: 'Michael Chen', role: 'CTO', avatar: 'MC', image: null },
      { name: 'Emily Rodriguez', role: 'VP of Engineering', avatar: 'ER', image: null },
      { name: 'David Kim', role: 'Head of Design', avatar: 'DK', image: null },
      { name: 'Lisa Wang', role: 'VP of Product', avatar: 'LW', image: null },
      { name: 'James Taylor', role: 'Head of People', avatar: 'JT', image: null }
    ],
    
    // Active job listings
    jobs: [
      {
        id: 1,
        title: 'Senior Full Stack Engineer',
        type: 'Full-time',
        location: 'Remote',
        salary: '$120k - $180k',
        posted: '2 days ago',
        description: 'Join our engineering team to build scalable web applications.',
        skills: ['React', 'Node.js', 'TypeScript', 'AWS']
      },
      {
        id: 2,
        title: 'Product Designer',
        type: 'Full-time',
        location: 'San Francisco, CA',
        salary: '$100k - $140k',
        posted: '1 week ago',
        description: 'Design beautiful user experiences for our products.',
        skills: ['Figma', 'UI/UX', 'Prototyping']
      },
      {
        id: 3,
        title: 'DevOps Engineer',
        type: 'Full-time',
        location: 'Remote',
        salary: '$110k - $160k',
        posted: '3 days ago',
        description: 'Build and maintain our cloud infrastructure.',
        skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform']
      },
      {
        id: 4,
        title: 'Marketing Manager',
        type: 'Full-time',
        location: 'San Francisco, CA',
        salary: '$90k - $130k',
        posted: '5 days ago',
        description: 'Lead our marketing efforts and grow our brand.',
        skills: ['SEO', 'Content Marketing', 'Analytics']
      }
    ],
    
    stats: {
      employees: '250+',
      offices: '5',
      countries: '12',
      founded: '2015'
    }
  }
}

// ============================================
// COMPONENT: Company Hero Banner
// ============================================
const CompanyHero = ({ company }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl mb-8"
    >
      {/* Background gradient with glassmorphism */}
      <div 
        className="h-64 md:h-80 relative"
        style={{ background: company.coverImage }}
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        
        {/* Content */}
        <div className="relative h-full container mx-auto px-6 flex flex-col justify-end pb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col md:flex-row items-start md:items-end gap-6"
          >
            {/* Company Logo */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white shadow-2xl flex items-center justify-center text-4xl font-bold bg-gradient-to-br from-blue-600 to-violet-600 text-white">
              {company.logo}
            </div>
            
            {/* Company Info */}
            <div className="flex-1 text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{company.name}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-3">{company.tagline}</p>
              <div className="flex flex-wrap gap-4 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{company.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{company.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Founded {company.founded}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span>{company.rating} rating</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// COMPONENT: Company Information Section
// ============================================
const CompanyInfo = ({ company }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Card className="border-2 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl">About {company.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* About */}
          <div>
            <p className="text-muted-foreground leading-relaxed">{company.about}</p>
          </div>
          
          {/* Mission */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              Our Mission
            </h3>
            <p className="text-muted-foreground leading-relaxed">{company.mission}</p>
          </div>
          
          {/* Values */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Our Values</h3>
            <div className="flex flex-wrap gap-2">
              {company.values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="px-4 py-2 text-sm bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/30 dark:to-violet-950/30 border border-blue-200 dark:border-blue-800"
                  >
                    {value}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Culture */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Culture</h3>
            <p className="text-muted-foreground leading-relaxed">{company.culture}</p>
          </div>
          
          {/* Benefits */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Benefits & Perks</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {company.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50/50 to-violet-50/50 dark:from-blue-950/20 dark:to-violet-950/20"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ============================================
// COMPONENT: Active Job Listings
// ============================================
const JobListings = ({ company, navigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-8"
    >
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Open Positions</CardTitle>
            <Badge className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-3 py-1">
              {company.jobs.length} Jobs
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {company.jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-700">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 font-medium">
                          <DollarSign className="h-4 w-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{job.posted}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills.slice(0, 4).map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:items-end">
                      <Button
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 w-full md:w-auto"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="w-full md:w-auto"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ============================================
// COMPONENT: Team Section
// ============================================
const TeamSection = ({ company }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mt-8"
    >
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Meet Our Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {company.team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="flex flex-col items-center text-center"
              >
                <Avatar className="w-20 h-20 mb-3 ring-4 ring-blue-100 dark:ring-blue-900">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-violet-600 text-white text-lg font-semibold">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                <h4 className="font-semibold text-sm mb-1">{member.name}</h4>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ============================================
// COMPONENT: Company Sidebar (Stats, Contact, Social)
// ============================================
const CompanySidebar = ({ company }) => {
  return (
    <div className="space-y-6">
      {/* Company Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="border-2 bg-gradient-to-br from-blue-50/50 to-violet-50/50 dark:from-blue-950/20 dark:to-violet-950/20">
          <CardHeader>
            <CardTitle className="text-lg">Company Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-black/20">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  {company.stats.employees}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Employees</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-black/20">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  {company.stats.offices}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Offices</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-black/20">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  {company.stats.countries}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Countries</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-black/20">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  {company.stats.founded}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Founded</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <a 
                href={`https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
              >
                <Globe className="h-5 w-5 text-muted-foreground group-hover:text-blue-600" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{company.website}</div>
                  <div className="text-xs text-muted-foreground">Website</div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
              
              <a 
                href={`mailto:${company.email}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
              >
                <Mail className="h-5 w-5 text-muted-foreground group-hover:text-blue-600" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{company.email}</div>
                  <div className="text-xs text-muted-foreground">Email</div>
                </div>
              </a>
              
              <div className="flex items-center gap-3 p-3 rounded-lg">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{company.phone}</div>
                  <div className="text-xs text-muted-foreground">Phone</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Follow Us</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <motion.a
                href={company.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:shadow-lg transition-shadow"
              >
                <Linkedin className="h-6 w-6" />
              </motion.a>
              <motion.a
                href={company.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white hover:shadow-lg transition-shadow"
              >
                <Twitter className="h-6 w-6" />
              </motion.a>
              <motion.a
                href={company.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-violet-600 to-violet-700 text-white hover:shadow-lg transition-shadow"
              >
                <Globe className="h-6 w-6" />
              </motion.a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* CTA Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card className="border-2 bg-gradient-to-br from-blue-600 to-violet-600 text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Join Our Team!</h3>
            <p className="text-sm text-blue-50 mb-4">
              We're looking for talented individuals to join our mission.
            </p>
            <Button 
              variant="secondary" 
              className="w-full bg-white text-blue-600 hover:bg-blue-50"
            >
              View All {company.jobs.length} Jobs
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT: Company Detail Page
// ============================================
export default function CompanyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const company = companiesData[id]

  // Handle company not found
  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="text-center p-8 max-w-md">
            <CardContent>
              <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The company you're looking for doesn't exist or has been removed.
              </p>
              <Button 
                onClick={() => navigate('/companies')} 
                className="bg-gradient-to-r from-blue-600 to-violet-600"
              >
                Browse All Companies
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
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/companies')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Companies
          </Button>
        </motion.div>

        {/* Hero Banner */}
        <CompanyHero company={company} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            <CompanyInfo company={company} />
            <JobListings company={company} navigate={navigate} />
            <TeamSection company={company} />
          </div>

          {/* Sidebar - Right Side (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <CompanySidebar company={company} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
