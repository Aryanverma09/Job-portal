import express from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import Category from '../model/category.model.js'
import Skill from '../model/skill.model.js'

const CatalogRoutes = express.Router()
CatalogRoutes.use(requireAuth, requireAdmin)

// Categories CRUD
CatalogRoutes.get('/categories', async (req, res) => {
  const items = await Category.find({}).sort({ name: 1 }).lean()
  res.json({ items })
})

CatalogRoutes.post('/categories', async (req, res) => {
  const { name, slug } = req.body || {}
  if (!name || !slug) return res.status(400).json({ message: 'name and slug required' })
  const created = await Category.create({ name, slug })
  res.status(201).json({ item: created })
})

CatalogRoutes.patch('/categories/:id', async (req, res) => {
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!updated) return res.status(404).json({ message: 'Category not found' })
  res.json({ item: updated })
})

CatalogRoutes.delete('/categories/:id', async (req, res) => {
  const deleted = await Category.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ message: 'Category not found' })
  res.json({ message: 'Deleted' })
})

// Skills CRUD
CatalogRoutes.get('/skills', async (req, res) => {
  const items = await Skill.find({}).sort({ name: 1 }).lean()
  res.json({ items })
})

CatalogRoutes.post('/skills', async (req, res) => {
  const { name, slug } = req.body || {}
  if (!name || !slug) return res.status(400).json({ message: 'name and slug required' })
  const created = await Skill.create({ name, slug })
  res.status(201).json({ item: created })
})

CatalogRoutes.patch('/skills/:id', async (req, res) => {
  const updated = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!updated) return res.status(404).json({ message: 'Skill not found' })
  res.json({ item: updated })
})

CatalogRoutes.delete('/skills/:id', async (req, res) => {
  const deleted = await Skill.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ message: 'Skill not found' })
  res.json({ message: 'Deleted' })
})

export default CatalogRoutes



