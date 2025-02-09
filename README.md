# 🏋️‍♂️ Lift! - Your Ultimate 5/3/1 Workout Companion

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E?style=flat-square&logo=supabase)](https://supabase.io/)
[![Styled with Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

Transform your strength training journey with Lift! - a sleek, modern web app that brings Jim Wendler's legendary 5/3/1 program into the digital age. 

## ✨ Features

- 🎯 **Automatic Progression Tracking**: Never lose track of your training cycles
- 🧮 **Smart Plate Calculator**: Know exactly which plates to load, down to the micro plates
- 📱 **Mobile-First Design**: Perfect for gym use with a clean, matrix-inspired interface
- 🌙 **Dark Mode**: Easy on the eyes during those late-night training sessions
- 🔄 **Progress Tracking**: Mark sets as "Nailed It! 💪" or "Failed It! 😤"
- 📊 **Cycle Reviews**: Get insights into your performance after each training cycle
- 🔐 **Secure Authentication**: Keep your training data private and synced across devices

## 🎮 Demo

Try it now at [lift.neosavvy.com](https://lift.neosavvy.com)

## 🚀 Developer Quickstart

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/neosavvy/lifting.git
   cd lifting
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Run the migrations:
     ```bash
     cd supabase
     npx supabase db push
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Visit `http://localhost:5173`

### Database Schema

The app uses three main tables:
- `fitness_metrics`: Stores max lifts and cycle information
- `lift_completions`: Tracks workout completion status
- `profiles`: User profile data

### Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (auth, theme)
├── pages/         # Page components
├── types/         # TypeScript definitions
└── utils/         # Helper functions
```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Jim Wendler for the 5/3/1 program
- The React and Supabase communities
- All our contributors

---

Built with 💪 by lifters, for lifters
