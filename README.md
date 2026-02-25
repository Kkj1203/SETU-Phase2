# SETU – Smart Emergency Triage & Unified Coordination System  
**Version: v1.1 – IAM Foundation Complete**

---

## 🚑 Overview

**SETU (Smart Emergency Triage & Unified Coordination System)** is a software-driven emergency coordination platform designed to:

- Identify patients quickly
- Transfer patient data from ambulance → hospital
- Prepare hospital systems before patient arrival
- Enforce strict role-based access control (IAM)
- Operate in a simulation-first architecture (no hardware dependency)

This version implements a secure, enterprise-grade Identity and Access Management (IAM) foundation.

---

## 🏗️ Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Firebase Authentication (Email/Password)
- Cloud Firestore
- Strict Firestore Security Rules (Role-based)

---

## 🔐 IAM Architecture (Phase 2 Complete)

### Roles in the System

| Role              | Signup | Created By | Dashboard Access | Permissions |
|-------------------|--------|------------|------------------|-------------|
| Patient           | ✅ Yes | Self       | `/dashboard/patient` | View own data |
| Administrator     | ✅ One-time bootstrap | Self (first only) | `/dashboard/admin` | Create staff & responders |
| Hospital Staff    | ❌ No  | Admin      | `/dashboard/hospital_staff` | Access assigned patients |
| First Responder   | ❌ No  | Admin      | `/dashboard/first_responder` | Emergency case access |

---

## 🔒 Security Model

### 1. Authentication
- Firebase Email/Password authentication
- Real login enforcement
- No client-side bypass possible

### 2. Authorization
- Role determined by Firestore collection membership
- `/users/{uid}` is informational only
- Power granted strictly by role collections:
  - `/hospital_administrators`
  - `/hospital_staff`
  - `/first_responders`
  - `/patients`

### 3. Firestore Security Rules
- Default deny model
- Strict owner validation
- Admin-only creation for staff/responders
- Bootstrap lock for first admin

---

## 🗂️ Firestore Structure

```
users/{uid}
patients/{uid}
hospital_administrators/{uid}
hospital_staff/{uid}
first_responders/{uid}
emergency_events/{eventId}
anonymous_patient_summaries/{id}
system/bootstrap
```

---

## 🔐 Admin Bootstrap System

- First admin is created using a secure bootstrap key
- `/system/bootstrap` locks admin creation permanently
- Only one root administrator allowed

---

## 🖥️ Route Protection

All dashboards are protected via:

- AuthContext
- Role validation
- Automatic redirect if unauthorized
- Backend rule enforcement

Protected routes:

```
/dashboard/admin
/dashboard/patient
/dashboard/hospital_staff
/dashboard/first_responder
```

Unauthorized access results in redirect.

---

## 🚀 Current System Capabilities

### ✅ Completed
- Firebase integration
- IAM bootstrap logic
- Patient self-signup
- Admin one-time bootstrap
- Real login system
- Role-based redirect
- Dashboard protection
- Firestore backend enforcement
- Secure route structure

### ❌ Not Yet Implemented
- Admin user creation UI (hospital staff / responders)
- Real emergency event workflow
- Assignment system
- Case lifecycle management
- Real-time coordination logic

---

## 📦 Local Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Server runs on:

```
http://localhost:9002
```

---

## 🔧 Environment Requirements

You must configure:

- Firebase project
- Firestore enabled
- Authentication enabled (Email/Password)
- Firestore security rules deployed

Add your Firebase config inside:

```
src/firebase/config.ts
```

---

## 📁 Project Structure

```
src/
 ├── app/
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
 ├── components/
 └── lib/
```

---

## 🔮 Roadmap (Next Phases)

### Phase 3 – Role Lifecycle Management
- Admin creates hospital staff
- Admin creates first responders
- User assignment system

### Phase 4 – Emergency Event Flow
- Patient creates emergency event
- Responder assigned
- Hospital assigned
- Case lifecycle updates

### Phase 5 – Real-Time Coordination
- Live status tracking
- Assignment denormalization
- Dashboard analytics

---

## 🧠 Design Principles

- Security-first architecture
- Default deny backend model
- Clean role isolation
- Scalable structure
- Production-aligned IAM patterns

---

## 👨‍💻 Development Status

**IAM Foundation: Complete**  
**System Operational Layer: In Progress**

---

## 📌 Repository

Forked and maintained under:

```
kkj1203/SETU
```

---

## 🛡️ Disclaimer

This is a simulation-focused academic system designed to demonstrate:

- Secure IAM implementation
- Role-based architecture
- Emergency coordination modeling

Not intended for real-world medical deployment.

---

**SETU v1.1 – IAM Secure Foundation Complete**
