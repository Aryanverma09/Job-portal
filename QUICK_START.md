# Quick Start Guide - HireHub Job Portal

## 🚀 Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📍 Main Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing Page | Marketing homepage with hero, features, testimonials |
| `/login` | Login | User authentication |
| `/register` | Register | New user registration |
| `/main` | Main Page | User dashboard after login |
| `/jobs` | Job Listings | Browse and search all jobs |
| `/jobs/:id` | Job Details | Detailed job information |
| `/companies` | Companies | Browse companies |
| `/profile` | Candidate Dashboard | User profile and applications |
| `/admin` | Employer Dashboard | Employer overview and metrics |
| `/admin/jobs` | Manage Jobs | List of posted jobs |
| `/admin/jobs/new` | Post Job | Create new job posting |
| `/admin/jobs/:id` | Edit Job | Edit existing job posting |

## 🎨 Key Features

### ✅ Completed Features

1. **🌓 Dark/Light Mode Toggle**
   - System preference detection
   - Persistent theme storage
   - Available on all pages

2. **🏠 Landing Page**
   - Hero section with CTAs
   - Search functionality
   - Featured companies
   - Testimonials
   - Footer with links

3. **💼 Job Listings**
   - Advanced filters (type, location, experience)
   - Search functionality
   - Job cards with company logos
   - Save job functionality
   - Responsive grid layout

4. **📄 Job Details**
   - Tabbed interface (Description, Requirements, Company)
   - Apply button
   - Save/Share functionality
   - Related jobs sidebar

5. **👤 Candidate Dashboard**
   - Profile management
   - Edit profile functionality
   - Skills management
   - Application tracking
   - Saved jobs

6. **🏢 Employer Dashboard**
   - Metrics and analytics
   - Posted jobs management
   - Applicant reviews
   - Charts and graphs

7. **📝 Post Job Form**
   - Comprehensive job details
   - Skills management
   - Form validation
   - Edit existing jobs

8. **🔐 Authentication**
   - Modern login/register pages
   - Password toggle
   - Error handling

## 🎨 Design System

### Colors
- Primary: Blue (#2563EB) to Indigo (#6366F1) gradient
- Background: Light (#F9FAFB) / Dark (system)
- Accent colors for different states

### Components Used
- Buttons (primary, outline, ghost)
- Cards (with shadow-lg)
- Inputs (with icons)
- Badges (for tags/status)
- Tabs (for organized content)
- Select dropdowns
- Modals/Dialogs

### Icons
- Lucide React icon library
- Consistent sizing (h-4 w-4 for small, h-5 w-5 for medium, h-6 w-6 for large)

## 🛠 Tech Stack

- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios

## 📦 Key Dependencies

```json
{
  "react": "^19.1.1",
  "framer-motion": "latest",
  "lucide-react": "^0.544.0",
  "tailwindcss": "^4.1.13",
  "react-router-dom": "^7.9.1",
  "axios": "^1.12.2"
}
```

## 🎯 Common Tasks

### Adding a New Page

1. Create component in `src/pages/YourPage.jsx`
2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/your-path" element={<YourPage/>} />
   ```
3. Add navigation link in `Navbar.jsx`

### Creating a New UI Component

Use shadcn/ui CLI or manually create in `src/components/ui/`:

```jsx
import { cn } from "../../lib/utils"

export function YourComponent({ className, ...props }) {
  return (
    <div className={cn("base-classes", className)} {...props}>
      {/* component content */}
    </div>
  )
}
```

### Adding Dark Mode to New Components

Components automatically support dark mode using Tailwind's `dark:` prefix:

```jsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>
```

### Using Framer Motion

```jsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Animated content
</motion.div>
```

## 📱 Responsive Design

All pages are fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px

Use Tailwind's responsive prefixes:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## 🔍 Mock Data

Current implementation uses mock data for demonstration. To connect to real backend:

1. Update API endpoints in each page
2. Handle authentication tokens properly
3. Implement error handling
4. Add loading states

## 🎨 Customization

### Change Theme Colors

Edit `src/index.css`:
```css
:root {
  --primary: oklch(0.21 0.034 264.665);
  /* Change to your color */
}
```

### Change Logo/Branding

Update in:
- `LandingPage.jsx`
- `Navbar.jsx`
- `AdminNavbar.jsx`

Replace "HireHub" with your brand name and update icons.

## 🐛 Debugging Tips

1. **Dark mode not working?**
   - Check `ThemeProvider` is wrapping `App` in `main.jsx`
   - Verify `dark` class is added to `<html>` element

2. **Styles not applying?**
   - Check Tailwind config
   - Verify class names are correct
   - Check for CSS specificity issues

3. **Routes not working?**
   - Ensure `BrowserRouter` wraps app
   - Check route paths match exactly
   - Verify imports are correct

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev)
- [React Router Docs](https://reactrouter.com)

## 💡 Tips

1. Use `cn()` utility from `lib/utils.js` for conditional classes
2. Leverage shadcn/ui components for consistency
3. Add animations sparingly for better performance
4. Test dark mode for all new components
5. Keep mobile-first approach when styling

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Deploy to Vercel/Netlify

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy!

---

**Happy Coding! 🎉**

For detailed documentation, see `UI_DOCUMENTATION.md`

