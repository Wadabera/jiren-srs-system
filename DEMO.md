# Demo Guide

Everything you need to present the Student Registration System. Total setup
time should already be done; this is what to click.

## Before you present

Both servers must be running in separate terminals:

```bash
# Terminal 1
cd srs-backend
npm run start:dev        # http://localhost:5000

# Terminal 2
cd srs-frontend
npm run dev              # http://localhost:5173
```

Wait for `🚀 SRS Backend running on http://localhost:5000` and
`✅ MongoDB connected` in the backend terminal. If the database is empty, repopulate it:

```bash
cd srs-backend
node scripts/seed.js
```

## Signing in

The login page has a **Demo Accounts** panel. Click a role and you are signed
in immediately. Password for every account is `Demo@1234`.

| Role     | Username            | Lands on  |
| -------- | ------------------- | --------- |
| Director | `director`          | `/admin`  |
| Teacher  | `teacher1`          | `/teacher` |
| Student  | `selamtadesse1000`  | `/student` |

There are 12 teachers (`teacher1`–`teacher12`) and 113 students. Student
usernames follow the pattern `<name><studentId>`, e.g. `nahomgebre1001`.

Use **Log out** in the top right to switch roles. The demo panel collapses via
the "Hide demo accounts" link if you want a clean login screen on screen.

## The data you are showing

| Collection    | Count | What it powers                       |
| ------------- | ----- | ------------------------------------ |
| users         | 127   | Login records across all roles        |
| students      | 113   | Grades 9-12, sections A/B/C           |
| teachers      | 12    | Each bound to a subject and grade     |
| directors     | 2     | Administrator accounts                |
| subjects      | 47    | Per grade, stream-aware for 11/12     |
| marks         | 334   | 4-column assessment per student       |
| markschemas   | 12    | Assessment columns per teacher        |
| attendances   | 4676  | 20 school days across every roster    |
| timetables    | 180   | 5 days x 6 periods per class          |
| announcements | 8     | Targeted to students, teachers, or all |
| messages      | 20    | Teacher/student/director threads      |
| filedocs      | 3     | Metadata for the PDFs in `uploads/`   |

## Walkthrough

**Director** — `director`

- Console: 12 teachers, 113 students, 125 active users, pass/fail bar chart,
  gender donut.
- Users List: all 125 users in two tables. Search by name, Edit, Delete.
- Add User: the only way to create an account now, since public registration is
  closed. Create a student, then sign in as them to show the new record.
- Add Subject / Manage Subjects: subject catalogue, auto-numbered per grade.
- Timetables: build the weekly grid per grade and section.
- Announcements: post to students, teachers, or everyone.

**Teacher** — `teacher1`

- Console: 27 students, 27 in the classroom roster, 98% daily attendance.
- Students: the full roster with ID, name, section, stream, phone.
- Marks: define columns, then enter scores against the seeded schema
  (Assignment 1 /15, Assignment 2 /15, Midterm /30, Final /40 = 100).
- Attendance: mark a section present / absent / late for a date.
- Resources: upload a file, then check the list.

**Student** — `selamtadesse1000`

- Dashboard: 82% attendance, broken down 80 present / 5 absent / 13 late,
  with a pie chart and the five most recent records.
- Academic Result: 7 subjects, each with per-column scores, total, PASS badge.
- Timetable: the full weekly schedule for section 9-A.
- Resources: downloadable PDFs for the student's grade.
- Announcements: only the posts targeted at students.
- Messages: a live conversation thread with a teacher and the administration.

## Things to know

**Registration is closed by design.** `POST /api/auth/register` returns 404 and
`/register` redirects to `/login`. Directors create every account from Admin →
Add User. If an advisor asks how a student gets access, that is the answer.

**GPA and Rank on the student dashboard are hardcoded** placeholders (3.8 and
#4), as are the performance and demographic charts on the director console. The
real figures next to them — attendance, marks, user counts — are live from
MongoDB. Worth flagging as known work rather than letting it come up cold.

**Avatar and banner uploads need Cloudinary.** The credentials are blank in
`.env`, so image upload will fail. Everything else works. Local file upload for
teacher resources does not need Cloudinary.

**Refresh tokens** are issued and stored hashed, but the frontend does not yet
use them to silently renew an expired access token. A 1-day token means this is
rarely visible in a demo.

**Passwords are placeholder secrets.** `JWT_SECRET` and `JWT_REFRESH_SECRET` are
still the README defaults, and the Atlas database password has been shared in
chat. Rotate all three before this goes anywhere real.
