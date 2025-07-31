# Soundous Bakes Website

A beautiful website for Soundous Bake Shop, featuring custom cake orders, workshops, online courses, and a gallery.

## Features

- Custom cake ordering system
- Workshop booking and management
- Online course sales
- Image gallery
- Admin dashboard
- User authentication
- Contact form

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Firebase (Authentication, Firestore, Storage)
- React Hook Form with Zod validation
- Framer Motion for animations
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```
4. Start the development server:
   ```
   npm run dev
   ```

### Firebase Setup

See the [Firebase Setup Guide](./firebase-setup-guide.md) for detailed instructions on setting up your Firebase project.

## Project Structure

- `/app` - Next.js app router pages
- `/components` - React components
- `/lib` - Utility functions and Firebase services
- `/hooks` - Custom React hooks
- `/public` - Static assets

## Deployment

1. Build the project:
   ```
   npm run build
   ```
2. Deploy to your preferred hosting provider (Vercel, Netlify, Firebase Hosting, etc.)

## License

This project is licensed under the MIT License.