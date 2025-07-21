# MagnetFlow

A modern, interactive digital canvas application for team collaboration and resource management. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Elevator Pitch

**Transform your team's workflow with MagnetFlow** - the intuitive digital canvas that makes collaboration effortless. Whether you're managing emergency response teams, organizing creative projects, or coordinating complex workflows, MagnetFlow provides the visual tools you need to succeed.

**Drag. Drop. Done.** Our magnetic board system lets you organize people, resources, and ideas with unprecedented ease. From mountain rescue operations to creative brainstorming sessions, MagnetFlow adapts to your needs with specialized board types and AI-powered insights.

**Built for modern teams** who demand flexibility, speed, and clarity. Share instantly via WhatsApp, email, or presentation mode. Zoom in for detail or out for the big picture. Tidy up layouts with one click. MagnetFlow isn't just another project management tool - it's your team's digital command center.

## Overview

MagnetFlow provides a digital canvas for teams to organize tasks, brainstorm concepts, and manage projects with intuitive drag-and-drop simplicity. The application features a magnetic board system where users can create, organize, and connect various resources including team members, vehicles, equipment, and teams.

## Key Features

### Multi-Board System

- **Multiple Board Types**: Support for MRT (Mountain Rescue Team), Inspiration, Personal, Work, and Generic boards
- **Dynamic Navigation**: Seamless switching between different board types via sidebar
- **Board-Specific Functionality**: Each board type has specialized features and layouts
- **Persistent Board State**: Individual board configurations and data management
- **New Board Creation**: Add new boards with custom configurations and sample content

### Magnetic Board System

- **Advanced Drag & Drop**: Intuitive drag-and-drop functionality with smart drop detection
- **Infinite Canvas**: Flexible workspace with unlimited positioning and grid snapping
- **Resource Management**: Create and manage team members, vehicles, equipment, and teams
- **Real-time Updates**: Immediate visual feedback during drag operations

### Team Management

- **Editable Team Member Cards**: Double-click to edit names, roles, and skills
- **Skill Visualization**: Color-coded skill indicators for quick identification
- **Role Assignment**: Support for different roles (default, driver, leader)
- **Resource Types**: Distinguish between people and equipment with visual indicators
- **Dynamic Assignment**: Drag team members between vehicles, teams, or unassigned areas

### Vehicle & Team Organization

- **Resource Columns**: Organized columns for vehicles and teams with visual hierarchy
- **Smart Drop Zones**: Automatic assignment when dropping team members into containers
- **Resizable Components**: Adjustable column and card sizes with resize handles
- **Container Management**: Add, remove, and reorganize vehicles and teams

### Generic Board System

- **Inspiration Boards**: Collect and organize creative ideas with magnets and categories
- **Personal Boards**: Manage personal tasks, notes, and ideas
- **Work Boards**: Organize work projects, meetings, and tasks
- **Magnet Types**: Support for notes, ideas, tasks, and various content types

### Advanced UI/UX

- **Fullscreen Mode**: Maximize workspace with fullscreen toggle
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Dark/Light Theme**: Built-in theme switching with single-click toggle
- **Smooth Animations**: Subtle transitions and hover effects
- **Accessibility**: Keyboard navigation, screen reader support, and WCAG compliance
- **Sidebar Navigation**: Collapsible sidebar with keyboard shortcuts (Ctrl/Cmd + B)
- **Simplified Menu**: Clean navigation with Home, Boards, and Logout options
- **Zoom Controls**: Interactive zoom in/out with percentage display and reset functionality
- **Smooth Drag Performance**: Optimized drag-and-drop with hardware acceleration
- **Consistent Footer**: Professional footer with branding across all pages
- **Layout Optimization**: Conditional layouts for different page types (boards vs. other pages)

### Board Management

- **Tidy Up Function**: Automatically reorganize board layouts with one click
- **Toolbar Integration**: Context-aware toolbars for different board types
- **Resource Creation**: Quick creation of new resources with type selection
- **Visual Feedback**: Clear visual states for dragging, dropping, and interactions
- **Grid3X3 Icon**: Improved visual indicator for tidy up functionality

### Comprehensive Sharing System

- **Multi-Platform Sharing**: Share dashboards across multiple platforms and formats
- **Invite Collaborators**: Generate collaboration links for team members
- **Big Screen Display**: Open dashboards in presentation mode for large displays
- **Email Integration**: Share via email with pre-filled subject and body
- **WhatsApp Sharing**: Direct sharing to WhatsApp with custom messages
- **Print Support**: Print dashboards with optimized layouts
- **Link Copying**: Quick copy of dashboard URLs to clipboard
- **PDF Export**: Download dashboards as PDF documents (coming soon)

### AI Integration

- **Genkit AI**: Google AI-powered suggestions for resource connections
- **Smart Organization**: AI-assisted layout and connection recommendations
- **Content Analysis**: Intelligent analysis of resource relationships
- **Workflow Automation**: AI-driven workflow suggestions

## Technology Stack

### Frontend

- **Next.js 15**: React framework with App Router and server/client components
- **TypeScript**: Type-safe development with comprehensive type definitions
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Radix UI**: Accessible component primitives for consistent UI
- **Lucide React**: Beautiful icon library for modern interface

### State Management

- **Immer**: Immutable state updates with mutable syntax
- **React Hooks**: Custom hooks for fullscreen, mobile detection, and theme management
- **Context API**: Global state management for theme and fullscreen modes

### AI & Backend

- **Genkit**: AI development framework for intelligent features
- **Google AI**: Gemini 2.0 Flash model integration
- **Firebase**: Backend services (configured for future expansion)

### Development Tools

- **Turbopack**: Fast bundler for development with hot reload
- **ESLint**: Code linting and quality enforcement
- **PostCSS**: CSS processing and optimization
- **TypeScript**: Static type checking and development experience

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

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

- `npm run dev` - Start development server with Turbopack on port 9003
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit AI development server
- `npm run genkit:watch` - Start Genkit with file watching

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

## Board Types

### MRT (Mountain Rescue Team) Boards

- **Specialized Layout**: Optimized for emergency response team management
- **Vehicle Assignment**: Drag team members to specific vehicles
- **Team Organization**: Group members into functional teams
- **Skill Management**: Visual skill indicators for quick assessment
- **Role Assignment**: Driver, leader, and default role support

### Generic Boards

- **Inspiration Boards**: Creative idea collection with magnets and categories
- **Personal Boards**: Task management and personal organization
- **Work Boards**: Project management and work-related organization
- **Generic Boards**: Flexible boards with sample content and toolbar functionality
- **Flexible Magnet System**: Support for various content types and containers

## Design System

### Color Palette

- **Primary**: Soft teal (#78D8C3) - Promotes calm, balanced creativity
- **Background**: Light gray (#F0F0F0) - Reduces visual noise
- **Accent**: Mustard yellow (#D6B125) - Interactive elements and warmth
- **Typography**: Inter font family for modern, clean interface

### Component Architecture

- **Atomic Design**: Modular component system with reusable patterns
- **Accessibility First**: WCAG compliant components with keyboard navigation
- **Responsive**: Mobile-first design approach with adaptive layouts
- **Themeable**: CSS custom properties for easy theming and customization

### Interactive Elements

- **Drag Handles**: Visual indicators for draggable elements
- **Resize Handles**: Corner resize indicators for resizable components
- **Drop Zones**: Visual feedback for valid drop targets
- **Hover States**: Consistent hover effects and transitions

## Configuration

### Next.js Configuration

The application uses Next.js 15 with the following key configurations:

- TypeScript support with build error ignoring for development
- Image optimization with remote patterns
- Development indicators for cloud workstations
- App Router with dynamic routing and static params generation

### Tailwind Configuration

Custom Tailwind configuration includes:

- Custom color palette matching design system
- Typography scale using Inter font
- Animation utilities for smooth transitions
- Dark mode support with CSS custom properties
- Responsive breakpoints and mobile-first approach

### Theme System

- **CSS Custom Properties**: Dynamic theme switching
- **Dark/Light Modes**: Automatic theme detection and switching
- **Sidebar Theming**: Consistent theming across all UI components
- **Accessibility**: High contrast support and color considerations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Next.js and the React ecosystem
- Powered by Google AI and Genkit
- Designed for modern team collaboration
- Enhanced with comprehensive sharing and collaboration features
- Copyright 2025 - DK Apps

---

**MagnetFlow** - Visualize Your Ideas, Unleash Your Flow
