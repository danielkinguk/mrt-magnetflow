*MagnetFlow* - Visualize Your Ideas, Unleash Your Flow

Interactive digital canvas application for MR team collaboration and resource management. Built with Next.js 15, TypeScript, and Tailwind CSS.

**Multiple Board Types**: Support for MRT (Mountain Rescue Team), Inspiration, Personal, Work, and Generic boards
**Dynamic Navigation**: Seamless switching between different board types via sidebar
**Board-Specific Functionality**: Each board type has specialized features and layouts
**Persistent Board State**: Individual board configurations and data management
**New Board Creation**: Add new boards with custom configurations and sample content

### Team Management
**Editable Team Member Cards**: Double-click to edit names, roles, and skills
**Skill Visualization**: Color-coded skill indicators for quick identification
**Role Assignment**: Support for different roles (default, driver, leader)
**Resource Types**: Distinguish between people and equipment with visual indicators
**Dynamic Assignment**: Drag team members between vehicles, teams, or unassigned areas

### Vehicle & Team Organization
**Resource Columns**: Organized columns for vehicles and teams with visual hierarchy
**Smart Drop Zones**: Automatic assignment when dropping team members into containers
**Resizable Components**: Adjustable column and card sizes with resize handles
**Container Management**: Add, remove, and reorganize vehicles and teams

### Advanced UI/UX
**Fullscreen Mode**: Maximize workspace with fullscreen toggle
**Responsive Design**: Works seamlessly across desktop and mobile devices
**Dark/Light Theme**: Built-in theme switching with single-click toggle
**Smooth Animations**: Subtle transitions and hover effects
**Accessibility**: Keyboard navigation, screen reader support, and WCAG compliance
**Sidebar Navigation**: Collapsible sidebar with keyboard shortcuts (Ctrl/Cmd + B)
**Simplified Menu**: Clean navigation with Home, Boards, and Logout options
**Zoom Controls**: Interactive zoom in/out with percentage display and reset functionality
**Smooth Drag Performance**: Optimized drag-and-drop with hardware acceleration
**Consistent Footer**: Professional footer with branding across all pages
**Layout Optimization**: Conditional layouts for different page types (boards vs. other pages)


## Getting Started

### Prerequisites
Node.js 18+
npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd studio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file with your configuration:

   ```env
   # Add your environment variables here
   # Google AI API keys for Genkit integration
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:9003](http://localhost:9003)

### Available Scripts

`npm run dev` - Start development server with Turbopack on port 9003
`npm run build` - Build for production
`npm run start` - Start production server
`npm run lint` - Run ESLint for code quality
`npm run typecheck` - Run TypeScript type checking
`npm run genkit:dev` - Start Genkit AI development server
`npm run genkit:watch` - Start Genkit with file watching

## Project Structure

```
src/
├── ai/                    # AI integration
│   ├── dev.ts            # AI development setup
│   ├── genkit.ts         # Genkit configuration
│   └── flows/            # AI workflows
│       └── suggest-connections.ts
├── app/                  # Next.js App Router
│   ├── (main)/          # Main layout group
│   │   ├── boards/      # Board pages with dynamic routing
│   │   └── layout.tsx   # Main layout with sidebar
│   ├── welcome/         # Welcome page
│   ├── globals.css      # Global styles and theme variables
│   └── layout.tsx       # Root layout with theme provider
├── components/          # React components
│   ├── mrt/            # Mountain Rescue Team components
│   │   ├── mountain-rescue-board.tsx    # Main MRT board with zoom controls
│   │   ├── board-client-page.tsx        # MRT client wrapper
│   │   ├── generic-board.tsx            # Generic board system
│   │   ├── generic-board-simple.tsx     # Simplified generic board
│   │   ├── resource-column.tsx          # Resource containers
│   │   ├── team-member-card.tsx         # Team member cards
│   │   └── mrt-toolbar.tsx              # MRT toolbar
│   ├── ui/             # Reusable UI components (Radix-based)
│   ├── header.tsx      # Header with share dropdown and controls
│   ├── theme-toggle.tsx # Simplified theme toggle
│   └── ...             # Other components
├── hooks/              # Custom React hooks
│   ├── use-fullscreen.tsx    # Fullscreen management
│   ├── use-mobile.tsx        # Mobile detection
│   └── use-toast.ts          # Toast notifications
├── lib/                # Utility libraries
│   ├── mrt/           # MRT-specific utilities
│   │   ├── types.ts           # TypeScript type definitions
│   │   ├── data.ts            # Initial data and skills
│   │   └── board-data.ts      # Board configurations
│   └── utils.ts       # General utilities
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

To be discussed. 
