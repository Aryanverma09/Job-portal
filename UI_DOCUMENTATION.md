# HireHub - Modern Job Portal UI Documentation

A production-ready, modern job portal built with React, Vite, Tailwind CSS, and shadcn/ui components.

## 🎨 Design Philosophy

This job portal follows modern design principles inspired by leading platforms like LinkedIn Jobs, Indeed, and Wellfound (AngelList), featuring:

- **Clean & Minimal**: Distraction-free interface focusing on content
- **Professional**: Enterprise-grade design suitable for both candidates and employers
- **Responsive**: Fully responsive across all device sizes
- **Accessible**: High accessibility standards with proper ARIA labels and semantic HTML
- **Modern Aesthetics**: Glassmorphism, soft gradients, and smooth animations

## 🎯 Key Features

### 1. **Dark/Light Mode**
- System preference detection
- Persistent theme storage
- Smooth theme transitions
- Available across all pages

### 2. **Animations & Interactions**
- Framer Motion for smooth page transitions
- Hover effects on interactive elements
- Loading states and micro-interactions
- Staggered animations for list items

### 3. **Design System**
- Consistent color palette (Blue #2563EB / Indigo #6366F1)
- Typography: System fonts with fallbacks
- Spacing: Consistent padding and margins
- Border radius: Rounded corners (rounded-2xl for cards)
- Shadows: Layered shadow system for depth

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── avatar.jsx
│   │   ├── badge.jsx
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── input.jsx
│   │   ├── label.jsx
│   │   ├── select.jsx
│   │   ├── tabs.jsx
│   │   └── textarea.jsx
│   ├── AdminNavbar.jsx        # Employer dashboard navbar
│   ├── Navbar.jsx             # Main application navbar
│   ├── ThemeProvider.jsx      # Dark mode context provider
│   └── ThemeToggle.jsx        # Dark/light mode toggle button
│
├── pages/
│   ├── LandingPage.jsx        # Marketing landing page
│   ├── Jobs.jsx               # Job listings with filters
│   ├── JobDetail.jsx          # Individual job details
│   ├── Profile.jsx            # Candidate dashboard
│   ├── Login.jsx              # Authentication - Login
│   ├── Register.jsx           # Authentication - Register
│   └── admin/
│       ├── Dashboard.jsx      # Employer dashboard
│       └── JobForm.jsx        # Post/edit job form
│
├── utils/
│   └── auth.js                # Authentication utilities
│
└── lib/
    └── utils.js               # Utility functions (cn, etc.)
```

## 🎨 Pages Overview

### 1. Landing Page (`/`)

**Features:**
- Hero section with headline and CTAs
- Search bar for quick job search
- Statistics showcase (10K+ jobs, 5K+ companies)
- Features section highlighting platform benefits
- Featured companies carousel
- Testimonials from successful candidates
- Call-to-action section
- Comprehensive footer with links

**Design Elements:**
- Gradient text for headings
- Glassmorphism cards
- Animated stats counters
- Smooth scroll animations

### 2. Job Listings Page (`/jobs`)

**Features:**
- Advanced search functionality
- Multi-filter sidebar:
  - Job Type (Full-time, Part-time, Contract, Internship)
  - Experience Level (Entry, Mid, Senior)
  - Location
  - Salary Range
- Job cards with:
  - Company logo
  - Job title and description
  - Skills tags
  - Salary range
  - Applicant count
  - Save job functionality
- Responsive grid layout
- Empty state handling

**Design Elements:**
- Sticky filters sidebar
- Mobile-friendly filter drawer
- Hover effects on cards
- Badge components for skills
- Loading and error states

### 3. Job Details Page (`/jobs/:id`)

**Features:**
- Comprehensive job information
- Tabbed interface:
  - Description tab (role, responsibilities, skills, benefits)
  - Requirements tab (required & nice-to-have)
  - Company tab (company info, size, industry, website)
- Apply button with status tracking
- Save job functionality
- Share job feature
- Related jobs sidebar
- Sticky apply card

**Design Elements:**
- Large company logo
- Salary highlight in green
- Badge system for status
- Smooth tab transitions
- Related jobs with mini cards

### 4. Candidate Dashboard (`/profile`)

**Features:**
- Profile overview with avatar
- Edit profile functionality
- Skills management (add/remove)
- Professional links (LinkedIn, GitHub, Portfolio)
- Applications tracking with status:
  - Under Review
  - Interview Scheduled
  - Rejected
- Saved jobs section
- Quick stats (applied jobs, saved jobs, profile views)

**Tabs:**
1. Overview - Profile information
2. Applications - Job application history
3. Saved Jobs - Bookmarked positions

**Design Elements:**
- Gradient avatar with initials
- Status badges with color coding
- Inline editing for profile
- Responsive layout

### 5. Employer Dashboard (`/admin`)

**Features:**
- Overview metrics:
  - Total Jobs
  - Total Applicants
  - Active Jobs
  - Pending Reviews
- Charts and analytics:
  - Application trends (7-day graph)
  - Jobs by category distribution
- Posted jobs management
- Recent applicants review
- Quick actions (Edit, View Details)

**Tabs:**
1. My Jobs - Active job listings
2. Recent Applicants - Latest applications

**Design Elements:**
- Gradient stat cards with icons
- Animated bar charts
- Progress bars for categories
- Action buttons for each job

### 6. Post Job Form (`/admin/jobs/new`)

**Features:**
- Comprehensive job posting form:
  - Basic Information (title, company, location, type, experience, salary)
  - Job Description (detailed description, requirements)
  - Skills (add/remove multiple skills)
- Form validation
- Edit existing jobs
- Auto-save draft functionality

**Design Elements:**
- Sectioned cards for organization
- Inline skill tags with remove option
- Select dropdowns for job type
- Rich textarea for descriptions
- Prominent save button

### 7. Authentication Pages (`/login`, `/register`)

**Features:**
- Modern login/register forms
- Email and password validation
- Show/hide password toggle
- Error message display
- Success notifications
- Redirect after authentication
- Links to switch between login/register
- Back to home button

**Design Elements:**
- Gradient background with blur effects
- Centered card layout
- Icon-enhanced input fields
- Animated form appearance
- Theme toggle in header

## 🎨 Component Library

### UI Components (shadcn/ui)

1. **Button** - Multiple variants (default, outline, ghost, destructive)
2. **Card** - Container component with header, content, footer
3. **Input** - Text input with focus states
4. **Label** - Form labels with accessibility
5. **Badge** - Tag-like components with variants
6. **Select** - Dropdown select with custom styling
7. **Tabs** - Tabbed interface component
8. **Textarea** - Multi-line text input
9. **Avatar** - Profile picture component

### Custom Components

1. **ThemeProvider** - Context provider for dark mode
2. **ThemeToggle** - Sun/Moon toggle button with animation
3. **Navbar** - Main navigation with user menu
4. **AdminNavbar** - Employer dashboard navigation

## 🎨 Styling Guide

### Colors

```css
/* Light Mode */
--background: oklch(1 0 0);           /* White */
--foreground: oklch(0.13 0.028 261);  /* Near Black */
--primary: oklch(0.21 0.034 264);     /* Dark Blue */
--accent: #2563EB to #6366F1;         /* Blue to Indigo gradient */

/* Dark Mode */
--background: oklch(0.13 0.028 261);  /* Near Black */
--foreground: oklch(0.985 0.002 247); /* Off White */
--primary: oklch(0.928 0.006 264);    /* Light Blue */
```

### Typography

- **Headings**: Bold, gradient text for emphasis
- **Body**: System font stack with good readability
- **Monospace**: For code and technical content

### Spacing

- Container max-width: `max-w-7xl` (1280px)
- Card padding: `p-6` (1.5rem)
- Section padding: `py-20` (5rem vertical)
- Gap between elements: `gap-4` to `gap-8`

### Animations

```javascript
// Page entry
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Hover scale
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}

// Staggered children
transition={{ delay: index * 0.1 }}
```

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= 16.x
npm >= 7.x
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup

The UI is designed to work with mock data for demonstration. For production:

1. Update API endpoints in each page component
2. Configure authentication endpoints in `Login.jsx` and `Register.jsx`
3. Set up proper error handling and loading states

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations

- Collapsible navigation menu
- Drawer-based filters
- Stacked card layouts
- Touch-friendly buttons (min 44px height)
- Optimized images and lazy loading

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Color contrast meeting WCAG AA standards
- Screen reader friendly

## 🎯 Best Practices

1. **Performance**
   - Code splitting with React lazy loading
   - Optimized images
   - Minimal bundle size
   - Efficient re-renders with React.memo

2. **Code Quality**
   - Consistent component structure
   - Reusable components
   - Clear prop typing
   - Meaningful variable names

3. **User Experience**
   - Loading states for all async operations
   - Error boundaries
   - Empty states with helpful messages
   - Optimistic UI updates

## 🔧 Customization

### Changing Colors

Edit `src/index.css`:

```css
:root {
  --primary: /* your color */;
  --accent: /* your color */;
}
```

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Update navigation in `Navbar.jsx`

### Modifying Components

All UI components are in `src/components/ui/` and can be customized while maintaining the design system.

## 📄 License

This project is created as a demonstration of modern React UI development.

## 🙏 Acknowledgments

- Design inspired by LinkedIn Jobs, Indeed, and Wellfound
- UI components from shadcn/ui
- Icons from Lucide React
- Animations powered by Framer Motion

---

**Built with ❤️ using React, Vite, Tailwind CSS, and shadcn/ui**


