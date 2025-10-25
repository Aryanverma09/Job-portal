# 🏗️ Company Page Component Structure

## Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│                         NAVBAR                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   ← Back to Companies                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     COMPANY HERO BANNER                      │
│  ┌────┐                                                     │
│  │ TC │  TechCorp                                          │
│  └────┘  Building the future of work                       │
│          📍 Location • 👥 Size • 📅 Founded • ⭐ Rating    │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────┐
│                                  │                          │
│         MAIN CONTENT             │        SIDEBAR           │
│         (2/3 width)              │        (1/3 width)       │
│                                  │                          │
│  ┌───────────────────────────┐  │  ┌────────────────────┐ │
│  │   COMPANY INFORMATION     │  │  │   COMPANY STATS    │ │
│  │                           │  │  │                    │ │
│  │  • About                  │  │  │  250+    5        │ │
│  │  • Mission                │  │  │  Employees Offices│ │
│  │  • Values [Badges]        │  │  │                    │ │
│  │  • Culture                │  │  │  12      2015     │ │
│  │  • Benefits [Grid]        │  │  │  Countries Founded│ │
│  └───────────────────────────┘  │  └────────────────────┘ │
│                                  │                          │
│  ┌───────────────────────────┐  │  ┌────────────────────┐ │
│  │   ACTIVE JOB LISTINGS     │  │  │  CONTACT INFO      │ │
│  │   [4 Jobs Badge]          │  │  │                    │ │
│  │                           │  │  │  🌐 Website        │ │
│  │  ┌─────────────────────┐ │  │  │  📧 Email          │ │
│  │  │ Senior Full Stack   │ │  │  │  📞 Phone          │ │
│  │  │ Engineer            │ │  │  └────────────────────┘ │
│  │  │                     │ │  │                          │
│  │  │ Remote • $120k     │ │  │  ┌────────────────────┐ │
│  │  │ [Skills Badges]     │ │  │  │   FOLLOW US        │ │
│  │  │ [View] [Apply]      │ │  │  │                    │ │
│  │  └─────────────────────┘ │  │  │  [in] [tw] [web]   │ │
│  │                           │  │  └────────────────────┘ │
│  │  [3 more job cards...]   │  │                          │
│  └───────────────────────────┘  │  ┌────────────────────┐ │
│                                  │  │  JOIN OUR TEAM!    │ │
│  ┌───────────────────────────┐  │  │  (Gradient CTA)    │ │
│  │   MEET OUR TEAM           │  │  │                    │ │
│  │                           │  │  │  [View All Jobs]   │ │
│  │  [Avatar] [Avatar] [...]  │  │  └────────────────────┘ │
│  │   Name      Name          │  │                          │
│  │   Role      Role          │  │  (Sticky on desktop)    │
│  └───────────────────────────┘  │                          │
│                                  │                          │
└──────────────────────────────────┴──────────────────────────┘
```

---

## Component Hierarchy

```
CompanyDetail
├── Navbar (Global)
├── Back Button
├── CompanyHero
│   ├── Gradient Background
│   ├── Glassmorphism Overlay
│   ├── Company Logo (Card)
│   └── Company Meta Info
├── Main Content Grid
│   ├── Left Column (2/3)
│   │   ├── CompanyInfo
│   │   │   ├── About Section
│   │   │   ├── Mission Section
│   │   │   ├── Values (Badges)
│   │   │   ├── Culture Section
│   │   │   └── Benefits (Grid with Icons)
│   │   ├── JobListings
│   │   │   ├── Header (Title + Badge)
│   │   │   └── Job Cards (Map)
│   │   │       ├── Job Title
│   │   │       ├── Job Description
│   │   │       ├── Job Meta (Type, Location, Salary)
│   │   │       ├── Skills (Badges)
│   │   │       └── Action Buttons
│   │   └── TeamSection
│   │       └── Team Grid (Avatars)
│   └── Right Column (1/3) - Sticky
│       └── CompanySidebar
│           ├── Stats Card (Grid)
│           ├── Contact Info Card
│           ├── Social Links Card
│           └── CTA Card (Gradient)
```

---

## Companies Listing Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                         NAVBAR                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   [Gradient Icon]                           │
│          Discover Amazing Companies                         │
│     Find your next career opportunity...                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│         SEARCH & FILTERS (Glassmorphism Card)               │
│  [Search] [Industry ▼] [Location ▼] [Clear Filters]        │
└─────────────────────────────────────────────────────────────┘

     Showing 6 of 6 companies

┌──────────────┬──────────────┬──────────────┐
│   Company    │   Company    │   Company    │
│   Card #1    │   Card #2    │   Card #3    │
│              │              │              │
│  [Logo]      │  [Logo]      │  [Logo]      │
│  TechCorp    │  FinTech     │  Design      │
│  Software    │  FinTech     │  Design      │
│  Location    │  Location    │  Location    │
│              │              │              │
│  Description │  Description │  Description │
│              │              │              │
│  [Badges]    │  [Badges]    │  [Badges]    │
│  [View] [Jobs│  [View] [Jobs│  [View] [Jobs│
└──────────────┴──────────────┴──────────────┘

┌──────────────┬──────────────┬──────────────┐
│   Company    │   Company    │   Company    │
│   Card #4    │   Card #5    │   Card #6    │
└──────────────┴──────────────┴──────────────┘
```

---

## Key Components Explained

### 1. **CompanyHero**
- **Purpose**: Eye-catching banner showcasing company brand
- **Height**: 64-80 (16-20rem)
- **Background**: CSS gradient via `style` prop
- **Content**: Logo (elevated), name, tagline, key stats
- **Animation**: Fade in + slide from top (0.6s)

### 2. **CompanyInfo**
- **Purpose**: Detailed company information
- **Sections**: About, Mission, Values, Culture, Benefits
- **Layout**: Single column with clear sections
- **Special Features**:
  - Animated badges for values
  - 2-column grid for benefits
  - Checkmark icons for benefits
  - Gradient section headers

### 3. **JobListings**
- **Purpose**: Display active job openings
- **Layout**: Vertical stack of job cards
- **Each Card Contains**:
  - Title (h3, semibold)
  - Description (truncated)
  - Meta info with icons
  - Skills badges
  - Two CTAs (View Details, Apply Now)
- **Hover Effect**: Scale up + border color change

### 4. **TeamSection**
- **Purpose**: Showcase leadership and team
- **Grid**: Responsive (2 → 3 → 6 columns)
- **Avatar**: 80x80px, gradient fallback
- **Content**: Name (semibold) + Role (muted)
- **Animation**: Staggered scale-up on load

### 5. **CompanySidebar**
- **Purpose**: Quick access to key info
- **Sticky**: On desktop (top-24)
- **Contains**: 4 cards
  - Stats (grid, gradient text)
  - Contact (links with icons)
  - Social (animated icon buttons)
  - CTA (gradient background)

---

## Responsive Breakpoints

```
Mobile (default)
- Single column
- Hero: flex-col
- Team: 2 columns

Tablet (md: 768px)
- Cards: 2 columns
- Hero: flex-row

Desktop (lg: 1024px)
- Main: 2/3 width
- Sidebar: 1/3 width, sticky
- Team: 3 columns
- Cards: 3 columns

XL (xl: 1280px)
- Team: 6 columns
- Optimized spacing
```

---

## Color Tokens Used

```css
/* Primary Gradient */
from-blue-600 to-violet-600

/* Light Mode Backgrounds */
from-blue-50/50 to-violet-50/50

/* Dark Mode Backgrounds */
from-blue-950/20 to-violet-950/20

/* Text */
text-foreground         /* Primary text */
text-muted-foreground   /* Secondary text */

/* Borders */
border-blue-300         /* Light mode hover */
border-blue-700         /* Dark mode hover */

/* Accents */
text-green-600          /* Success/benefits */
text-yellow-400         /* Star rating */
```

---

## Animation Timing

```javascript
// Page Load
Hero:     0.0s → 0.6s (fade + slide)
Info:     0.2s → 0.7s (fade + slide)
Jobs:     0.3s → 0.8s (fade + slide)
Team:     0.4s → 0.9s (fade + slide)

// Staggered (Companies page)
Card 1:   0.0s → 0.5s
Card 2:   0.1s → 0.6s
Card 3:   0.2s → 0.7s
... (0.1s increment)

// Hover
Card Lift:    0.2s
Scale:        0.2s
Color:        0.3s (transition-all)
```

---

## Icon System

**lucide-react icons used:**
- `Building2` - Companies, empty states
- `MapPin` - Location
- `Users` - Team size
- `Star` - Rating
- `Briefcase` - Jobs
- `DollarSign` - Salary
- `Clock` - Posted time
- `CheckCircle2` - Benefits, checkmarks
- `Globe` - Website
- `Mail` - Email
- `Phone` - Phone
- `Linkedin` - Social
- `Twitter` - Social
- `ExternalLink` - External links
- `ArrowLeft` - Back button
- `Search` - Search input
- `Filter` - Filter dropdown

---

## Data Structure (Mock)

```javascript
company = {
  id: 'a',
  name: 'TechCorp',
  tagline: 'Building the future of work',
  logo: 'TC',
  coverImage: 'linear-gradient(...)',
  
  industry: 'Software Development',
  location: 'San Francisco, CA',
  size: '100-500 employees',
  founded: '2015',
  rating: 4.5,
  
  website: 'www.techcorp.com',
  email: 'careers@techcorp.com',
  phone: '+1 (555) 123-4567',
  
  about: '...',
  mission: '...',
  culture: '...',
  values: ['Innovation', 'Collaboration', ...],
  benefits: ['Competitive salary', 'Remote work', ...],
  
  socialLinks: {
    linkedin: 'https://...',
    twitter: 'https://...',
    website: 'https://...'
  },
  
  team: [
    { name: 'Sarah Johnson', role: 'CEO', avatar: 'SJ' },
    ...
  ],
  
  jobs: [
    {
      id: 1,
      title: 'Senior Full Stack Engineer',
      type: 'Full-time',
      location: 'Remote',
      salary: '$120k - $180k',
      posted: '2 days ago',
      description: '...',
      skills: ['React', 'Node.js', ...]
    },
    ...
  ],
  
  stats: {
    employees: '250+',
    offices: '5',
    countries: '12',
    founded: '2015'
  }
}
```

---

## File Locations

```
src/pages/
├── CompanyDetail.jsx    (850+ lines)
└── Companies.jsx        (350+ lines)

src/components/ui/
├── avatar.jsx
├── badge.jsx
├── button.jsx
├── card.jsx
└── input.jsx

Documentation/
├── COMPANY_PAGE_ENHANCEMENT.md
└── COMPONENT_STRUCTURE.md (this file)
```

---

**Component structure designed for scalability, maintainability, and excellent UX** ✨

