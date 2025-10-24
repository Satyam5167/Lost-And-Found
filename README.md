# TrackIt Back — Lost & Found

A lightweight full-stack Lost & Found web app built with  
**React (Vite)** on the frontend and **Express + PostgreSQL** on the backend.

---

## 🧰 Tech Stack

**Frontend:** React, Vite, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** PostgreSQL  
**Cloud Storage:** Cloudinary  
**Authentication:** JWT (JSON Web Token)  
**Email Service:** Nodemailer / SMTP  
**Deployment:** Compatible with Render, Vercel, Railway, or Docker setups

---

## 📂 Repository Overview

### Server (Backend)
**Path:** `/server`

**Key Files**
- `.env`
- `db.js`
- `server.js`
- `package.json`

**Controllers**
- `authController.js` → `sendOtp`, `verifyOtp`, `register`, `login`
- `itemController.js` → `getAllItems`, `getItemById`, `addItem`, `updateItem`, `deleteItem`, `getUserItems`, `deleteUserItem`
- `mailController.js` → `sendClaimMail`
- `userController.js` → `getUserDetails`

**Middleware**
- `authMiddleware.js`

**Queries**
- `authQueries.js` → `findUserByEmail`, `createUser`
- `itemQueries.js` → CRUD operations for items and user items
- `mailQueries.js` → `getClaimDetails`
- `userQueries.js` → `getUserById`

**Routes**
- `authRoutes.js`
- `userRoutes.js`
- `itemRoutes.js`
- `userMailRoutes.js`

**Utils**
- `sendOtp.js`

---

### Client (Frontend)
**Path:** `/client`

**Key Files**
- `package.json`
- `vite.config.js`
- `tailwind.config.js`
- `index.html`
- `eslint.config.js`

**App Entry**
- `src/main.jsx`
- `src/App.jsx`
- `src/apiConfig.js`

**Styles**
- `src/index.css`
- `src/App.css`

**Components**
- Core: `Navbar`, `Footer`, `Dashboard`, `Login`, `Register`
- Functional: `Post`, `UrPost`, `EditForm`, `MyCard`, `Card`
- Misc: `About`, `Greeting`, `Head`, `NavSch`, `logout.js`

**Assets**
- `client/public/` — static files  
- `client/src/assets/` — images, icons

---

## ⚙️ Quick Start

### 1️⃣ Backend Setup
```bash
cd server
npm install
node server.js
```

## ⚙️ Quick Start

### 2️⃣ Frontend Setup
```bash
cd client
npm install
npm run dev
