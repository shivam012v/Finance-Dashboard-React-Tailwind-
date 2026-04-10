# 💰 Finance Dashboard (React + Tailwind)

A modern, clean, and responsive **Finance Dashboard Web Application** built using **React.js** and **Tailwind CSS**.
This project focuses on delivering a minimal, professional, and user-friendly UI inspired by real-world fintech dashboards.

---

## 🚀 Features

### 📊 Dashboard

* Summary cards:

  * Total Balance
  * Income
  * Expenses
* 📈 Line chart showing balance trends over time
* 🥧 Pie chart for category-wise spending
* Uses mock/static data

---

### 💳 Transactions

* Transactions table with:

  * Date
  * Amount
  * Category
  * Type (Income / Expense)
* 🔍 Search functionality
* 🎯 Filters (Category & Type)
* ↕ Sorting (Date & Amount)
* Clean and minimal UI design

---

### 👤 Role-Based UI (Frontend Only)

* Role switcher:

  * **Admin**
  * **Viewer**
* Admin:

  * Can add/edit transactions (UI only)
* Viewer:

  * Read-only access

---

### 📈 Insights Section

* Highest spending category
* Monthly comparison (Current vs Previous)
* Displayed using simple and clean cards

---

## 🎨 UI/UX Highlights

* Modern fintech-style design
* Fully responsive (Mobile + Desktop)
* Smooth hover effects & transitions
* Clean typography and spacing
* Proper empty states handling

---

## ⚙️ Tech Stack

* React.js
* Tailwind CSS
* Context API (State Management)
* Recharts / Chart.js (for charts)

---

## 📁 Folder Structure

```
src/
│── components/
│   ├── Dashboard/
│   ├── Transactions/
│   ├── Insights/
│   ├── UI/
│
│── context/
│   └── FinanceContext.jsx
│
│── data/
│   └── mockData.js
│
│── pages/
│   ├── Dashboard.jsx
│   ├── Transactions.jsx
│
│── App.jsx
│── main.jsx
```

---

## 🧠 State Management

Global state is managed using **React Context API**:

* Transactions data
* Filters (search, category, type)
* User role (Admin / Viewer)

---

## 📦 Mock Data Example

```js
export const transactions = [
  {
    id: 1,
    date: "2026-04-01",
    amount: 5000,
    category: "Salary",
    type: "income"
  },
  {
    id: 2,
    date: "2026-04-02",
    amount: 1200,
    category: "Food",
    type: "expense"
  }
];
```

---

## 🌙 Optional Enhancements

* Dark mode toggle 🌑
* LocalStorage data persistence 💾
* Simple animations ✨

---

## ▶️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/finance-dashboard.git
```

### 2. Navigate to Project Folder

```bash
cd finance-dashboard
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

---

## 📌 Future Improvements

* Backend integration (Firebase / Node.js / FastAPI)
* Authentication system
* Real-time data updates
* Export reports (PDF/CSV)

---

## 🙌 Author

**Shivam Verma**
Frontend Developer | React Enthusiast

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
