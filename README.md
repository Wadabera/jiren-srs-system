# Student Registration System (SRS) Migration

A modern full-stack web application using React, NestJS, and MongoDB Atlas.

## Technologies Used

- **Frontend:** React (Vite), React Router, Lucide Icons, Modern Vanilla CSS (CSS variables, glassmorphism, responsive design)
- **Backend:** NestJS, TypeScript, Mongoose, Passport (JWT Auth), bcryptjs
- **Database:** MongoDB Atlas (Cloud)

## Project Structure

- `/srs-backend` - The NestJS backend application
- `/srs-frontend` - The React frontend application

## How to Run the Application

```bash
# Terminal 1 - Backend
cd srs-backend
npm install
npm run start:dev

# Terminal 2 - Frontend
cd srs-frontend
npm install
npm run dev
```

Backend: `http://localhost:5000`
Frontend: `http://localhost:5173`

## Demo Data

The database ships with a full demo dataset. To rebuild it from scratch:

```bash
cd srs-backend
node scripts/seed.js
```

This **wipes** the `srs` database and repopulates it with:

| Collection    | Count | Notes                                    |
| ------------- | ----- | ---------------------------------------- |
| users         | 127   | Login records for every role             |
| students      | 113   | Grades 9-12, classes A/B/C               |
| teachers      | 12    | Each linked to a subject and grade       |
| directors     | 2     |                                           |
| subjects      | 47    | Per grade, with stream for 11/12         |
| marks         | 334   | 4-column assessment per student          |
| markschemas   | 12    | One per teacher                          |
| attendances   | 4676  | 20 school days x roster                  |
| timetables    | 180   | 5 days x 6 periods per class             |
| announcements | 8     | Targeted to students, teachers, or all   |
| messages      | 20    | Teacher/student/director conversations   |
| filedocs      | 3     | Metadata for the PDFs in `uploads/`      |

### Demo Accounts

All accounts use the password **`Demo@1234`**.

| Role     | Username(s)                    |
| -------- | ------------------------------ |
| Director | `director`                     |
| Teacher  | `teacher1` ... `teacher12`     |
| Student  | `selamtadesse1000` and 112 more |

Student usernames are generated as `<name><studentId>`, e.g. `nahomgebre1001`.
The seed prints the first few on each run.

The login page has a **Demo Accounts** panel listing the three main roles.
Clicking one signs in immediately, so a demo goes from the landing page to a
populated dashboard in a single click. Collapse it with the "Hide demo accounts"
link when you do not want it visible.

### Suggested demo walkthrough

1. Open http://localhost:5173 and click **Access Portal**.
2. Click **Director** in the demo panel. Land on the Admin Console: 12 teachers,
   113 students, 125 active users, plus performance and demographic charts.
3. **Users List** shows all 125 users in two tables with search. Try searching a
   name, then use Edit / Delete.
4. **Add User** creates an account (the only way to make one now), then
   **Add Subject** / **Manage Subjects** for the subject catalogue.
5. **Timetables** builds the weekly schedule per grade and section.
6. Log out, click **Teacher** in the demo panel. See the class roster of 27,
   then **Marks** to define assessment columns and enter scores against the
   4-column schema (Assignment 1/2, Midterm, Final).
7. **Attendance** marks a class present/absent/late for a date.
8. Log out, click **Student**. The dashboard shows real figures: 82% attendance
   (80 present / 5 absent / 13 late). **Academic Result** lists 7 subjects with
   PASS badges, **Timetable** the weekly grid, **Resources** downloadable PDFs,
   and **Announcements** role-targeted posts.
9. **Messages** on any account shows a live conversation thread.

### Accounts are not self-service

Public registration is disabled. `POST /api/auth/register` has been removed and
the `/register` page redirects to `/login`. Accounts are created only by a
director through **Admin → Add User**.

## Environment Variables

Create `.env` in `srs-backend/`. See `.env.example` for the full list.

```env
# Note the /srs database name in the path - without it MongoDB defaults to "test"
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/srs?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRY=1d
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
JWT_REFRESH_EXPIRY=7d
PORT=5000
```

`CLOUDINARY_*` and `EMAIL_*` are optional. Without Cloudinary credentials,
avatar/banner uploads will fail but the rest of the app works.

## Features Completed

### Authentication
- JWT-based login with access tokens
- Refresh token support for session management
- Director-only account creation (no public sign-up)
- Role-based access control
- Password hashing with bcryptjs

### Security
- Helmet for XSS protection
- Input validation with class-validator
- Environment variable validation
- MongoDB connection retry mechanism

### UI/UX
- Responsive design (320px, 480px, 768px, 1024px breakpoints)
- Glassmorphism effects
- Modern brutal-style cards
- Form validation and error handling
- Registration and forgot password pages