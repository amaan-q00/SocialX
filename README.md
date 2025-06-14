# 🚀 SocialX

**Live Demo**: [https://social-x-five.vercel.app](https://social-x-five.vercel.app)

SocialX is a full-stack social media platform where users can upload and share disappearing media (images, videos, audio). It’s privacy-first and chat-focused, built with modern web tools.

---

## 🛠 Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS  
- **Backend**: Firebase (Auth, Firestore, Storage)  
- **Realtime**: Firestore Subscriptions  
- **State Management**: React Context API  
- **Deployment**: Vercel  

---

## ✨ Features (Work In Progress)

- ✅ User Authentication (Sign up, Log in, Log out)  
- ✅ Upload & Display Media (Images, Videos, Audio)  
- ✅ Disappearing Media Logic  
- ✅ Responsive Mobile/Desktop UI  
- ✅ Friend Management 
- ⏳ One-on-One Chat with Disappearing Messages *(Coming Soon)*  
- ⏳ Superuser Mode: View Expired Content *(Planned)*  
- ⏳ Activity Logging *(Planned)*  

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/amaan-q00/SocialX.git
cd SocialX
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-cloudinary-upload-preset
```

### 4. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Folder Structure

```txt
├── app/                # Next.js App Directory  
├── components/         # Reusable UI Components  
├── context/            # Global State Management  
├── firebase/           # Firebase Config & Utils  
├── lib/                # Helper Functions  
├── public/             # Static Assets  
├── styles/             # Global Styles (Tailwind)  
├── .env.local          # Environment Variables  
├── next.config.js      # Next.js Configuration  
└── tailwind.config.js  # Tailwind Configuration  
```

---

## 🧭 Roadmap

- [x] Media Upload and Display  
- [x] Disappearing Media Logic  
- [x] Friend Management System  
- [ ] Private Chat with Expiry  
- [ ] Superuser & Moderation Tools  
- [ ] UI/UX Polish & Final Deployment  

---

## 📄 License

MIT License

---

**Note**: This project is actively in development. Expect updates, tweaks, and new features.
