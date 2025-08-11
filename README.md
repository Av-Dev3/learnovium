# LearnovAI

AI-powered learning paths with daily micro-lessons and reminders.

## 🚀 Features

- **AI-Powered Learning**: Personalized learning paths based on your goals
- **Daily Micro-Lessons**: Bite-size lessons delivered daily
- **Smart Reminders**: Intelligent notifications to keep you learning
- **Progress Tracking**: Monitor your learning journey with detailed analytics
- **Dark Mode**: Beautiful light and dark themes
- **Responsive Design**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Components**: shadcn/ui
- **Theming**: next-themes
- **Icons**: Lucide React
- **Fonts**: Inter + DM Sans

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/learnovai.git
   cd learnovai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── about/             # About page
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── app-header.tsx    # Main navigation header
├── lib/                  # Utility functions
└── styles/               # Global styles
```

## 🎨 Design System

### Color Tokens
- **Brand**: Primary brand color for CTAs and highlights
- **Background**: Light/dark mode backgrounds
- **Foreground**: Text colors
- **Muted**: Secondary text and subtle elements
- **Card**: Card backgrounds and borders

### Typography
- **Body**: Inter font for general text
- **Headings**: DM Sans font for titles and headings

## 🌙 Dark Mode

The application supports both light and dark themes with automatic system preference detection. Users can manually toggle between themes using the theme toggle in the header.

## 📱 Responsive Design

Built with a mobile-first approach, the application provides an optimal experience across all device sizes:
- Mobile: Hamburger menu with slide-out navigation
- Tablet: Adaptive layouts with optimized spacing
- Desktop: Full navigation with enhanced features

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### TailwindCSS
Custom configuration in `tailwind.config.ts` with:
- Extended color palette
- Custom font families
- Dark mode support
- Animation utilities

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy automatically on every push

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Lucide](https://lucide.dev/) - Beautiful icons
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact us at support@learnovai.com
- Join our community Discord

---

Built with ❤️ by the LearnovAI team
