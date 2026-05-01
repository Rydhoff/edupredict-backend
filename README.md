# EduPredict Math Backend API — Request & Response Documentation

Dokumentasi ini dibuat untuk backend **EduPredict Math** berbasis **Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, dan bcrypt**.

Dokumentasi ini bisa digunakan untuk:

- Integrasi frontend React
- Testing API menggunakan Postman / Thunder Client
- Dokumentasi project GitHub
- Portfolio
- Handoff ke tim frontend / contractor
- Persiapan interview

---

# 1. Project Overview

EduPredict Math adalah platform pembelajaran matematika berbasis web yang memiliki fitur:

- Authentication dan authorization
- Role user: `student` dan `teacher`
- Quiz library
- Quiz play
- Quiz result submission
- Progress tracking
- Skill mastery analysis
- AI-style learning insight
- Recommendation system
- Gamification: XP, level, streak
- Achievement system
- Student dashboard
- Teacher dashboard
- Question management
- Profile dan settings

---

# 2. Tech Stack

Backend menggunakan:

```txt
Node.js
Express.js
MongoDB Atlas
Mongoose
JWT Authentication
bcryptjs
dotenv
cors
nodemon
```

---

# 3. Base URL

Untuk local development:

```txt
http://localhost:5000
```

Contoh endpoint:

```txt
http://localhost:5000/api/auth/login
```

---

# 4. Authentication

Backend menggunakan JWT Bearer Token.

Untuk semua endpoint private, gunakan header:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Contoh:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...
```

---

# 5. Role Access

Backend memiliki dua role utama:

```txt
student
teacher
```

## Student

Student dapat mengakses:

```txt
GET    /api/auth/me
GET    /api/profile
PUT    /api/profile
PUT    /api/profile/preferences
PUT    /api/profile/password
GET    /api/concepts
GET    /api/concepts/:id
GET    /api/questions
GET    /api/questions/:id
GET    /api/quizzes
GET    /api/quizzes/start
GET    /api/quizzes/recommendation
POST   /api/progress/submit
GET    /api/progress/stats
GET    /api/progress/concept-analysis
GET    /api/gamification/me
GET    /api/gamification/achievements
GET    /api/dashboard/student
```

## Teacher

Teacher dapat mengakses:

```txt
GET    /api/auth/me
GET    /api/profile
PUT    /api/profile
PUT    /api/profile/preferences
PUT    /api/profile/password
GET    /api/concepts
GET    /api/concepts/:id
POST   /api/concepts
GET    /api/questions
GET    /api/questions/:id
POST   /api/questions
PUT    /api/questions/:id
DELETE /api/questions/:id
GET    /api/quizzes
GET    /api/quizzes/start
GET    /api/teacher/dashboard
GET    /api/teacher/students-progress
GET    /api/teacher/concept-performance
```

---

# 6. Environment Variables

Buat file `.env` di root backend:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/edupredict_math
JWT_SECRET=edupredict_math_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Keterangan:

| Variable | Fungsi |
|---|---|
| `PORT` | Port server backend |
| `MONGODB_URI` | Connection string MongoDB Atlas |
| `JWT_SECRET` | Secret key untuk JWT |
| `JWT_EXPIRES_IN` | Masa aktif token |
| `CLIENT_URL` | URL frontend React |

---

# 7. Installation

Install dependencies:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Jalankan production server:

```bash
npm start
```

Jalankan seeder:

```bash
npm run seed
```

---

# 8. Demo Account

Seeder akan membuat akun demo berikut:

## Student

```txt
email: student@example.com
password: password123
```

## Teacher

```txt
email: teacher@example.com
password: password123
```

---

# 9. Health Check API

## 9.1 GET /

Cek apakah API berjalan.

### Access

Public

### Request

```http
GET /
```

### Success Response

```json
{
  "message": "EduPredict Math API is running"
}
```

---

## 9.2 GET /health

Cek status service.

### Access

Public

### Request

```http
GET /health
```

### Success Response

```json
{
  "status": "OK",
  "service": "EduPredict Math API",
  "database": "MongoDB Atlas",
  "timestamp": "2026-05-01T00:00:00.000Z"
}
```

---

# 10. Auth API

---

## 10.1 POST /api/auth/register

Register user baru.

### Access

Public

### Request

```http
POST /api/auth/register
Content-Type: application/json
```

### Request Body

```json
{
  "name": "Ridho Student",
  "email": "student@example.com",
  "password": "password123",
  "role": "student"
}
```

### Field Description

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Nama lengkap user |
| `email` | string | yes | Email user |
| `password` | string | yes | Minimal 6 karakter |
| `role` | string | optional | `student` atau `teacher`, default `student` |

### Success Response — 201

```json
{
  "message": "Register success",
  "user": {
    "id": "6814abc123",
    "name": "Ridho Student",
    "email": "student@example.com",
    "role": "student"
  }
}
```

### Error Response — 400

```json
{
  "message": "Name, email, and password are required"
}
```

### Error Response — 400

```json
{
  "message": "Password must be at least 6 characters"
}
```

### Error Response — 409

```json
{
  "message": "Email already registered"
}
```

---

## 10.2 POST /api/auth/login

Login user.

### Access

Public

### Request

```http
POST /api/auth/login
Content-Type: application/json
```

### Request Body

```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

### Field Description

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | yes | Email user |
| `password` | string | yes | Password user |

### Success Response — 200

```json
{
  "message": "Login success",
  "token": "jwt_token_here",
  "user": {
    "id": "6814abc123",
    "name": "Ridho Student",
    "email": "student@example.com",
    "role": "student"
  }
}
```

### Error Response — 400

```json
{
  "message": "Email and password are required"
}
```

### Error Response — 401

```json
{
  "message": "Invalid email or password"
}
```

---

## 10.3 GET /api/auth/me

Ambil data user yang sedang login.

### Access

Private

### Role

`student`, `teacher`

### Request

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Success Response — 200

```json
{
  "user": {
    "id": "6814abc123",
    "name": "Ridho Student",
    "email": "student@example.com",
    "role": "student"
  }
}
```

### Error Response — 401

```json
{
  "message": "Not authorized, token not found"
}
```

### Error Response — 401

```json
{
  "message": "Not authorized, token invalid"
}
```

---

# 11. Profile API

---

## 11.1 GET /api/profile

Ambil profile user login.

### Access

Private

### Role

`student`, `teacher`

### Request

```http
GET /api/profile
Authorization: Bearer <token>
```

### Success Response — 200

```json
{
  "profile": {
    "id": "6814abc123",
    "name": "Ridho Student",
    "email": "student@example.com",
    "role": "student",
    "preferences": {
      "adaptiveDifficulty": true,
      "aiHelp": true,
      "notification": true,
      "theme": "light"
    },
    "createdAt": "2026-05-01T00:00:00.000Z",
    "updatedAt": "2026-05-01T00:00:00.000Z"
  }
}
```

---

## 11.2 PUT /api/profile

Update nama profile.

### Access

Private

### Role

`student`, `teacher`

### Request

```http
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body

```json
{
  "name": "Ridho Darmawan"
}
```

### Success Response — 200

```json
{
  "message": "Profile updated successfully",
  "profile": {
    "id": "6814abc123",
    "name": "Ridho Darmawan",
    "email": "student@example.com",
    "role": "student",
    "preferences": {
      "adaptiveDifficulty": true,
      "aiHelp": true,
      "notification": true,
      "theme": "light"
    }
  }
}
```

### Error Response — 400

```json
{
  "message": "Name is required"
}
```

---

## 11.3 PUT /api/profile/preferences

Update preferensi user.

### Access

Private

### Role

`student`, `teacher`

### Request

```http
PUT /api/profile/preferences
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body

```json
{
  "adaptiveDifficulty": true,
  "aiHelp": true,
  "notification": false,
  "theme": "light"
}
```

### Field Description

| Field | Type | Required | Description |
|---|---|---|---|
| `adaptiveDifficulty` | boolean | optional | Adaptive difficulty aktif/tidak |
| `aiHelp` | boolean | optional | AI help aktif/tidak |
| `notification` | boolean | optional | Notification aktif/tidak |
| `theme` | string | optional | `light` atau `dark` |

### Success Response — 200

```json
{
  "message": "Preferences updated successfully",
  "preferences": {
    "adaptiveDifficulty": true,
    "aiHelp": true,
    "notification": false,
    "theme": "light"
  }
}
```

### Error Response — 400

```json
{
  "message": "Theme must be light or dark"
}
```

---

## 11.4 PUT /api/profile/password

Update password user.

### Access

Private

### Role

`student`, `teacher`

### Request

```http
PUT /api/profile/password
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body

```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

### Success Response — 200

```json
{
  "message": "Password updated successfully"
}
```

### Error Response — 400

```json
{
  "message": "Current password, new password, and confirm password are required"
}
```

### Error Response — 400

```json
{
  "message": "New password must be at least 6 characters"
}
```

### Error Response — 400

```json
{
  "message": "New password and confirm password do not match"
}
```

### Error Response — 401

```json
{
  "message": "Current password is incorrect"
}
```

---

# 12. Concept API

---

## 12.1 GET /api/concepts

Ambil semua concept.

### Access

Private

### Role

`student`, `teacher`

### Request

```http
GET /api/concepts
Authorization: Bearer <token>
```

### Success Response — 200

```json
{
  "concepts": [
    {
      "_id": "6814concept001",
      "slug": "linear-equations",
      "name": "Linear Equations",
      "description": "Learn how to solve equations with one variable.",
      "createdAt": "2026-05-01T00:00:00.000Z",
      "updatedAt": "2026-05-01T00:00:00.000Z"
    },
    {
      "_id": "6814concept002",
      "slug": "statistics",
      "name": "Statistics",
      "description": "Learn mean, median, mode, and data interpretation.",
      "createdAt": "2026-05-01T00:00:00.000Z",
      "updatedAt": "2026-05-01T00:00:00.000Z"
    }
  ]
}
```

---

## 12.2 GET /api/concepts/:id

Ambil detail concept.

### Access

Private

### Role

`student`, `teacher`

### Request

```http
GET /api/concepts/6814concept001
Authorization: Bearer <token>
```

### Success Response — 200

```json
{
  "concept": {
    "_id": "6814concept001",
    "slug": "linear-equations",
    "name": "Linear Equations",
    "description": "Learn how to solve equations with one variable.",
    "createdAt": "2026-05-01T00:00:00.000Z",
    "updatedAt": "2026-05-01T00:00:00.000Z"
  }
}
```

### Error Response — 404

```json
{
  "message": "Concept not found"
}
```

---

## 12.3 POST /api/concepts

Buat concept baru.

### Access

Private

### Role

`teacher` only

### Request

```http
POST /api/concepts
Authorization: Bearer <teacher_token>
Content-Type: application/json
```

### Request Body

```json
{
  "slug": "fractions",
  "name": "Fractions",
  "description": "Learn fractions and basic operations."
}
```

### Field Description

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | string | yes | Unique slug concept |
| `name` | string | yes | Nama concept |
| `description` | string | optional | Deskripsi concept |

### Success Response — 201

```json
{
  "message": "Concept created successfully",
  "concept": {
    "_id": "6814concept003",
    "slug": "fractions",
    "name": "Fractions",
    "description": "Learn fractions and basic operations.",
    "createdAt": "2026-05-01T00:00:00.000Z",
    "updatedAt": "2026-05-01T00:00:00.000Z"
  }
}
```

### Error Response — 400

```json
{
  "message": "Slug and name are required"
}
```

### Error Response — 409

```json
{
  "message": "Concept slug already exists"
}
```

### Error Response — 403

```json
{
  "message": "Access forbidden"
}
```

---

# 13. Question API

---

## 13.1 GET /api/questions

Ambil daftar soal.

### Access

Private

### Role

`student`, `teacher`

### Request

```http
GET /api/questions
Authorization: Bearer <token>
```

### Query Parameters

| Query | Type | Required | Description |
|---|---|---|---|
| `conceptId` | string | optional | Filter berdasarkan concept |
| `difficulty` | string | optional | `easy`, `medium`, `hard` |
| `keyword` | string | optional | Search berdasarkan question text |

### Example Request

```http
GET /api/questions?conceptId=6814concept001&difficulty=easy&keyword=equation
Authorization: Bearer <token>
```

### Success Response — 200

```json
{
  "total": 1,
  "questions": [
    {
      "_id": "6814question001",
      "concept": {
        "_id": "6814concept001",
        "slug": "linear-equations",
        "name": "Linear Equations",
        "description": "Learn how to solve equations with one variable."
      },
      "difficulty": "easy",
      "questionText": "What is the solution to the equation 2x + 5 = 13?",
      "options": [
        {
          "label": "A",
          "text": "x = 3"
        },
        {
          "label": "B",
          "text": "x = 4"
        },
        {
          "label": "C",
          "text": "x = 5"
        },
        {
          "label": "D",
          "text": "x = 6"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Subtract 5 from both sides: 2x = 8. Then divide by 2, so x = 4.",
      "createdBy": {
        "_id": "6814teacher001",
        "name": "Teacher Demo",
        "email": "teacher@example.com",
        "role": "teacher"
      },
      "createdAt": "2026-05-01T00:00:00.000Z",
      "updatedAt": "2026-05-01T00:00:00.000Z"
    }
  ]
}
```

---

## 13.2 GET /api/questions/:id

Ambil detail soal.

### Access

Private

### Role

`student`, `teacher`

### Request

```http
GET /api/questions/6814question001
Authorization: Bearer <token>
```

### Success Response — 200

```json
{
  "question": {
    "_id": "6814question001",
    "concept": {
      "_id": "6814concept001",
      "slug": "linear-equations",
      "name": "Linear Equations",
      "description": "Learn how to solve equations with one variable."
    },
    "difficulty": "easy",
    "questionText": "What is the solution to the equation 2x + 5 = 13?",
    "options": [
      {
        "label": "A",
        "text": "x = 3"
      },
      {
        "label": "B",
        "text": "x = 4"
      },
      {
        "label": "C",
        "text": "x = 5"
      },
      {
        "label": "D",
        "text": "x = 6"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Subtract 5 from both sides: 2x = 8. Then divide by 2, so x = 4.",
    "createdBy": {
      "_id": "6814teacher001",
      "name": "Teacher Demo",
      "email": "teacher@example.com",
      "role": "teacher"
    }
  }
}
```

### Error Response — 404

```json
{
  "message": "Question not found"
}
```

---

## 13.3 POST /api/questions

Buat soal baru.

### Access

Private

### Role

`teacher` only

### Request

```http
POST /api/questions
Authorization: Bearer <teacher_token>
Content-Type: application/json
```

### Request Body

```json
{
  "conceptId": "6814concept001",
  "difficulty": "easy",
  "questionText": "What is the solution to the equation 2x + 5 = 13?",
  "options": [
    {
      "label": "A",
      "text": "x = 3"
    },
    {
      "label": "B",
      "text": "x = 4"
    },
    {
      "label": "C",
      "text": "x = 5"
    },
    {
      "label": "D",
      "text": "x = 6"
    }
  ],
  "correctAnswer": "B",
  "explanation": "Subtract 5 from both sides: 2x = 8. Then divide by 2, so x = 4."
}
```

### Field Description

| Field | Type | Required | Description |
|---|---|---|---|
| `conceptId` | string | yes | ID concept |
| `difficulty` | string | yes | `easy`, `medium`, `hard` |
| `questionText` | string | yes | Teks pertanyaan |
| `options` | array | yes | Pilihan jawaban |
| `correctAnswer` | string | yes | Label jawaban benar |
| `explanation` | string | optional | Penjelasan jawaban |

### Success Response — 201

```json
{
  "message": "Question created successfully",
  "question": {
    "_id": "6814question001",
    "concept": {
      "_id": "6814concept001",
      "slug": "linear-equations",
      "name": "Linear Equations",
      "description": "Learn how to solve equations with one variable."
    },
    "difficulty": "easy",
    "questionText": "What is the solution to the equation 2x + 5 = 13?",
    "options": [
      {
        "label": "A",
        "text": "x = 3"
      },
      {
        "label": "B",
        "text": "x = 4"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Subtract 5 from both sides: 2x = 8. Then divide by 2, so x = 4.",
    "createdBy": {
      "_id": "6814teacher001",
      "name": "Teacher Demo",
      "email": "teacher@example.com",
      "role": "teacher"
    }
  }
}
```

### Error Response — 400

```json
{
  "message": "Concept ID, difficulty, question text, options, and correct answer are required"
}
```

### Error Response — 400

```json
{
  "message": "Options must be an array with at least 2 items"
}
```

### Error Response — 400

```json
{
  "message": "Correct answer must match one of the option labels"
}
```

### Error Response — 404

```json
{
  "message": "Concept not found"
}
```

---

## 13.4 PUT /api/questions/:id

Update soal.

### Access

Private

### Role

`teacher` only

### Request

```http
PUT /api/questions/6814question001
Authorization: Bearer <teacher_token>
Content-Type: application/json
```

### Request Body

Semua field optional. Kirim hanya field yang ingin diubah.

```json
{
  "conceptId": "6814concept001",
  "difficulty": "medium",
  "questionText": "Solve for x: 3x - 7 = 14.",
  "options": [
    {
      "label": "A",
      "text": "x = 5"
    },
    {
      "label": "B",
      "text": "x = 6"
    },
    {
      "label": "C",
      "text": "x = 7"
    },
    {
      "label": "D",
      "text": "x = 8"
    }
  ],
  "correctAnswer": "C",
  "explanation": "Add 7 to both sides: 3x = 21. Divide by 3, so x = 7."
}
```

### Success Response — 200

```json
{
  "message": "Question updated successfully",
  "question": {
    "_id": "6814question001",
    "concept": {
      "_id": "6814concept001",
      "slug": "linear-equations",
      "name": "Linear Equations"
    },
    "difficulty": "medium",
    "questionText": "Solve for x: 3x - 7 = 14.",
    "options": [
      {
        "label": "A",
        "text": "x = 5"
      },
      {
        "label": "B",
        "text": "x = 6"
      },
      {
        "label": "C",
        "text": "x = 7"
      },
      {
        "label": "D",
        "text": "x = 8"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Add 7 to both sides: 3x = 21. Divide by 3, so x = 7."
  }
}
```

### Error Response — 404

```json
{
  "message": "Question not found"
}
```

---

## 13.5 DELETE /api/questions/:id

Hapus soal.

### Access

Private

### Role

`teacher` only

### Request

```http
DELETE /api/questions/6814question001
Authorization: Bearer <teacher_token>
```

### Success Response — 200

```json
{
  "message": "Question deleted successfully"
}
```

### Error Response — 404

```json
{
  "message": "Question not found"
}
```

---

# 14. Quiz API

---

## 14.1 GET /api/quizzes

Ambil quiz library berdasarkan concept.

### Access

Private

### Role

`student`, `teacher`

### Request

```http
GET /api/quizzes
Authorization: Bearer <token>
```

### Query Parameters

| Query | Type | Required | Description |
|---|---|---|---|
| `difficulty` | string | optional | `easy`, `medium`, `hard` |
| `keyword` | string | optional | Search berdasarkan question text |

### Example Request

```http
GET /api/quizzes?difficulty=easy&keyword=equation
Authorization: Bearer <token>
```

### Success Response — 200

```json
{
  "total": 3,
  "quizzes": [
    {
      "conceptId": "6814concept001",
      "slug": "linear-equations",
      "title": "Linear Equations",
      "concept": "Linear Equations",
      "description": "Learn how to solve equations with one variable.",
      "difficulty": "easy",
      "totalQuestions": 2,
      "estimatedTime": 5
    }
  ]
}
```

---

## 14.2 GET /api/quizzes/start

Mulai quiz berdasarkan concept.

### Access

Private

### Role

`student`, `teacher`

### Request

```http
GET /api/quizzes/start?conceptId=6814concept001&difficulty=easy&limit=5
Authorization: Bearer <token>
```

### Query Parameters

| Query | Type | Required | Description |
|---|---|---|---|
| `conceptId` | string | yes | ID concept |
| `difficulty` | string | optional | `easy`, `medium`, `hard` |
| `limit` | number | optional | Jumlah soal, default 10 |

### Success Response — 200

```json
{
  "quiz": {
    "conceptId": "6814concept001",
    "conceptName": "Linear Equations",
    "difficulty": "easy",
    "totalQuestions": 2,
    "timer": 240,
    "questions": [
      {
        "_id": "6814question001",
        "concept": "6814concept001",
        "difficulty": "easy",
        "questionText": "What is the solution to the equation 2x + 5 = 13?",
        "options": [
          {
            "label": "A",
            "text": "x = 3"
          },
          {
            "label": "B",
            "text": "x = 4"
          },
          {
            "label": "C",
            "text": "x = 5"
          },
          {
            "label": "D",
            "text": "x = 6"
          }
        ],
        "explanation": "Subtract 5 from both sides: 2x = 8. Then divide by 2, so x = 4."
      }
    ]
  }
}
```

### Important Note

Pada endpoint start quiz, field berikut **tidak dikirim**:

```txt
correctAnswer
```

Tujuannya agar jawaban benar tidak bocor ke frontend.

### Error Response — 400

```json
{
  "message": "Concept ID is required"
}
```

### Error Response — 404

```json
{
  "message": "Concept not found"
}
```

### Error Response — 404

```json
{
  "message": "No questions available for this quiz"
}
```

---

## 14.3 GET /api/quizzes/recommendation

Ambil rekomendasi quiz untuk student.

### Access

Private

### Role

`student` only

### Request

```http
GET /api/quizzes/recommendation
Authorization: Bearer <student_token>
```

### Success Response — 200

```json
{
  "recommendedConcept": {
    "id": "6814concept001",
    "slug": "linear-equations",
    "name": "Linear Equations"
  },
  "reason": "Start with this concept first. Personalized recommendation will improve after you complete quizzes.",
  "questions": [
    {
      "_id": "6814question001",
      "concept": "6814concept001",
      "difficulty": "easy",
      "questionText": "What is the solution to the equation 2x + 5 = 13?",
      "options": [
        {
          "label": "A",
          "text": "x = 3"
        },
        {
          "label": "B",
          "text": "x = 4"
        }
      ],
      "explanation": "Subtract 5 from both sides..."
    }
  ]
}
```

### Error Response — 404

```json
{
  "message": "No concepts available"
}
```

---

# 15. Progress API

---

## 15.1 POST /api/progress/submit

Submit hasil quiz.

### Access

Private

### Role

`student` only

### Request

```http
POST /api/progress/submit
Authorization: Bearer <student_token>
Content-Type: application/json
```

### Request Body

```json
{
  "conceptId": "6814concept001",
  "timeSpent": 180,
  "answers": [
    {
      "questionId": "6814question001",
      "userAnswer": "B"
    },
    {
      "questionId": "6814question002",
      "userAnswer": "C"
    }
  ]
}
```

### Field Description

| Field | Type | Required | Description |
|---|---|---|---|
| `conceptId` | string | yes | ID concept quiz |
| `timeSpent` | number | optional | Waktu pengerjaan dalam detik |
| `answers` | array | yes | Array jawaban user |
| `answers[].questionId` | string | yes | ID question |
| `answers[].userAnswer` | string | yes | Jawaban user: `A`, `B`, `C`, atau `D` |

### Backend Process

Saat endpoint ini dipanggil, backend akan:

1. Validasi concept dan question
2. Ambil jawaban benar dari database
3. Hitung jumlah benar
4. Hitung score
5. Hitung XP
6. Simpan quiz attempt
7. Update user progress
8. Update mastery score
9. Update XP, level, streak
10. Cek achievement baru

### Success Response — 201

```json
{
  "message": "Progress saved successfully",
  "result": {
    "attemptId": "6814attempt001",
    "score": 100,
    "correctCount": 2,
    "totalQuestions": 2,
    "timeSpent": 180,
    "xpEarned": 70
  },
  "progress": {
    "conceptId": "6814concept001",
    "masteryScore": 100,
    "totalAttempts": 1
  },
  "gamification": {
    "totalXP": 120,
    "level": 2,
    "currentStreak": 1,
    "bestStreak": 1,
    "xpToNextLevel": 80,
    "unlockedAchievements": [
      {
        "id": "6814achievement001",
        "code": "FIRST_QUIZ",
        "title": "First Quiz",
        "description": "Complete your first quiz.",
        "icon": "🎯",
        "xpReward": 20
      }
    ]
  }
}
```

### Error Response — 400

```json
{
  "message": "Concept ID and answers array are required"
}
```

### Error Response — 400

```json
{
  "message": "Some questions are invalid or not related to this concept"
}
```

---

## 15.2 GET /api/progress/stats

Ambil statistik progress student.

### Access

Private

### Role

`student` only

### Request

```http
GET /api/progress/stats
Authorization: Bearer <student_token>
```

### Success Response — 200

```json
{
  "stats": {
    "totalAttempts": 3,
    "totalQuestions": 6,
    "totalCorrect": 5,
    "averageScore": 83,
    "accuracy": 83,
    "learningStatus": "Excellent Progress",
    "totalXP": 190,
    "level": 2,
    "currentStreak": 1
  }
}
```

### Learning Status Rules

```txt
averageScore >= 80 => Excellent Progress
averageScore >= 60 => Good Progress
totalAttempts === 0 => Start Learning
else => Needs Practice
```

---

## 15.3 GET /api/progress/concept-analysis

Ambil analisis mastery student per concept.

### Access

Private

### Role

`student` only

### Request

```http
GET /api/progress/concept-analysis
Authorization: Bearer <student_token>
```

### Success Response — 200

```json
{
  "concepts": [
    {
      "conceptId": "6814concept001",
      "slug": "linear-equations",
      "conceptName": "Linear Equations",
      "description": "Learn how to solve equations with one variable.",
      "masteryScore": 80,
      "totalAttempts": 2,
      "correctAttempts": 4,
      "totalQuestionsAnswered": 5,
      "lastPracticedAt": "2026-05-01T00:00:00.000Z",
      "status": "mastered"
    },
    {
      "conceptId": "6814concept002",
      "slug": "statistics",
      "conceptName": "Statistics",
      "description": "Learn mean, median, mode, and data interpretation.",
      "masteryScore": 45,
      "totalAttempts": 1,
      "correctAttempts": 1,
      "totalQuestionsAnswered": 3,
      "lastPracticedAt": "2026-05-01T00:00:00.000Z",
      "status": "weak"
    }
  ],
  "weakestConcept": {
    "conceptId": "6814concept002",
    "conceptName": "Statistics",
    "masteryScore": 45
  }
}
```

### Status Rules

```txt
masteryScore >= 80 => mastered
masteryScore >= 50 => improving
masteryScore < 50  => weak
```

---

# 16. Gamification API

---

## 16.1 GET /api/gamification/me

Ambil data gamification student.

### Access

Private

### Role

`student` only

### Request

```http
GET /api/gamification/me
Authorization: Bearer <student_token>
```

### Success Response — 200

```json
{
  "gamification": {
    "totalXP": 190,
    "level": 2,
    "currentStreak": 1,
    "bestStreak": 1,
    "xpToNextLevel": 10,
    "xpProgress": 90,
    "achievements": [
      {
        "id": "6814achievement001",
        "code": "FIRST_QUIZ",
        "title": "First Quiz",
        "description": "Complete your first quiz.",
        "icon": "🎯",
        "xpReward": 20,
        "unlockedAt": "2026-05-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

## 16.2 GET /api/gamification/achievements

Ambil semua achievement dan status unlock.

### Access

Private

### Role

`student` only

### Request

```http
GET /api/gamification/achievements
Authorization: Bearer <student_token>
```

### Success Response — 200

```json
{
  "achievements": [
    {
      "id": "6814achievement001",
      "code": "FIRST_QUIZ",
      "title": "First Quiz",
      "description": "Complete your first quiz.",
      "icon": "🎯",
      "conditionType": "FIRST_QUIZ",
      "conditionValue": 1,
      "xpReward": 20,
      "unlocked": true
    },
    {
      "id": "6814achievement002",
      "code": "PERFECT_SCORE",
      "title": "Perfect Score",
      "description": "Get 100% score on a quiz.",
      "icon": "🌟",
      "conditionType": "PERFECT_SCORE",
      "conditionValue": 100,
      "xpReward": 30,
      "unlocked": false
    }
  ]
}
```

---

# 17. Student Dashboard API

---

## 17.1 GET /api/dashboard/student

Ambil semua data dashboard student dalam satu endpoint.

### Access

Private

### Role

`student` only

### Request

```http
GET /api/dashboard/student
Authorization: Bearer <student_token>
```

### Success Response — 200

```json
{
  "dashboard": {
    "user": {
      "id": "6814student001",
      "name": "Student Demo",
      "email": "student@example.com",
      "role": "student"
    },
    "stats": {
      "totalQuizzesCompleted": 3,
      "accuracyRate": 83,
      "averageScore": 83,
      "overallMastery": 78,
      "timeSpent": 540
    },
    "gamification": {
      "totalXP": 190,
      "level": 2,
      "currentStreak": 1,
      "bestStreak": 1,
      "xpProgress": 90,
      "xpToNextLevel": 10
    },
    "aiInsight": "Your weakest topic is Statistics. Practice this topic to improve your overall mastery.",
    "skillProgress": [
      {
        "conceptId": "6814concept001",
        "slug": "linear-equations",
        "conceptName": "Linear Equations",
        "masteryScore": 80,
        "totalAttempts": 2,
        "status": "mastered"
      },
      {
        "conceptId": "6814concept002",
        "slug": "statistics",
        "conceptName": "Statistics",
        "masteryScore": 45,
        "totalAttempts": 1,
        "status": "weak"
      }
    ],
    "recentActivity": [
      {
        "attemptId": "6814attempt001",
        "conceptId": "6814concept001",
        "conceptName": "Linear Equations",
        "score": 100,
        "correctCount": 2,
        "totalQuestions": 2,
        "xpEarned": 70,
        "createdAt": "2026-05-01T00:00:00.000Z"
      }
    ],
    "recommendedPractice": {
      "conceptId": "6814concept002",
      "slug": "statistics",
      "title": "Statistics",
      "description": "Learn mean, median, mode, and data interpretation.",
      "totalQuestions": 2,
      "reason": "Focus on Statistics because your mastery score is still 45%."
    }
  }
}
```

### Empty State Response Example — 200

Jika student belum pernah quiz:

```json
{
  "dashboard": {
    "user": {
      "id": "6814student001",
      "name": "Student Demo",
      "email": "student@example.com",
      "role": "student"
    },
    "stats": {
      "totalQuizzesCompleted": 0,
      "accuracyRate": 0,
      "averageScore": 0,
      "overallMastery": 0,
      "timeSpent": 0
    },
    "gamification": {
      "totalXP": 0,
      "level": 1,
      "currentStreak": 0,
      "bestStreak": 0,
      "xpProgress": 0,
      "xpToNextLevel": 100
    },
    "aiInsight": "Start your first quiz to unlock AI learning insight.",
    "skillProgress": [],
    "recentActivity": [],
    "recommendedPractice": {
      "conceptId": "6814concept001",
      "slug": "linear-equations",
      "title": "Linear Equations",
      "description": "Learn how to solve equations with one variable.",
      "totalQuestions": 2,
      "reason": "Start your first quiz to unlock personalized learning recommendations."
    }
  }
}
```

---

# 18. Teacher API

---

## 18.1 GET /api/teacher/dashboard

Ambil ringkasan dashboard teacher.

### Access

Private

### Role

`teacher` only

### Request

```http
GET /api/teacher/dashboard
Authorization: Bearer <teacher_token>
```

### Success Response — 200

```json
{
  "dashboard": {
    "totalStudents": 12,
    "averageMastery": 68,
    "needIntervention": 4,
    "totalQuizAttempts": 35,
    "aiInterventions": 4
  }
}
```

### Field Description

| Field | Description |
|---|---|
| `totalStudents` | Jumlah user dengan role student |
| `averageMastery` | Rata-rata mastery semua progress |
| `needIntervention` | Jumlah student yang punya mastery < 50 |
| `totalQuizAttempts` | Jumlah attempt seluruh student |
| `aiInterventions` | Jumlah student yang perlu intervensi |

---

## 18.2 GET /api/teacher/students-progress

Ambil progress semua student.

### Access

Private

### Role

`teacher` only

### Request

```http
GET /api/teacher/students-progress
Authorization: Bearer <teacher_token>
```

### Success Response — 200

```json
{
  "total": 2,
  "students": [
    {
      "studentId": "6814student001",
      "name": "Student Demo",
      "email": "student@example.com",
      "totalAttempts": 5,
      "averageMastery": 74,
      "weakConcepts": [
        {
          "conceptId": "6814concept002",
          "conceptName": "Statistics",
          "masteryScore": 45
        }
      ],
      "lastScore": 80,
      "lastActivity": "2026-05-01T00:00:00.000Z",
      "status": "good",
      "conceptsInProgress": [
        {
          "conceptId": "6814concept001",
          "conceptName": "Linear Equations",
          "masteryScore": 80,
          "totalAttempts": 3
        },
        {
          "conceptId": "6814concept002",
          "conceptName": "Statistics",
          "masteryScore": 45,
          "totalAttempts": 2
        }
      ]
    },
    {
      "studentId": "6814student002",
      "name": "Student Two",
      "email": "student2@example.com",
      "totalAttempts": 0,
      "averageMastery": 0,
      "weakConcepts": [],
      "lastScore": 0,
      "lastActivity": null,
      "status": "developing",
      "conceptsInProgress": []
    }
  ]
}
```

### Student Status Rules

```txt
averageMastery >= 85 => excellent
averageMastery >= 70 => good
averageMastery < 50 and totalAttempts > 0 => at risk
else => developing
```

---

## 18.3 GET /api/teacher/concept-performance

Ambil performa kelas per concept.

### Access

Private

### Role

`teacher` only

### Request

```http
GET /api/teacher/concept-performance
Authorization: Bearer <teacher_token>
```

### Success Response — 200

```json
{
  "total": 3,
  "concepts": [
    {
      "conceptId": "6814concept001",
      "slug": "linear-equations",
      "conceptName": "Linear Equations",
      "description": "Learn how to solve equations with one variable.",
      "averageMastery": 72,
      "accuracy": 80,
      "totalAttempts": 10,
      "studentsPracticed": 3,
      "studentsNeedHelp": 1,
      "status": "moderate"
    },
    {
      "conceptId": "6814concept002",
      "slug": "statistics",
      "conceptName": "Statistics",
      "description": "Learn mean, median, mode, and data interpretation.",
      "averageMastery": 45,
      "accuracy": 50,
      "totalAttempts": 5,
      "studentsPracticed": 2,
      "studentsNeedHelp": 2,
      "status": "weak"
    }
  ]
}
```

### Concept Status Rules

```txt
averageMastery >= 80 => strong
averageMastery >= 50 => moderate
attempts.length === 0 => no data
else => weak
```

---

# 19. Common Error Responses

---

## 19.1 Token Tidak Ada

### Response — 401

```json
{
  "message": "Not authorized, token not found"
}
```

---

## 19.2 Token Salah atau Expired

### Response — 401

```json
{
  "message": "Not authorized, token invalid"
}
```

---

## 19.3 Role Tidak Sesuai

### Response — 403

```json
{
  "message": "Access forbidden"
}
```

---

## 19.4 Route Tidak Ditemukan

### Response — 404

```json
{
  "message": "Route not found: /api/unknown"
}
```

---

## 19.5 Duplicate Data

### Response — 409

```json
{
  "message": "Email already registered"
}
```

---

## 19.6 Validation Error

### Response — 400

```json
{
  "message": "Field is required"
}
```

---

# 20. Business Logic

---

## 20.1 XP Calculation

Formula:

```txt
xpEarned = correctCount * 10 + completionBonus + perfectBonus
```

Rules:

```txt
correct answer = +10 XP
completion bonus = +20 XP
perfect score bonus = +30 XP
wrong answer = 0 XP
```

Example:

```txt
correctCount = 5
score = 100

XP = 5 * 10 + 20 + 30
XP = 100
```

---

## 20.2 Level Calculation

Formula:

```txt
level = floor(totalXP / 100) + 1
```

Example:

```txt
0 XP   = Level 1
100 XP = Level 2
250 XP = Level 3
```

---

## 20.3 XP Progress

Formula:

```txt
xpProgress = totalXP % 100
xpToNextLevel = 100 - (totalXP % 100)
```

Example:

```txt
totalXP = 250
xpProgress = 50
xpToNextLevel = 50
```

---

## 20.4 Mastery Calculation

Untuk progress pertama:

```txt
masteryScore = latestScore
```

Untuk progress berikutnya:

```txt
newMastery = round(oldMastery * 0.7 + latestScore * 0.3)
```

Example:

```txt
oldMastery = 70
latestScore = 90

newMastery = round(70 * 0.7 + 90 * 0.3)
newMastery = round(49 + 27)
newMastery = 76
```

---

## 20.5 Streak Calculation

Rules:

```txt
Jika user belum pernah aktif:
currentStreak = 1

Jika lastActiveDate adalah hari ini:
currentStreak tidak berubah

Jika lastActiveDate adalah kemarin:
currentStreak + 1

Jika lastActiveDate lebih lama dari kemarin:
currentStreak reset ke 1
```

---

## 20.6 Achievement Unlock Rules

Achievement default:

| Code | Title | Condition |
|---|---|---|
| `FIRST_QUIZ` | First Quiz | Menyelesaikan quiz pertama |
| `PERFECT_SCORE` | Perfect Score | Mendapatkan score 100 |
| `STREAK_5` | 5-Day Streak | Belajar 5 hari berturut-turut |
| `MATH_MASTER_50` | Math Master | Menyelesaikan 50 quiz |
| `MASTERY_90` | Concept Master | Mastery mencapai 90 |

---

# 21. MongoDB Collections

Backend menggunakan collection berikut:

```txt
users
concepts
questions
quizattempts
userprogresses
usergamifications
achievements
userachievements
```

---

# 22. MongoDB Relationship Summary

```txt
User 1 -- many QuizAttempt
User 1 -- many UserProgress
User 1 -- one UserGamification
User many -- many Achievement through UserAchievement

Concept 1 -- many Question
Concept 1 -- many QuizAttempt
Concept 1 -- many UserProgress

Question many -- one Concept
Question many -- one User as createdBy

QuizAttempt embeds answers[]
Question embeds options[]
User embeds preferences
```

---

# 23. ERD MongoDB Mermaid Diagram

```mermaid
erDiagram
    USERS ||--o{ QUESTIONS : creates
    USERS ||--o{ QUIZ_ATTEMPTS : submits
    USERS ||--o{ USER_PROGRESS : has
    USERS ||--|| USER_GAMIFICATIONS : owns
    USERS ||--o{ USER_ACHIEVEMENTS : unlocks

    CONCEPTS ||--o{ QUESTIONS : contains
    CONCEPTS ||--o{ QUIZ_ATTEMPTS : tested_in
    CONCEPTS ||--o{ USER_PROGRESS : tracked_by

    ACHIEVEMENTS ||--o{ USER_ACHIEVEMENTS : assigned_to

    USERS {
        ObjectId _id
        string name
        string email
        string password
        string role
        object preferences
        date createdAt
        date updatedAt
    }

    CONCEPTS {
        ObjectId _id
        string slug
        string name
        string description
        date createdAt
        date updatedAt
    }

    QUESTIONS {
        ObjectId _id
        ObjectId concept
        string difficulty
        string questionText
        array options
        string correctAnswer
        string explanation
        ObjectId createdBy
        date createdAt
        date updatedAt
    }

    QUIZ_ATTEMPTS {
        ObjectId _id
        ObjectId user
        ObjectId concept
        array answers
        number score
        number correctCount
        number totalQuestions
        number timeSpent
        number xpEarned
        date createdAt
        date updatedAt
    }

    USER_PROGRESS {
        ObjectId _id
        ObjectId user
        ObjectId concept
        number masteryScore
        number totalAttempts
        number correctAttempts
        number totalQuestionsAnswered
        date lastPracticedAt
        date createdAt
        date updatedAt
    }

    USER_GAMIFICATIONS {
        ObjectId _id
        ObjectId user
        number totalXP
        number level
        number currentStreak
        number bestStreak
        date lastActiveDate
        date createdAt
        date updatedAt
    }

    ACHIEVEMENTS {
        ObjectId _id
        string code
        string title
        string description
        string icon
        string conditionType
        number conditionValue
        number xpReward
        date createdAt
        date updatedAt
    }

    USER_ACHIEVEMENTS {
        ObjectId _id
        ObjectId user
        ObjectId achievement
        date unlockedAt
        date createdAt
        date updatedAt
    }
```

---

# 24. Database Indexes

Recommended indexes:

```txt
users.email unique
concepts.slug unique
questions.concept
questions.difficulty
questions.questionText text
questions.createdBy
quiz_attempts.user
quiz_attempts.concept
quiz_attempts.createdAt
quiz_attempts user + concept
user_progress user + concept unique
user_progress.masteryScore
user_gamifications.user unique
user_gamifications.totalXP
achievements.code unique
user_achievements user + achievement unique
```

---

# 25. Recommended Frontend Integration Flow

---

## 25.1 Login Flow

1. User login lewat:

```txt
POST /api/auth/login
```

2. Simpan response token ke localStorage:

```txt
localStorage.setItem("token", token)
localStorage.setItem("user", JSON.stringify(user))
```

3. Redirect berdasarkan role:

```txt
student => /dashboard
teacher => /teacher-dashboard
```

---

## 25.2 Protected Route Flow

Frontend perlu cek:

```txt
Jika token tidak ada:
redirect ke /login

Jika token ada:
validasi dengan GET /api/auth/me
```

---

## 25.3 Student Dashboard Flow

Frontend cukup hit satu endpoint:

```txt
GET /api/dashboard/student
```

Endpoint ini sudah mengembalikan:

```txt
user
stats
gamification
aiInsight
skillProgress
recentActivity
recommendedPractice
```

---

## 25.4 Quiz Flow

Flow frontend quiz:

```txt
GET /api/quizzes
GET /api/quizzes/start?conceptId=<id>
POST /api/progress/submit
GET /api/dashboard/student
```

---

## 25.5 Teacher Flow

Flow frontend teacher:

```txt
GET /api/teacher/dashboard
GET /api/teacher/students-progress
GET /api/teacher/concept-performance
GET /api/questions
POST /api/questions
PUT /api/questions/:id
DELETE /api/questions/:id
```

---

# 26. Manual Testing Checklist

Gunakan checklist ini di Postman / Thunder Client.

---

## 26.1 Auth Test

```txt
[ ] Register student
[ ] Register teacher
[ ] Login student
[ ] Login teacher
[ ] Get auth/me with token
[ ] Get auth/me without token should fail
```

---

## 26.2 Concept Test

```txt
[ ] Teacher create concept
[ ] Student cannot create concept
[ ] Student get concepts
[ ] Teacher get concepts
[ ] Get concept by id
```

---

## 26.3 Question Test

```txt
[ ] Teacher create question
[ ] Teacher update question
[ ] Teacher delete question
[ ] Student cannot create question
[ ] Student get questions
[ ] Filter questions by conceptId
[ ] Filter questions by difficulty
[ ] Search questions by keyword
```

---

## 26.4 Quiz Test

```txt
[ ] Get quiz library
[ ] Start quiz by conceptId
[ ] Start quiz with difficulty
[ ] Start quiz with limit
[ ] Ensure correctAnswer is not returned in start quiz
```

---

## 26.5 Progress Test

```txt
[ ] Submit quiz answer
[ ] Score calculated correctly
[ ] XP calculated correctly
[ ] Progress updated
[ ] Mastery updated
[ ] Gamification updated
[ ] Achievement unlocked if condition met
```

---

## 26.6 Dashboard Test

```txt
[ ] Student dashboard returns stats
[ ] Student dashboard returns recent activity
[ ] Student dashboard returns recommended practice
[ ] Empty state works for new student
```

---

## 26.7 Teacher Test

```txt
[ ] Teacher dashboard works
[ ] Students progress table works
[ ] Concept performance works
[ ] Student cannot access teacher endpoint
```

---

# 27. Example Complete Testing Flow

---

## Step 1 — Login Student

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

Copy token dari response.

---

## Step 2 — Get Quiz Library

```http
GET /api/quizzes
Authorization: Bearer <student_token>
```

Copy `conceptId`.

---

## Step 3 — Start Quiz

```http
GET /api/quizzes/start?conceptId=<conceptId>&limit=2
Authorization: Bearer <student_token>
```

Copy `questionId`.

---

## Step 4 — Submit Quiz

```http
POST /api/progress/submit
Authorization: Bearer <student_token>
Content-Type: application/json
```

Request body:

```json
{
  "conceptId": "<conceptId>",
  "timeSpent": 180,
  "answers": [
    {
      "questionId": "<questionId>",
      "userAnswer": "B"
    }
  ]
}
```

---

## Step 5 — Check Dashboard

```http
GET /api/dashboard/student
Authorization: Bearer <student_token>
```

---

## Step 6 — Login Teacher

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "teacher@example.com",
  "password": "password123"
}
```

Copy teacher token.

---

## Step 7 — Check Teacher Dashboard

```http
GET /api/teacher/dashboard
Authorization: Bearer <teacher_token>
```

---

# 28. API Summary Table

| Module | Method | Endpoint | Role |
|---|---:|---|---|
| Health | GET | `/` | public |
| Health | GET | `/health` | public |
| Auth | POST | `/api/auth/register` | public |
| Auth | POST | `/api/auth/login` | public |
| Auth | GET | `/api/auth/me` | student, teacher |
| Profile | GET | `/api/profile` | student, teacher |
| Profile | PUT | `/api/profile` | student, teacher |
| Profile | PUT | `/api/profile/preferences` | student, teacher |
| Profile | PUT | `/api/profile/password` | student, teacher |
| Concept | GET | `/api/concepts` | student, teacher |
| Concept | GET | `/api/concepts/:id` | student, teacher |
| Concept | POST | `/api/concepts` | teacher |
| Question | GET | `/api/questions` | student, teacher |
| Question | GET | `/api/questions/:id` | student, teacher |
| Question | POST | `/api/questions` | teacher |
| Question | PUT | `/api/questions/:id` | teacher |
| Question | DELETE | `/api/questions/:id` | teacher |
| Quiz | GET | `/api/quizzes` | student, teacher |
| Quiz | GET | `/api/quizzes/start` | student, teacher |
| Quiz | GET | `/api/quizzes/recommendation` | student |
| Progress | POST | `/api/progress/submit` | student |
| Progress | GET | `/api/progress/stats` | student |
| Progress | GET | `/api/progress/concept-analysis` | student |
| Gamification | GET | `/api/gamification/me` | student |
| Gamification | GET | `/api/gamification/achievements` | student |
| Dashboard | GET | `/api/dashboard/student` | student |
| Teacher | GET | `/api/teacher/dashboard` | teacher |
| Teacher | GET | `/api/teacher/students-progress` | teacher |
| Teacher | GET | `/api/teacher/concept-performance` | teacher |

---

# 29. Folder Structure

Recommended backend folder structure:

```txt
edupredict-backend/
  src/
    config/
      db.js
    controllers/
      auth.controller.js
      concept.controller.js
      dashboard.controller.js
      gamification.controller.js
      profile.controller.js
      progress.controller.js
      question.controller.js
      quiz.controller.js
      teacher.controller.js
    middleware/
      auth.middleware.js
      error.middleware.js
      role.middleware.js
    models/
      achievement.model.js
      concept.model.js
      question.model.js
      quizAttempt.model.js
      user.model.js
      userAchievement.model.js
      userGamification.model.js
      userProgress.model.js
    routes/
      auth.routes.js
      concept.routes.js
      dashboard.routes.js
      gamification.routes.js
      profile.routes.js
      progress.routes.js
      question.routes.js
      quiz.routes.js
      teacher.routes.js
    seeders/
      achievement.seeder.js
      main.seeder.js
    services/
      gamification.service.js
      progress.service.js
    utils/
      generateToken.js
    app.js
    server.js
  .env
  package.json
  README.md
```

---

# 30. Final Backend Status

Backend MVP sudah mencakup:

```txt
Authentication
Authorization
Role-based access control
Profile management
Preferences management
Concept API
Question CRUD
Quiz library
Quiz start
Quiz recommendation
Quiz submit
Progress tracking
Mastery calculation
XP calculation
Level calculation
Streak calculation
Achievement system
Student dashboard
Teacher dashboard
MongoDB Atlas integration
Seeder data
Error middleware
Health check endpoint
```

---

# 31. Recommended Next Development

Setelah backend selesai, tahap berikutnya:

```txt
1. Test semua endpoint dengan Postman / Thunder Client
2. Buat Postman Collection
3. Integrasi frontend React
4. Buat axios instance
5. Buat auth context
6. Buat protected routes
7. Connect login/register
8. Connect student dashboard
9. Connect quiz flow
10. Connect teacher dashboard
```

---

# 32. Notes for Frontend Developer

Hal paling penting untuk frontend:

```txt
1. Simpan token setelah login
2. Kirim Authorization Bearer token di semua private endpoint
3. Jangan rely pada frontend untuk validasi role
4. correctAnswer tidak tersedia saat start quiz
5. Submit quiz hanya mengirim questionId dan userAnswer
6. Backend yang menghitung score, XP, mastery, streak, dan achievement
7. Dashboard student cukup menggunakan satu endpoint: GET /api/dashboard/student
```

---

# 33. License

This project is for learning, portfolio, and development purposes.

---

# 34. Author

EduPredict Math Backend  
Created for EduPredict Math learning platform project.
