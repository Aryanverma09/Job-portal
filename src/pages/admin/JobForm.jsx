import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import AdminNavbar from '../../components/AdminNavbar'
import { getToken } from '../../utils/auth'

const initial = {
  title: '',
  company: '',
  location: '',
  type: 'Full-time',
  salary: '',
  experience: '',
  description: '',
  requirements: '',
  skills: []
}

export default function JobForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const navigate = useNavigate()
  const token = getToken()

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return
      try {
        const res = await fetch(`/api/jobs/${id}`)
        if (!res.ok) throw new Error('Failed to load job')
        const data = await res.json()
        const j = data.job
        setForm({
          title: j.title || '',
          company: j.company || '',
          location: j.location || '',
          type: j.type || 'Full-time',
          salary: j.salary || '',
          experience: j.experience || '',
          description: j.description || '',
          requirements: (j.requirements || []).join('\n'),
          skills: j.skills || []
        })
      } catch (e) {
        setError(e.message)
      }
    }
    load()
  }, [id, isEdit])

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSelectChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }))
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Basic validation
    if (!form.title || !form.company) {
      setError('Title and Company are required')
      return
    }
    
    setLoading(true)
    try {
      const payload = {
        title: form.title,
        company: form.company,
        location: form.location,
        type: form.type,
        salary: form.salary,
        experience: form.experience,
        description: form.description,
        requirements: form.requirements.split('\n').map(s => s.trim()).filter(Boolean),
        skills: form.skills
      }
      
      const res = await fetch(isEdit ? `/api/jobs/${id}` : '/api/jobs', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) throw new Error('Failed to save job')
      navigate('/admin/jobs')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/jobs')}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
          
          <h1 className="text-4xl font-bold mb-2">
            {isEdit ? 'Edit' : 'Post a New'}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Job
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {isEdit ? 'Update the job details' : 'Fill in the details to post a new job'}
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <p className="text-destructive font-medium">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the main details about the position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={onChange}
                      placeholder="e.g., Senior Full Stack Developer"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      name="company"
                      value={form.company}
                      onChange={onChange}
                      placeholder="e.g., TechCorp Inc"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={form.location}
                      onChange={onChange}
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type</Label>
                    <Select value={form.type} onValueChange={(value) => handleSelectChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <Input
                      id="experience"
                      name="experience"
                      value={form.experience}
                      onChange={onChange}
                      placeholder="e.g., 5+ years"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    name="salary"
                    value={form.salary}
                    onChange={onChange}
                    placeholder="e.g., $120k - $180k"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
                <CardDescription>Provide detailed information about the role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide a comprehensive overview of the position and what you're looking for
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    value={form.requirements}
                    onChange={onChange}
                    placeholder="List the requirements, one per line:&#10;- 5+ years of experience in full stack development&#10;- Strong knowledge of React and Node.js&#10;- Experience with AWS cloud services"
                    rows={8}
                    className="resize-none font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter each requirement on a new line
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
                <CardDescription>Add skills that are required for this position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="e.g., React, Node.js, TypeScript"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSkill(e)
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddSkill} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="border-2 bg-muted/50">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin/jobs')}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {loading ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isEdit ? 'Update Job' : 'Post Job'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
