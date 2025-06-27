# Project Overview

This is a full-stack web application for "ARVIN PROFESSIONAL EDITING" - a creative services platform that provides various editing and design services. The application is built with React on the frontend and Express.js on the backend, using TypeScript throughout.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for development
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state
- **Routing**: React Router DOM for client-side navigation
- **UI Components**: Comprehensive set of accessible components using Radix UI primitives

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **Development**: Vite middleware integration for hot module replacement

### Build System
- **Frontend Build**: Vite with React plugin
- **Backend Build**: esbuild for Node.js bundle
- **TypeScript**: Shared configuration across client, server, and shared modules
- **Development**: Integrated development server with Vite middleware

## Key Components

### Authentication System
- Role-based access control (admin/user)
- In-memory storage for development with interface for database integration
- Protected routes and dashboard separation

### Service Management
- Multiple creative services (logo design, video editing, web hosting, etc.)
- Order management system with status tracking
- File upload capabilities for service requests

### Communication Features
- Live chat system between users and admin
- Real-time messaging with localStorage persistence
- Admin broadcast capabilities

### Content Management
- Dynamic marquee text configuration
- Promotional popup system
- Testimonial section management

### Admin Dashboard
- User approval workflow
- Order management and pricing
- Content management tools
- Live chat monitoring

## Data Flow

1. **User Registration**: Users register and wait for admin approval
2. **Service Ordering**: Approved users can browse services and place orders
3. **Order Processing**: Admin reviews orders, sets prices, and manages fulfillment
4. **Communication**: Real-time chat between users and admin
5. **Content Updates**: Admin can update promotional content and announcements

## External Dependencies

### UI and Styling
- Radix UI for accessible component primitives
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography
- Class Variance Authority for component variants

### Database and Backend
- Neon Database for serverless PostgreSQL hosting
- Drizzle ORM for type-safe database operations
- Express.js for API routing and middleware

### Development Tools
- Vite for fast development and building
- TypeScript for type safety
- React Hook Form with Zod validation
- Date-fns for date manipulation

## Deployment Strategy

The application is configured for production deployment with:
- Static file serving for the built React application
- Express server serving both API routes and static assets
- Environment-based configuration for database connections
- Optimized builds for both client and server code

The build process creates:
- Optimized React bundle in `dist/public`
- Node.js server bundle in `dist/index.js`
- Database migrations in `migrations/` directory

## Changelog
```
Changelog:
- June 27, 2025. Initial setup
- June 27, 2025. Migrated from Lovable to Replit environment
- June 27, 2025. Added PostgreSQL database with complete schema and API integration
- June 27, 2025. Converted all localStorage operations to database API calls
- June 27, 2025. Configured application for Supabase database migration support
- June 27, 2025. Successfully migrated to Supabase PostgreSQL database - all features working
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```