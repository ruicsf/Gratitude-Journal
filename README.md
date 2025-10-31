# Gratitude Journal

A simple, clean, and beautiful gratitude and journal app with cloud sync. Never lose your entries again!

## Features

- **Two Entry Types**: Gratitude entries and journal entries
- **Mood Tracking**: Track your mood with each entry using emoji ratings
- **Cloud Sync**: All entries automatically saved to Firebase Firestore
- **Local-First**: Works offline and syncs when you're back online
- **Cross-Platform**: Works on phone, tablet, and computer
- **Progressive Web App**: Install it like a native app on any device
- **Authentication**: Email/password and Google sign-in
- **Filter Views**: View all entries, gratitude only, or journal only
- **Clean UI**: Simple, distraction-free interface

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **PWA**: Vite PWA Plugin

## Prerequisites

- Node.js (v18 or higher)
- A Google/Firebase account (free)

## Setup Instructions

### 1. Clone and Install

```bash
cd gratitude-journal
npm install
```

### 2. Firebase Setup

#### 2.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "gratitude-journal")
4. Disable Google Analytics (optional, not needed for this app)
5. Click "Create project"

#### 2.2 Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Enable **Email/Password** sign-in:
    - Click on "Email/Password"
    - Toggle "Enable" on
    - Click "Save"
4. Enable **Google** sign-in:
    - Click on "Google"
    - Toggle "Enable" on
    - Select a support email
    - Click "Save"

#### 2.3 Create Firestore Database

1. In your Firebase project, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select **"Start in production mode"** (we'll set rules next)
4. Choose a Firestore location (choose closest to you)
5. Click "Enable"

#### 2.4 Set Firestore Security Rules

1. In Firestore Database, go to the "Rules" tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own entries
    match /entries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click "Publish"

#### 2.5 Get Firebase Configuration

1. In Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon (`</>`) to add a web app
5. Register your app with a nickname (e.g., "Gratitude Journal Web")
6. Copy the `firebaseConfig` object

### 3. Configure Environment Variables

1. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

2. Edit `.env` and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

### First Time Setup

1. Create an account with email/password or sign in with Google
2. Start adding entries!

### Adding Entries

1. Select entry type: **Gratitude** (🙏) or **Journal** (📝)
2. For journal entries, optionally add a title
3. Write your entry content
4. Select your current mood (😢 to 😄)
5. Click "Save Entry"

### Viewing Entries

- **All**: View all entries (gratitude + journal)
- **Gratitude**: View only gratitude entries
- **Journal**: View only journal entries

### Installing as an App

#### On Mobile (iOS/Android)

1. Open the app in your mobile browser
2. Tap the browser menu
3. Select "Add to Home Screen" or "Install App"
4. The app will now appear on your home screen like a native app!

#### On Desktop (Chrome/Edge)

1. Open the app in Chrome or Edge
2. Look for the install icon in the address bar (usually a computer with arrow)
3. Click "Install"
4. The app will open in its own window

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory. You can deploy these to:

- **Firebase Hosting** (recommended, free)
- Vercel
- Netlify
- Any static hosting service

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy
```

## Offline Support

The app works offline thanks to:

- **Firebase Offline Persistence**: Automatically enabled
- **Service Worker**: Caches app assets for offline use
- **IndexedDB**: Stores data locally until sync is available

When you're offline:
- You can view all previously loaded entries
- You can add new entries
- Changes will sync automatically when you're back online

## Data Backup

All your entries are automatically backed up to Firebase Firestore. As long as you sign in with the same account, your data will be available on any device.

## Privacy & Security

- All entries are private and only accessible by you
- Firebase security rules ensure users can only access their own data
- Passwords are hashed and never stored in plain text
- Google sign-in uses OAuth 2.0 (no password shared with the app)

## Troubleshooting

### "Firebase not configured" error

Make sure you've:
1. Created a `.env` file with your Firebase credentials
2. Restarted the dev server after creating/modifying `.env`

### Entries not syncing

1. Check your internet connection
2. Make sure Firestore security rules are set correctly
3. Check browser console for errors

### Can't sign in

1. Verify Email/Password and Google auth are enabled in Firebase
2. Check that your Firebase config is correct in `.env`

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
gratitude-journal/
├── src/
│   ├── components/
│   │   ├── Auth/          # Authentication components
│   │   ├── EntryForm/     # New entry form
│   │   ├── EntryList/     # List of entries with filtering
│   │   └── Layout/        # App layout and header
│   ├── lib/
│   │   └── firebase.ts    # Firebase configuration
│   ├── types/
│   │   └── index.ts       # TypeScript types
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles (Tailwind)
├── .env.example           # Environment variables template
├── vite.config.ts         # Vite + PWA configuration
└── tailwind.config.js     # Tailwind CSS configuration
```

## License

MIT

## Support

If you encounter any issues or have questions, please create an issue on the GitHub repository.

---

Made with ❤️ for journaling and gratitude
