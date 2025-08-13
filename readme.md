**📚 MERN Online Learning Platform**

An online learning platform built with the MERN stack, AWS S3, and Stripe payments. The app supports Instructor and Student roles, course management, secure file access, and live session integration.
🚀 Features
👩‍🏫 Instructor

```
Create, update, and delete courses.

Upload and manage course materials (PDFs, videos, PPTs, etc.).

    File storage: AWS S3 for efficient and secure file hosting.

    Raw data storage: MongoDB (or any preferred DB).

Schedule and manage live sessions for created courses.

Manage course-specific content and materials.
```

👨‍🎓 Student

```
Browse all available courses.

Purchase courses via Stripe Checkout.

After payment, gain access to:

    Bought course pages.

    Associated course materials (via AWS S3 signed URLs).

    Any live sessions scheduled by the instructor.
```

🔐 Route Protection

```
Instructor Routes:

    Create course

    Manage course materials

    Create and manage live sessions

Student Routes:

    View all courses

    My Courses

    View & download materials for purchased courses only
```

🛠️ Tech Stack

Frontend:

```
React.js

React Router (protected routes)

Tailwind CSS (or any preferred styling)
```

Backend:

```
Node.js & Express.js

MongoDB (Mongoose ORM)

AWS S3 SDK for file storage

Stripe API for payments
```

Authentication:

```
Session Based Auth
```

📦 File Storage

```
AWS S3 stores course materials (PDF, Video, PPT, etc.).

Files are accessed through signed URLs to prevent unauthorized access.
```

💳 Payment Flow (Stripe)

```
Student clicks "Buy Now" on a course.

Backend calls Stripe's checkout.sessions.create to generate a payment link.

On payment success, Stripe webhook (/stripe-webhook) is triggered to:

    Verify payment

    Update the student’s account with access to the purchased course

Student can now view all materials of the purchased course.
```

⚙️ Installation & Setup

# 1\. Clone the repository

git clone https://github.com/DanishAjam1/online-learning-platform.git
cd online-learning-platform

# 2\. Install dependencies

cd server && npm install # for backend
cd online-courses-purchasing && npm install # for frontend

# 3\. Create a \.env file in root with:

Configure the envoironment file using .env.example file located in server route directory..

# 4\. Start development servers

npm run dev # Starts backend + frontend concurrently