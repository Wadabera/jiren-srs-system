/**
 * SRS Demo Data Seeder
 * --------------------
 * Wipes the `srs` database and repopulates it with a full, realistic demo
 * dataset so every screen in the UI has something meaningful to display.
 *
 * Usage:  node scripts/seed.js
 *
 * Requires MONGODB_URI in srs-backend/.env
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const URI = process.env.MONGODB_URI;
const DB_NAME = 'srs';

if (!URI) {
  console.error('MONGODB_URI is not set. Check srs-backend/.env');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Deterministic pseudo-random so re-running the seed gives the same demo data.
let seedState = 20260929;
function rand() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

const DEMO_PASSWORD = 'Demo@1234';

const FIRST_NAMES_M = ['Abebe', 'Dawit', 'Yonas', 'Bekele', 'Tewodros', 'Selam', 'Eyob', 'Michael', 'Daniel', 'Samuel', 'Yonas', 'Kalkidan', 'Nahom', 'Biruk', 'Temesgen'];
const FIRST_NAMES_F = ['Sara', 'Marta', 'Hana', 'Bethel', 'Rahel', 'Liya', 'Selam', 'Frehiwot', 'Hiwot', 'Zemzem', 'Saron', 'Tirunesh', 'Mekdes', 'Kalkidan', 'Meron'];
const LAST_NAMES = ['Tesfaye', 'Bekele', 'Khalil', 'Mengiste', 'Assefa', 'Girma', 'Wondimu', 'Alemu', 'Berhanu', 'Demeke', 'Hailu', 'Yimer', 'Gebre', 'Tadesse', 'Worku', 'Negash', 'Mekonnen', 'Sisay', 'Getachew', 'Lemma'];

const SUBJECT_CATALOG = [
  { name: 'English',            stream: '' },
  { name: 'Mathematics',        stream: '' },
  { name: 'Physics',            stream: 'Natural' },
  { name: 'Chemistry',          stream: 'Natural' },
  { name: 'Biology',            stream: 'Natural' },
  { name: 'History',            stream: 'Social' },
  { name: 'Geography',          stream: 'Social' },
  { name: 'Civics & Ethical Education', stream: 'Social' },
  { name: 'Information Technology', stream: '' },
  { name: 'Physical Education', stream: '' },
  { name: 'Economics',          stream: 'Social' },
  { name: 'Technical Drawing',  stream: 'Natural' },
];

const GRADES = [9, 10, 11, 12];
const CLASSES = ['A', 'B', 'C'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function makeName() {
  const isMale = rand() > 0.5;
  const first = isMale ? pick(FIRST_NAMES_M) : pick(FIRST_NAMES_F);
  return `${first} ${pick(LAST_NAMES)}`;
}

// ---------------------------------------------------------------------------
// Seeder
// ---------------------------------------------------------------------------

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(URI, { dbName: DB_NAME });
  console.log('Connected.');

  const db = mongoose.connection.db;
  console.log('Clearing existing demo data...');
  const collections = ['users', 'students', 'teachers', 'directors', 'subjects', 'timetables', 'marks', 'markschemas', 'attendances', 'announcements', 'messages', 'filedocs'];
  for (const c of collections) {
    await db.collection(c).deleteMany({});
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // -- Users + roles -------------------------------------------------------
  console.log('Creating users...');

  const directors = [
    { fullname: 'Dr. Alemayehu Girma', username: 'director', email: 'director@srs.edu.et', phone: '+251911000001' },
    { fullname: 'Wubit Solomon', username: 'viceprincipal', email: 'vice@srs.edu.et', phone: '+251911000002' },
  ];

  const teacherSpecs = [
    { subject: 'English', grades: [9, 10, 11, 12] },
    { subject: 'Mathematics', grades: [9, 10, 11, 12] },
    { subject: 'Physics', grades: [11, 12] },
    { subject: 'Chemistry', grades: [11, 12] },
    { subject: 'Biology', grades: [11, 12] },
    { subject: 'History', grades: [9, 10, 11, 12] },
    { subject: 'Geography', grades: [9, 10, 11, 12] },
    { subject: 'Civics & Ethical Education', grades: [9, 10] },
    { subject: 'Information Technology', grades: [9, 10, 11, 12] },
    { subject: 'Physical Education', grades: [9, 10, 11, 12] },
    { subject: 'Economics', grades: [11, 12] },
    { subject: 'Technical Drawing', grades: [11, 12] },
  ];

  const teachers = teacherSpecs.map((spec, i) => ({
    teacherId: String(100 + i),
    fullname: makeName(),
    username: `teacher${i + 1}`,
    email: `teacher${i + 1}@srs.edu.et`,
    phone: `+2519${randInt(10000000, 99999999)}`,
    subject: spec.subject,
    grades: spec.grades,
  }));

  const students = [];
  for (const grade of GRADES) {
    for (const cls of CLASSES) {
      const count = randInt(7, 11);
      for (let i = 0; i < count; i++) {
        students.push({
          studentId: '',
          fullname: makeName(),
          username: '',
          email: '',
          phone: `+2519${randInt(10000000, 99999999)}`,
          stream: grade >= 11 ? pick(['Natural', 'Social']) : 'Natural',
          grade: String(grade),
          class: cls,
        });
      }
    }
  }

  // Assign sequential IDs / usernames, mirroring users.service.ts logic.
  students.forEach((s, i) => {
    s.studentId = String(1000 + i);
    const base = s.fullname.toLowerCase().replace(/[^a-z]/g, '');
    s.username = `${base}${s.studentId}`;
    s.email = `${s.username}@srs.edu.et`;
  });

  // users collection
  const userDocs = [
    ...directors.map(d => ({ ...d, password: passwordHash, role: 'director' })),
    ...teachers.map(t => ({
      fullname: t.fullname, username: t.username, password: passwordHash,
      email: t.email, role: 'teacher',
    })),
    ...students.map(s => ({
      fullname: s.fullname, username: s.username, password: passwordHash,
      email: s.email, role: 'student',
    })),
  ];
  await db.collection('users').insertMany(userDocs);
  console.log(`  users: ${userDocs.length}`);

  await db.collection('directors').insertMany(
    directors.map(d => ({ fullname: d.fullname, username: d.username, email: d.email }))
  );

  // -- Subjects ------------------------------------------------------------
  // subjectCode scheme copied from subjects.service.ts: first code for a grade
  // is `${grade}000` for grade 9 and `${grade}00` otherwise, then incrementing.
  const subjects = [];
  for (const grade of GRADES) {
    for (const [idx, s] of SUBJECT_CATALOG.entries()) {
      if (grade < 9) continue;
      if (grade === 9 && s.stream === 'Social' && idx > 9) continue;
      const base = grade === 9 ? 9000 : grade * 100;
      const code = String(base + idx);
      subjects.push({
        subjectCode: code,
        subjectName: s.name,
        grade,
        stream: grade >= 11 ? s.stream : '',
      });
    }
  }
  await db.collection('subjects').insertMany(subjects);
  console.log(`  subjects: ${subjects.length}`);

  // -- Teachers (linked to a subject) -------------------------------------
  const teacherDocs = teachers.map(t => {
    const grade = t.grades[0];
    const subject = subjects.find(s => s.subjectName === t.subject && s.grade === grade);
    return {
      teacherId: t.teacherId,
      fullname: t.fullname,
      username: t.username,
      email: t.email,
      phone: t.phone,
      stream: (subject && subject.stream) || '',
      subjectCode: subject ? subject.subjectCode : '',
      grade: String(grade),
      classes: CLASSES.slice(),
      background: t.subject,
    };
  });
  await db.collection('teachers').insertMany(teacherDocs);
  console.log(`  teachers: ${teacherDocs.length}`);

  // -- Students ------------------------------------------------------------
  await db.collection('students').insertMany(students);
  console.log(`  students: ${students.length}`);

  // -- Mark schemas + marks ------------------------------------------------
  const MARK_COLUMNS = [
    { label: 'Assignment 1', max: 15 },
    { label: 'Assignment 2', max: 15 },
    { label: 'Midterm', max: 30 },
    { label: 'Final Exam', max: 40 },
  ];

  const markSchemas = teacherDocs.map(t => ({ teacherId: t.teacherId, columns: MARK_COLUMNS }));
  await db.collection('markschemas').insertMany(markSchemas);

  const marks = [];
  for (const t of teacherDocs) {
    const roster = students.filter(s => s.grade === t.grade);
    for (const s of roster) {
      const scores = MARK_COLUMNS.map(col => randInt(Math.round(col.max * 0.45), col.max));
      marks.push({
        studentId: s.studentId,
        teacherId: t.teacherId,
        subjectCode: t.subjectCode,
        scores,
        total: scores.reduce((a, b) => a + b, 0),
      });
    }
  }
  if (marks.length) await db.collection('marks').insertMany(marks);
  console.log(`  markschemas: ${markSchemas.length}, marks: ${marks.length}`);

  // -- Attendance ----------------------------------------------------------
  const attendances = [];
  const start = new Date('2026-09-01T00:00:00Z');
  for (const t of teacherDocs) {
    const roster = students.filter(s => s.grade === t.grade);
    for (let d = 0; d < 20; d++) {
      const day = new Date(start);
      day.setUTCDate(day.getUTCDate() + d);
      if (day.getUTCDay() === 0 || day.getUTCDay() === 6) continue;
      const dateStr = day.toISOString().slice(0, 10);
      for (const s of roster) {
        const roll = rand();
        const status = roll > 0.92 ? 'Absent' : roll > 0.84 ? 'Late' : 'Present';
        attendances.push({
          studentId: s.studentId,
          teacherId: t.teacherId,
          subjectCode: t.subjectCode,
          date: dateStr,
          status,
        });
      }
    }
  }
  if (attendances.length) await db.collection('attendances').insertMany(attendances);
  console.log(`  attendances: ${attendances.length}`);

  // -- Timetable -----------------------------------------------------------
  const timetables = [];
  const PERIODS = [
    ['08:00', '08:45'], ['08:45', '09:30'], ['09:30', '10:15'],
    ['10:30', '11:15'], ['11:15', '12:00'], ['12:15', '13:00'],
  ];
  for (const grade of GRADES) {
    for (const cls of CLASSES) {
      const gradeTeachers = teacherDocs.filter(t => t.grade === String(grade));
      for (let d = 0; d < DAYS.length; d++) {
        for (let p = 0; p < PERIODS.length; p++) {
          const t = gradeTeachers[(d * PERIODS.length + p) % gradeTeachers.length];
          if (!t) continue;
          timetables.push({
            grade,
            class: cls,
            dayOfWeek: DAYS[d],
            startTime: PERIODS[p][0],
            endTime: PERIODS[p][1],
            subjectCode: t.subjectCode,
            teacherId: t.teacherId,
          });
        }
      }
    }
  }
  if (timetables.length) await db.collection('timetables').insertMany(timetables);
  console.log(`  timetables: ${timetables.length}`);

  // -- Announcements -------------------------------------------------------
  const announcements = [
    { title: 'New Academic Year Begins', body: 'The 2018 E.C. academic year officially begins next Monday. All students are expected to report to their homeroom by 7:45 AM. Registration for all grade levels has been completed, and class lists are now available on the portal.', announcementFor: 'all' },
    { title: 'Mid-term Examination Schedule Released', body: 'The mid-term examination timetable has been posted. Examinations for grades 9 and 10 will run during the last week of the month, while grades 11 and 12 will begin the following week. Please check the timetable section for details.', announcementFor: 'student' },
    { title: 'Staff Meeting: Curriculum Update', body: 'All teaching staff are required to attend a curriculum review meeting this Friday at 3:30 PM in the staff hall. The new subject weighting scheme will be discussed and course outlines need to be submitted before the meeting.', announcementFor: 'teacher' },
    { title: 'Parent-Teacher Conference', body: 'Parent-teacher conferences will be held on the second Saturday of next month. Teachers should submit progress reports to the front office one week before the date.', announcementFor: 'all' },
    { title: 'Library Week: Book Donation Drive', body: 'The annual book donation drive begins this week. Students and staff are encouraged to contribute textbooks and reference materials to the school library.', announcementFor: 'all' },
    { title: 'Sports Festival - Grade Level Competition', body: 'Inter-class athletics competitions will be held on the school field. All students must register with their homeroom teacher before the event. Medals will be awarded for individual and team events.', announcementFor: 'student' },
    { title: 'IT System Maintenance This Weekend', body: 'The school network and portal will be unavailable this Saturday from 8:00 AM to 2:00 PM for scheduled maintenance. Grades entered before then will be preserved.', announcementFor: 'all' },
    { title: 'Reminder: Grade 12 University Preparation', body: 'Grade 12 students are reminded that the university entrance exam registration deadline is approaching. Guidance counselling sessions are available every weekday afternoon.', announcementFor: 'student' },
  ];
  await db.collection('announcements').insertMany(announcements);
  console.log(`  announcements: ${announcements.length}`);

  // -- Messages ------------------------------------------------------------
  const messages = [];
  const msgPairs = [
    { from: teachers[0], fromRole: 'teacher', to: students[0], toRole: 'student', text: 'Hello, please make sure you submit the assignment on English literature before the deadline.' },
    { from: students[0], fromRole: 'student', to: teachers[0], toRole: 'teacher', text: 'Thank you teacher. I have submitted it, could you please check and let me know?' },
    { from: teachers[0], fromRole: 'teacher', to: students[0], toRole: 'student', text: 'I have reviewed it. Good effort, but please pay more attention to paragraph structure.' },
    { from: teachers[2], fromRole: 'teacher', to: students[3], toRole: 'student', text: 'Your physics lab report is missing. Please submit it tomorrow.' },
    { from: students[3], fromRole: 'student', to: teachers[2], toRole: 'teacher', text: 'I was absent due to illness, may I have an extension?' },
    { from: directors[0], fromRole: 'director', to: teachers[1], toRole: 'teacher', text: 'Please prepare the grade 10 mathematics progress report by Friday.' },
    { from: teachers[5], fromRole: 'teacher', to: directors[0], toRole: 'director', text: 'I have completed the attendance register for the month.' },
    { from: students[7], fromRole: 'student', to: teachers[8], toRole: 'teacher', text: 'Could you explain the difference between the two topics from class?' },
    { from: teachers[8], fromRole: 'teacher', to: students[7], toRole: 'student', text: 'Of course. Please come to my office during the free period.' },
    { from: directors[1], fromRole: 'director', to: students[10], toRole: 'student', text: 'Your attendance record needs improvement. Please meet your homeroom teacher.' },
  ];
  for (const m of msgPairs) {
    messages.push({
      senderId: m.from.username, senderName: m.from.fullname, senderRole: m.fromRole,
      receiverId: m.to.username, content: m.text, isRead: false,
    });
    messages.push({
      senderId: m.to.username, senderName: m.to.fullname, senderRole: m.toRole,
      receiverId: m.from.username, content: m.text, isRead: true,
    });
  }
  await db.collection('messages').insertMany(messages);
  console.log(`  messages: ${messages.length}`);

  // -- Files ---------------------------------------------------------------
  // The real PDFs/PNGs already sitting in srs-backend/uploads get metadata rows
  // so the Resources screen has something to list and download.
  const fs = require('fs');
  const path = require('path');
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  let fileDocs = [];
  if (fs.existsSync(uploadsDir)) {
    const names = fs.readdirSync(uploadsDir).filter(n => !n.startsWith('.'));
    fileDocs = names.map((filename, i) => {
      const ext = path.extname(filename).toLowerCase();
      const teacher = teacherDocs[i % teacherDocs.length];
      return {
        title: `${teacher.background} Notes - Section ${i + 1}`,
        filename,
        mimetype: ext === '.png' ? 'image/png' : 'application/pdf',
        path: path.join('uploads', filename),
        subjectCode: teacher.subjectCode,
        grade: Number(teacher.grade),
        teacherId: teacher.teacherId,
        createdAt: new Date(Date.UTC(2026, 8, 1 + i)),
      };
    });
    if (fileDocs.length) await db.collection('filedocs').insertMany(fileDocs);
  }
  console.log(`  filedocs: ${fileDocs.length}`);

  // -- Summary -------------------------------------------------------------
  console.log('\n==================================================');
  console.log('  DEMO DATA SEEDED SUCCESSFULLY');
  console.log('==================================================');
  console.log('  Directors  : 2');
  console.log(`  Teachers   : ${teacherDocs.length}`);
  console.log(`  Students   : ${students.length}`);
  console.log(`  Subjects   : ${subjects.length}`);
  console.log('==================================================');
  console.log('\n  LOGIN CREDENTIALS (password for everyone):');
  console.log(`\n    password : ${DEMO_PASSWORD}\n`);
  console.log('    Director : director');
  console.log('    Teacher  : teacher1  ..  teacher12');
  console.log(`    Student  : ${students[0].username}`);
  console.log('               ' + students.slice(1, 4).map(s => s.username).join('\n               '));
  console.log('\n==================================================\n');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('SEED FAILED:', err.message);
  process.exit(1);
});
