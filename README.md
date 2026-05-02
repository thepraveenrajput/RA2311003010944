# 📢 Notification System (Frontend)

## 🔗 Repository

https://github.com/thepraveenrajput/RA2311003010944

---

## 📌 Overview

This project is a frontend implementation of a **Notification System** that displays notifications based on **priority and recency**.

The application is built using **React** and demonstrates:

* Efficient data handling using Heap
* Clean and modern UI
* Logging middleware integration

---

## 🚀 Features

### 🔹 Priority Notifications

* Displays **Top 10 notifications**
* Uses **Heap-based optimization**
* Priority order:

  * Placement > Result > Event
* Sorted based on:

  * Priority weight
  * Latest timestamp

---

### 🔹 All Notifications

* Displays all notifications
* Supports:

  * Pagination
  * Filtering (Event / Result / Placement)
  * Viewed / Unviewed state

---

### 🔹 Logging Middleware

* Logs:

  * API calls
  * UI interactions
  * Errors
* Integrated using provided logging API

---

### 🔹 UI/UX

* Built using **Material UI**
* Smooth animations using **Framer Motion**
* Features:

  * Card-based layout
  * Priority indicator
  * Clean and responsive design

---

## 🛠️ Tech Stack

* React.js
* Material UI
* Framer Motion
* JavaScript (ES6+)

---

## 📂 Project Structure

```
src/
├── pages/
│   ├── AllNotifications.js
│   └── PriorityNotifications.js
├── utils/
│   └── priority.js
├── logging_middleware/
│   └── logger.js
├── App.js
```

---

## ⚙️ Setup Instructions

### 1. Clone repository

```
git clone https://github.com/thepraveenrajput/RA2311003010944.git
cd notification_app_fe
```

### 2. Install dependencies

```
npm install
```

### 3. Add environment variable

Create a `.env` file:

```
REACT_APP_TOKEN=your_access_token_here
```

### 4. Run the application

```
npm start
```

---

## 📊 API Testing (Postman)

The APIs were tested using Postman.

### 🔹 Authentication

* Endpoint: `/auth`
* Method: POST
* Returns: Access Token

### 🔹 Fetch Notifications

* Endpoint: `/notifications`
* Method: GET
* Header: Authorization (Bearer Token)

### 🔹 Logging

* Endpoint: `/logs`
* Method: POST
* Used to send logs from frontend

---

## ⚠️ Important Note

Due to **CORS restrictions**, API calls may fail in the browser.

* API functionality has been tested using Postman
* The UI uses fallback data when API calls fail

---

## 📊 Algorithm Used

### Heap-Based Optimization

* Maintains top 10 notifications efficiently
* Time Complexity: **O(n log k)**
* Space Complexity: **O(k)**

---

## 👨‍💻 Author

Praveen Kumar Singh
Roll No: RA2311003010944
