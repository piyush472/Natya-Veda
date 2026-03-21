# NatyaVeda - A Cultural Learning Platform for Indian Classical Dance

A clean, minimal, and modern web platform for exploring Indian classical dance traditions. Built with React, Vite, TailwindCSS, and React Router.

## 🎭 About NatyaVeda

NatyaVeda is dedicated to making Indian classical dance traditions accessible to learners worldwide. The platform combines traditional knowledge with modern technology to create an immersive learning experience that honors the authenticity of these art forms.

## 🚀 Features

- **Dance Explorer** - Detailed information about India's eight classical dance forms
- **Interactive Learning** - Learn about mudras, philosophy, history, and cultural significance
- **Mudra Detection** - Real-time hand gesture recognition (UI ready, MediaPipe integration coming)
- **Knowledge Graph** - Understanding connections between dances, mudras, rasas, and deities
- **Responsive Design** - Beautiful UI that works on all devices
- **Dark Theme** - Minimal, elegant, and culturally inspired design

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx       # Navigation bar with links
│   ├── Hero.jsx         # Hero section with CTA buttons
│   ├── DanceCard.jsx    # Card component for dance forms
│   ├── FeatureCard.jsx  # Card component for features
│   └── Footer.jsx       # Footer with links and info
├── pages/
│   ├── Home.jsx         # Home page with hero, featured dances, features
│   ├── Dances.jsx       # All dance forms grid
│   ├── DanceDetail.jsx  # Detailed view of a dance form
│   ├── MudraDetection.jsx # Mudra detection interface
│   └── About.jsx        # About NatyaVeda
├── data/
│   └── dances.js        # Dance forms and mudra data
├── App.jsx              # Main app with React Router
├── main.jsx             # Vite entry point
└── index.css            # Global styles with TailwindCSS
```

## 🛠 Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **JavaScript (ES6+)** - Modern JavaScript

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Navigate to project directory**
   ```bash
   cd "New folder"
   ```

2. **Install dependencies** (if not already done)
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Visit `http://localhost:5173` (default Vite port)

## 🎨 Pages

### 1. **Home Page** (`/`)
- Hero section with platform introduction
- Featured dance forms showcase
- Platform features highlight
- Call-to-action buttons

### 2. **Dances Page** (`/dances`)
- Grid layout of all dance forms
- Filter buttons (optional)
- Card-based design
- Links to detailed views

### 3. **Dance Detail Page** (`/dance/:id`)
- Hero section with dance name
- Complete dance information
- History, temple traditions, philosophy
- Associated mudras and characteristics
- Knowledge graph placeholder
- Navigation to previous/next dances

### 4. **Mudra Detection Page** (`/mudra-detection`)
- Webcam placeholder UI
- Start/Reset detection buttons
- Detected mudra information display
- Complete mudra reference library
- Educational content about mudras

### 5. **About Page** (`/about`)
- Mission and vision statements
- Platform features overview
- Eight classical dances reference
- Technology stack information

## 🎓 Data Structure

### Dances Object
Each dance includes:
- `id` - Unique identifier
- `name` - Dance form name
- `origin` - Geographic origin
- `image` - Placeholder image URL
- `description` - Detailed description
- `shortDescription` - Brief overview
- `history` - Historical information
- `templetraditions` - Temple connection
- `philosophy` - Philosophical foundation
- `mudras` - Key mudras used
- `characteristics` - Unique features

### Mudras Object
Each mudra includes:
- `id` - Unique identifier
- `name` - Mudra name
- `meaning` - Translation
- `description` - Technical description
- `culturalSignificance` - Cultural meaning
- `associatedRasa` - Associated emotion/rasa

## 🎨 Design System

### Color Palette
- **Dark Background** - `#0f0f0f`
- **Dark Card** - `#1a1a1a`
- **Dark Border** - `#2a2a2a`
- **Accent Gold** - `#d4af37`
- **Accent Orange** - `#e74c3c`

### Typography
- **Font Family** - Segoe UI, Tahoma, Geneva, Verdana
- **Headings** - Bold, accent colors
- **Body Text** - Light gray (#f5f5f5)

### Components
- Smooth transitions (0.3s ease)
- Hover effects with scale and color changes
- Responsive grid layouts
- Accent accent underlines on feature cards

## 🔄 Navigation

The app uses React Router for client-side navigation:
- `/` - Home
- `/dances` - Dance forms gallery
- `/dance/:id` - Individual dance details
- `/mudra-detection` - Mudra detection UI
- `/about` - About page

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (if configured)
npm run lint
```

## 🚀 Future Enhancements

- [ ] MediaPipe integration for real mudra detection
- [ ] Interactive knowledge graph visualization
- [ ] Video content integration
- [ ] Backend API integration
- [ ] User authentication
- [ ] Learning progress tracking
- [ ] Quiz and assessment features
- [ ] Teacher dashboard
- [ ] Community features

## 🎯 Design Principles

1. **Minimal** - Clean, uncluttered interface
2. **Elegant** - Sophisticated color scheme and typography
3. **Responsive** - Works on all screen sizes
4. **Accessible** - Semantic HTML and good contrast
5. **Fast** - Optimized with Vite
6. **Cultural** - Honors Indian aesthetic traditions

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: md (768px), lg (1024px)
- Flexible grid layouts
- Touch-friendly buttons and interactions

## 🤝 Contributing

This is an open cultural learning platform. Contributions are welcome!

## 📄 License

Open source - Feel free to use and modify for educational purposes.

## 📞 Contact & Support

NatyaVeda - Celebrating the beauty and wisdom of Indian classical dance traditions

---

**Built with ❤️ for cultural preservation and learning**

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
