# UI Screenshots Guide - Attendance Tracker

## 📸 User Interface Documentation

This document describes the visual appearance and functionality of each screen in the Attendance Management System.

---

## 1. Login Page (`login.html`)

### Visual Description
**Background:** Animated gradient transitioning between purple (#667eea), violet (#764ba2), and pink (#f093fb)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                   [Gradient Background]                  │
│                                                          │
│               ┌────────────────────┐                     │
│               │    [Cap Icon]      │                     │
│               │   Graduation Cap   │                     │
│               └────────────────────┘                     │
│                                                          │
│              Attendance Tracker                          │
│           Please sign in to continue                     │
│                                                          │
│     ┌───────────────────────────────────────┐           │
│     │  [User Icon] Username                  │           │
│     │  ┌──────────────────────────────────┐ │           │
│     │  │ Enter your username              │ │           │
│     │  └──────────────────────────────────┘ │           │
│     │                                        │           │
│     │  [Lock Icon] Password                 │           │
│     │  ┌──────────────────────────────────┐ │           │
│     │  │ ••••••••••••••••      [Eye Icon]│ │           │
│     │  └──────────────────────────────────┘ │           │
│     │                                        │           │
│     │  ┌──────────────────────────────────┐ │           │
│     │  │     [Sign In Icon] Sign In       │ │           │
│     │  └──────────────────────────────────┘ │           │
│     └───────────────────────────────────────┘           │
│                                                          │
│              [Shield] Secure Login System                │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- ✨ Glassmorphism card with backdrop blur
- 🎨 Smooth gradient animation
- 👁️ Password visibility toggle
- ⚡ Loading states on button
- 🎭 Fade-in animation on load
- 📱 Fully responsive

**Color Scheme:**
- Card: White with 95% opacity
- Inputs: Gray border (focus: purple)
- Button: Purple to indigo gradient
- Icons: Font Awesome

---

## 2. Admin Dashboard (`admin.html`)

### A. Header Section
```
┌─────────────────────────────────────────────────────────┐
│  [Graduation Cap] Attendance Tracker - Admin Panel      │
│                                                          │
│  Welcome, Administrator                                  │
│  [Calendar Icon] October 29, 2025 | [Clock Icon] 3:45 PM│
│                                        [Logout Button]   │
└─────────────────────────────────────────────────────────┘
```

**Colors:** Red to pink gradient background

### B. Statistics Cards (4-Column Grid)
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ [Users Icon] │ │[Classes Icon]│ │[Students Icon│ │[Activity Icon│
│              │ │              │ │              │ │              │
│    Total     │ │    Total     │ │    Total     │ │   Recent     │
│    Users     │ │   Classes    │ │  Students    │ │  Activity    │
│              │ │              │ │              │ │              │
│      12      │ │      8       │ │      150     │ │      45      │
│    accounts  │ │   classes    │ │   enrolled   │ │   actions    │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

**Colors:**
- Blue gradient (Users)
- Green gradient (Classes)
- Purple gradient (Students)
- Red gradient (Activity)

### C. Navigation Tabs
```
┌─────────────────────────────────────────────────────────┐
│ [Activity Logs] [Users] [System Info] [Classes] [...]  │
└─────────────────────────────────────────────────────────┘
```

**States:**
- Active: Purple background
- Inactive: Gray background
- Hover: Darker gray

### D. Activity Logs Table
```
┌─────────────────────────────────────────────────────────┐
│  [Clear Logs Button]                                     │
│                                                          │
│  Time              │ Type          │ User     │ Details  │
│ ────────────────────────────────────────────────────────│
│ Oct 29, 3:45 PM   │ Login Success │ admin    │ Login... │
│ Oct 29, 3:30 PM   │ Create Class  │ teacher  │ Added... │
│ Oct 29, 3:15 PM   │ Mark Attend.  │ teacher  │ Class... │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Striped rows (alternating background)
- Color-coded badges (green success, red failed, blue info)
- Hover effects
- Clear logs button (red, confirmation required)

### E. Users Management Table
```
┌─────────────────────────────────────────────────────────┐
│  [Add User Button]                                       │
│                                                          │
│  ID │ Username │ Password │ Name          │ Role  │ [✎][×]│
│ ──────────────────────────────────────────────────────────│
│  1  │ admin    │ admin123 │ Administrator │ ADMIN │ [✎][×]│
│  2  │ teacher  │ teacher123│ Teacher      │TEACHER│ [✎][×]│
│  3  │ student1 │ student123│ John Doe     │STUDENT│ [✎][×]│
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Inline editing (click to edit)
- Color-coded role badges
- Delete confirmation
- Add new user modal

### F. Classes Table
```
┌─────────────────────────────────────────────────────────┐
│  [Add Class Button]                                      │
│                                                          │
│  ID │ Class Name     │ Students │ Created    │ [✎][×]   │
│ ──────────────────────────────────────────────────────────│
│  1  │ Class 10-A     │    25    │ Oct 15     │ [✎][×]   │
│  2  │ Class 10-B     │    28    │ Oct 16     │ [✎][×]   │
└─────────────────────────────────────────────────────────┘
```

### G. Students Table
```
┌─────────────────────────────────────────────────────────┐
│  [Add Student Button]                                    │
│                                                          │
│  ID │ Name       │ Class    │ Roll No │ Created │ [✎][×]│
│ ──────────────────────────────────────────────────────────│
│  1  │ John Doe   │Class 10-A│   101   │ Oct 20  │ [✎][×]│
│  2  │ Jane Smith │Class 10-A│   102   │ Oct 20  │ [✎][×]│
└─────────────────────────────────────────────────────────┘
```

### H. Attendance Management
```
┌─────────────────────────────────────────────────────────┐
│  [Add Attendance Button]                                 │
│                                                          │
│  Filters:                                                │
│  [Class Dropdown ▼] [Student Dropdown ▼] [Status ▼]    │
│                                                          │
│  Date    │ Student  │ Class   │ Status  │ Marked By│ [✎][×]│
│ ──────────────────────────────────────────────────────────│
│ Oct 29   │ John Doe │ 10-A    │ PRESENT │ teacher  │ [✎][×]│
│ Oct 29   │ Jane S.  │ 10-A    │ LATE    │ teacher  │ [✎][×]│
│ Oct 29   │ Bob J.   │ 10-A    │ ABSENT  │ teacher  │ [✎][×]│
└─────────────────────────────────────────────────────────┘
```

**Status Colors:**
- PRESENT: Green badge
- LATE: Yellow badge
- ABSENT: Red badge

---

## 3. Teacher Dashboard (`main.html`)

### A. Header & Status Bar
```
┌─────────────────────────────────────────────────────────┐
│  [Connection Status: ✓ Connected to Backend]           │
│  Teacher: John Smith | Date: Oct 29, 2025 | Time: 3:45 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [Attendance Tracker] [Dashboard] [Statistics] [Logout] │
└─────────────────────────────────────────────────────────┘
```

### B. Statistics Section
```
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│ [Calendar] │ │ [Users]    │ │ [Clock]    │ │[Percentage]│
│  Today's   │ │  Total     │ │  Last      │ │  Overall   │
│ Attendance │ │ Students   │ │  Updated   │ │Attendance  │
│     85%    │ │    150     │ │   3:45 PM  │ │    92%     │
└────────────┘ └────────────┘ └────────────┘ └────────────┘
```

### C. Class Management Card
```
┌─────────────────────────────────────────────────────────┐
│  [Class Icon] Class Management                          │
│                                                          │
│  Create New Class                                        │
│  ┌─────────────────────────────────────┐                │
│  │ Enter class name...                 │ [Add Class]    │
│  └─────────────────────────────────────┘                │
│                                                          │
│  Existing Classes:                                       │
│  • Class 10-A (25 students)                             │
│  • Class 10-B (28 students)                             │
│  • Class 11-A (22 students)                             │
└─────────────────────────────────────────────────────────┘
```

### D. Student Management Card
```
┌─────────────────────────────────────────────────────────┐
│  [Students Icon] Student Management                     │
│                                                          │
│  Add New Student                                         │
│  ┌─────────────────────────┐                            │
│  │ Select Class      [▼]   │                            │
│  └─────────────────────────┘                            │
│  ┌─────────────────────────┐                            │
│  │ Student Name            │ [Add Student]              │
│  └─────────────────────────┘                            │
│                                                          │
│  Students in Selected Class:                             │
│  1. John Doe                                             │
│  2. Jane Smith                                           │
│  3. Bob Johnson                                          │
└─────────────────────────────────────────────────────────┘
```

### E. Attendance Marking Section
```
┌─────────────────────────────────────────────────────────┐
│  [Clipboard Icon] Mark Attendance                       │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │ Select Class │  │ Select Date  │                    │
│  │   [▼]        │  │ [📅 Oct 29]  │                    │
│  └──────────────┘  └──────────────┘                    │
│                                                          │
│  [Mark All Present] [Mark All Absent]                   │
│                                                          │
│  Student List:                                           │
│  ┌────────────────────────────────────────────┐         │
│  │ 1. John Doe        [●Present][○Late][○Absent]│        │
│  │ 2. Jane Smith      [○Present][●Late][○Absent]│        │
│  │ 3. Bob Johnson     [○Present][○Late][●Absent]│        │
│  └────────────────────────────────────────────┘         │
│                                                          │
│              [Submit Attendance]                         │
└─────────────────────────────────────────────────────────┘
```

**Radio Buttons:**
- Present: Green when selected
- Late: Yellow when selected
- Absent: Red when selected

### F. Statistics Tab
```
┌─────────────────────────────────────────────────────────┐
│  Overall Statistics                                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Total Classes: 8                                 │  │
│  │  Total Students: 150                              │  │
│  │  Attendance Rate: 92%                             │  │
│  │  Today's Attendance: 85%                          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │  Class-wise      │  │  Student-wise    │            │
│  │  Breakdown       │  │  Performance     │            │
│  │                  │  │                  │            │
│  │ [Bar Chart]      │  │ [Line Chart]     │            │
│  │                  │  │                  │            │
│  └──────────────────┘  └──────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Student Portal (`student-view.html`)

### A. Header
```
┌─────────────────────────────────────────────────────────┐
│  [Graduation Cap] My Attendance Portal                  │
│  Welcome, John Doe                           [Logout]   │
└─────────────────────────────────────────────────────────┘
```

### B. Statistics Cards
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ [Calendar]  │ │ [Check]     │ │ [Clock]     │ │ [Cross]     │
│   Total     │ │  Present    │ │    Late     │ │   Absent    │
│  Classes    │ │   Days      │ │    Days     │ │    Days     │
│     45      │ │     38      │ │      3      │ │      4      │
│             │ │   84.4%     │ │    6.7%     │ │    8.9%     │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

**Colors:**
- Total: Blue gradient
- Present: Green gradient
- Late: Yellow gradient
- Absent: Red gradient

### C. Charts Section
```
┌─────────────────────────┐ ┌─────────────────────────┐
│  Status Distribution    │ │  Attendance Timeline    │
│                         │ │                         │
│    [Pie Chart]          │ │    [Line Chart]         │
│   • Present: 84.4%      │ │   Last 30 Days          │
│   • Late: 6.7%          │ │                         │
│   • Absent: 8.9%        │ │   [Trend Line]          │
│                         │ │                         │
└─────────────────────────┘ └─────────────────────────┘
```

**Pie Chart Colors:**
- Present: Green (#10b981)
- Late: Yellow (#f59e0b)
- Absent: Red (#ef4444)

### D. Attendance Records Table
```
┌─────────────────────────────────────────────────────────┐
│  [Table Icon] Attendance Records                        │
│                                                          │
│  Date       │ Class      │ Status   │ Marked By         │
│ ──────────────────────────────────────────────────────────│
│ Oct 29, 2025│ Class 10-A │ PRESENT  │ Teacher Smith     │
│ Oct 28, 2025│ Class 10-A │ PRESENT  │ Teacher Smith     │
│ Oct 27, 2025│ Class 10-A │ LATE     │ Teacher Smith     │
│ Oct 26, 2025│ Class 10-A │ ABSENT   │ Teacher Smith     │
└─────────────────────────────────────────────────────────┘
```

**Status Badges:**
- PRESENT: Green background, white text
- LATE: Yellow background, dark text
- ABSENT: Red background, white text

---

## 5. Toast Notifications

### Success Toast
```
┌─────────────────────────────────────┐
│ ✓ Attendance submitted successfully │
└─────────────────────────────────────┘
```
**Color:** Green background, white text

### Error Toast
```
┌─────────────────────────────────────┐
│ ✗ Failed to save data. Try again.   │
└─────────────────────────────────────┘
```
**Color:** Red background, white text

### Info Toast
```
┌─────────────────────────────────────┐
│ ℹ Loading data...                   │
└─────────────────────────────────────┘
```
**Color:** Blue background, white text

---

## 6. Modals & Dialogs

### Confirmation Dialog
```
┌─────────────────────────────────────┐
│  Confirm Delete                     │
│  ───────────────────────────────    │
│                                     │
│  Are you sure you want to delete    │
│  this record? This action cannot    │
│  be undone.                         │
│                                     │
│  [Cancel]           [Delete]        │
└─────────────────────────────────────┘
```

### Add User Modal
```
┌─────────────────────────────────────┐
│  Add New User                  [×]  │
│  ───────────────────────────────    │
│                                     │
│  Username:                          │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  Password:                          │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  Name:                              │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  Role:                              │
│  [Admin ▼]                          │
│                                     │
│  [Cancel]           [Add User]      │
└─────────────────────────────────────┘
```

---

## 7. Responsive Design

### Mobile View (< 768px)
- Single column layout
- Stacked cards
- Hamburger menu
- Touch-friendly buttons (minimum 44px)
- Simplified tables (swipe to see more)

### Tablet View (768px - 1024px)
- Two-column grid for cards
- Responsive tables
- Collapsible sidebar

### Desktop View (> 1024px)
- Four-column grid for cards
- Full tables visible
- Side-by-side content areas

---

## 8. Animation Effects

### Page Load
- Fade in: 0.5s
- Slide in from top: Navigation
- Slide in from bottom: Cards

### Hover Effects
- Cards: Lift up 2px, shadow increases
- Buttons: Slight scale (1.05x)
- Table rows: Background color change

### Transitions
- All color changes: 0.3s ease
- Transform animations: 0.2s ease
- Opacity changes: 0.3s ease

---

## 9. Typography

### Font Family
- Primary: System UI fonts
- Fallback: Sans-serif

### Font Sizes
- Headings: 
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)
- Tiny: 0.75rem (12px)

### Font Weights
- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

---

## 10. Iconography

### Icons Used
- **Login:** fa-graduation-cap, fa-user, fa-lock, fa-sign-in-alt
- **Navigation:** fa-home, fa-chart-bar, fa-sign-out-alt
- **Admin:** fa-users, fa-book, fa-user-graduate, fa-clipboard-check
- **Actions:** fa-plus, fa-edit, fa-trash, fa-save
- **Status:** fa-check-circle, fa-times-circle, fa-exclamation-circle
- **Data:** fa-calendar, fa-clock, fa-percentage

### Icon Sizes
- Small: 1rem (16px)
- Medium: 1.5rem (24px)
- Large: 2rem (32px)
- XLarge: 3rem (48px)

---

**This UI documentation provides a complete visual reference for the Attendance Tracker system without requiring actual screenshots. All interfaces are professionally designed with modern UI/UX principles.**
