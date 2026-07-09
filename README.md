<p>
  <img src="Screenshot 2026-07-09 191328.png" />
</p>

# 🩺 MediCare Connect – Hospital Appointment & Healthcare Management System

MediCare Connect is a modern, full-stack healthcare ecosystem designed to bridge the gap between patients, doctors, and hospital administrators. By digitizing appointment bookings, securing medical records, and incorporating a seamless payment infrastructure, the platform eliminates long waiting times and streamlines clinical workflows.

## 🚀 Live Links & Credentials
*   **Live Deployment:** https://medicare-client-sigma.vercel.app
*   **Client-Side Repository:** https://github.com/Lam78-M/medicare-server-side
*   **Server-Side Repository:** https://github.com/Lam78-M/medicare-client-side

### 🔑 Demo Admin Credentials
*   **Email:** 1. niaz.chowdhury@medicare.com
               2. kamrul.rony@medicare.com
*   **Password:** `123Door26#` *(Or your specific admin password)*

---

## 🛠️ Tech Stack

### Frontend
*   **Framework:** Next.js (React)
*   **Styling:** Tailwind CSS + DaisyUI / HeroUI
*   **Animations:** Framer Motion
*   **Data Visualization:** Recharts
*   **State & Auth:** Better Auth / Firebase Hooks
*   **Payments:** Stripe Element SDK

### Backend & Database
*   **Runtime Environment:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (Mongoose / Native Driver)
*   **Authentication:** JSON Web Tokens (JWT)
*   **Payment Processing:** Stripe API

---

## ✨ Key Features & Challenge Solutions

### 🔍 Challenge 1 & 2: Advanced Search, Filtering & Sorting
*   **Dynamic Search:** Instantly find doctors by matching their **Name** or **Specialization** via a debounced search input.
*   **Multi-Criteria Sorting:** Sort the available specialist list based on **Consultation Fee (Low to High / High to Low)**, **Years of Experience**, or **Highest Rating**.
*   **Challenge 4 Implementation (Pagination):** The "Find Doctors" catalog uses clean, server-side pagination to ensure lightning-fast load times even with thousands of doctor profiles.

### 🛡️ Challenge 3: Strict JWT Token Verification & Auth
*   **Secure API Routes:** All private, patient, doctor, and admin endpoints are fully protected via backend middleware verifying the HTTP-Only cookie / Bearer JWT token.
*   **Role-Based Authorization (RBAC):** Users trying to access a dashboard route belonging to another role (e.g., a Patient trying to view `/dashboard/admin`) are automatically intercepted and redirected.
*   **Session Persistence:** Secure context management ensuring logged-in users remain authenticated flawlessly upon a hard browser refresh.

### 💳 Integrated Stripe Payment Gateway
*   Patients are required to pay the doctor's consultation fee upfront securely via Stripe. The appointment remains in a `Pending Payment` state until a successful webhook/transaction ID is written to the database.

---

## 👥 Role-Based Dashboards

### 👤 Patient Dashboard
*   **Overview:** View upcoming appointments, lifetime prescription history, total spend, and favorite doctors.
*   **My Appointments:** Full CRUD capabilities to view details, reschedule open dates, or cancel appointments.
*   **Payment History:** Scannable breakdown of paid invoices with official Stripe Transaction IDs.
*   **My Reviews:** Add, edit, or delete feedback and ratings left on doctor profiles.

### 🥼 Doctor Dashboard
*   **Profile Management:** Update professional qualifications, experience, hospital attachments, fees, and slot timings.
*   **Manage Schedule:** Full CRUD controls to add or eliminate available days and specific hourly time slots.
*   **Appointment Requests:** Interactive panel to Accept, Reject, or Mark Consultations as Completed.
*   **Prescription Generation:** Marking an appointment as completed instantly routes the doctor to an interactive form to issue digital prescriptions (`Diagnosis`, `Medications`, `Notes`).

### 👑 Admin Dashboard
*   **User & Doctor Management:** View, suspend, or delete users. Review new doctor profiles to approve/Verify or Reject their medical license status.
*   **Global Overviews:** Monitor all global appointments, systemic payment flows, and track operational logs.
*   **Advanced Analytics:** A visual metrics panel designed using **Recharts** highlighting Doctor performance metrics, aggregate patient sign-ups, and monthly revenue data.

---

## 🎨 UI/UX Specifications
*   **Modern Theme:** Built using a custom, clean healthcare color palette (Deep Teals, Medical Blues, and Crisp Whites).
*   **Framer Motion Integration:** Smooth, fluid page transitions and layout animations applied across the Homepage Banner and Interactive Statistics sections.
*   **Robust Error Handling:** Features a custom-designed **404 page** with contextual illustration and an immediate "Back to Home" routing capability.
*   **Responsive Layout:** Fully optimized down to 320px mobile screens up to ultra-wide desktop monitors utilizing responsive sidebars and CSS grids.

---

## ⚙️ Environment Variables Setup

Create an `.env.local` file in your **client** directory and an `.env` file in your **server** directory.

