# 🚑 SETU – Smart Emergency Triage & Unified Coordination System  
**Version: v1.1 – IAM Foundation Complete**

---

## 📌 Overview

**SETU (Smart Emergency Triage & Unified Coordination System)** is a secure, software-driven emergency coordination platform designed to:

- Rapidly identify patients  
- Transfer critical patient data from ambulance → hospital  
- Prepare hospitals prior to patient arrival  
- Enforce strict role-based Identity & Access Management (IAM)  
- Operate in a simulation-first architecture (no hardware dependency)  

This version establishes a secure, enterprise-grade IAM foundation forming the backbone of the system.

---

## 🏗️ Technology Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Firebase Authentication (Email/Password)
- Cloud Firestore
- Firebase Admin SDK (Server-side privileged operations)
- Strict Firestore Security Rules (Role-based enforcement)

---

## 🔐 IAM Architecture (Phase 2 Complete)

SETU follows a **zero-trust, default-deny security model**.

### 👥 Roles

| Role | Signup | Created By | Dashboard | Capabilities |
|------|--------|------------|------------|--------------|
| **Patient** | ✅ Self | Self | `/dashboard/patient` | Access own profile & events |
| **Administrator** | ✅ One-time | Bootstrap (first only) | `/dashboard/admin` | Create staff & responders |
| **Hospital Staff** | ❌ No | Admin | `/dashboard/hospital_staff` | Access assigned cases |
| **First Responder** | ❌ No | Admin | `/dashboard/first_responder` | Manage emergency cases |

---

## 🔒 Security Model

### 1️⃣ Authentication
- Firebase Email/Password authentication  
- Real login enforcement  
- No client-side bypass  
- ID token verification on secure API routes  

### 2️⃣ Authorization
Role is determined strictly by collection membership.

Power is granted by existence in:

    /hospital_administrators/{uid}
    /hospital_staff/{uid}
    /first_responders/{uid}
    /patients/{uid}

The `/users/{uid}` document is informational only.

### 3️⃣ Firestore Rules
- Default deny model  
- Owner-based validation  
- Admin-only creation for staff/responders  
- Bootstrap lock for first admin  
- Strict server-side enforcement  

---

## 🗂️ Firestore Structure

    users/{uid}
    patients/{uid}
    hospital_administrators/{uid}
    hospital_staff/{uid}
    first_responders/{uid}
    emergency_events/{eventId}
    anonymous_patient_summaries/{id}
    system/bootstrap

---

## 🔐 Admin Bootstrap Logic

- First administrator created using a secure bootstrap key  
- `/system/bootstrap` document permanently locks further admin creation  
- Ensures controlled root privilege  

---

## 🛡️ Route Protection

All dashboards are protected via:

- AuthContext  
- Role validation  
- Automatic redirect if unauthorized  
- Backend verification for privileged operations  

Protected routes:

    /dashboard/admin
    /dashboard/patient
    /dashboard/hospital_staff
    /dashboard/first_responder

Unauthorized users are redirected automatically.

---

## 🚀 Current Capabilities

### ✅ Implemented

- Firebase Auth integration  
- Firestore role enforcement  
- Secure patient self-registration  
- One-time admin bootstrap  
- Real login system  
- Role-based redirect logic  
- Dashboard protection  
- Server-side admin user creation API  
- Environment-based Admin SDK configuration  
- Git-secured project setup  

### ⏳ In Progress / Planned

- Admin UI for creating hospital staff & responders  
- Real emergency event lifecycle  
- Case assignment workflow  
- Real-time coordination  
- Analytics dashboards  

---

## 🖥️ Local Setup

### 1️⃣ Clone Repository

    git clone https://github.com/Kkj1203/SETU-Phase2.git
    cd SETU-Phase2

### 2️⃣ Install Dependencies

    npm install

### 3️⃣ Configure Environment

Create a `.env.local` file in the root:

    FIREBASE_PROJECT_ID=
    FIREBASE_CLIENT_EMAIL=
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

Enable in Firebase Console:
- Authentication → Email/Password  
- Firestore Database  

### 4️⃣ Run Development Server

    npm run dev

Default:

    http://localhost:9002

---

## 📁 Project Structure

    src/
     ├── app/
     │    ├── api/admin/create-user/
     │    ├── dashboard/
     │    │    ├── admin/
     │    │    ├── patient/
     │    │    ├── hospital_staff/
     │    │    └── first_responder/
     │    ├── login/[role]/
     │    └── signup/[role]/
     ├── context/
     │    └── AuthContext.tsx
     ├── firebase/
     │    ├── config.ts
     │    └── admin.ts
     ├── components/
     └── lib/

---

## 🧠 Design Principles

- Security-first architecture  
- Default-deny backend model  
- Clear separation of identity and capability  
- Minimal trust on frontend  
- Enterprise-aligned IAM patterns  
- Scalable role isolation  

---

## 🔮 Roadmap

### Phase 3 – Role Lifecycle Management
- Admin creates hospital staff  
- Admin creates responders  
- Assignment mapping  

### Phase 4 – Emergency Event Flow
- Event creation  
- Role-based assignment  
- Status lifecycle tracking  

### Phase 5 – Real-Time Coordination
- Live updates  
- Alert synchronization  
- Dashboard analytics  

---

## 👨‍💻 Development Status

IAM Foundation: Complete  
System Operational Layer: In Development  

---

## ⚠️ Disclaimer

SETU is an academic simulation system demonstrating:

- Secure IAM architecture  
- Role-based backend enforcement  
- Emergency workflow modeling  

Not intended for production medical deployment.

---

# SETU v1.1  
## Secure IAM Foundation Complete
