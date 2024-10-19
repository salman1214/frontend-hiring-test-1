# **Project Name**

## Overview

This is a React application built using **Vite.js** with features such as authentication, real-time updates via **Pusher**, and token-based authorization (JWT). The app uses **Axios** for making API requests, **React Router** for navigation, and **Tailwind CSS** for styling.

### Tech Stack

- **Frontend**: React, Vite.js, Tailwind CSS
- **State Management**: React Context API
- **Real-time**: Pusher for real-time event subscriptions
- **Authentication**: JWT-based token management with auto-refresh mechanism
- **API Client**: Axios for HTTP requests

---

## Getting Started

### Prerequisites

- **Node.js** (>= 14.x)
- **npm** or **yarn**

### Installation

1. **Install the dependencies**:
   ```bash
   yarn install
   ```

2. **Create a `.env` file** in the root directory with the following environment variables:

   ```bash
   VITE_API_URL=https://frontend-test-api.aircall.dev
   VITE_PUSHER_APP_KEY=d44e3d910d38a928e0be
   VITE_PUSHER_CLUSTER=eu
   ```

### Running the App

```bash
# Start the development server
yarn run dev

# Open the app in your browser
http://localhost:5173
```

### Building for Production

```bash
# Build the app for production
yarn run build

# Preview the production build
yarn run preview
```

### Linting & Formatting

If you have **ESLint** and **Prettier** set up, you can run the following commands to lint and format your code:

```bash
# Lint the code
yarn run lint

# Fix linting issues
yarn run lint:fix
```

---

## Project Structure

```bash
├── public/                       # Static assets like images and icons
├── src/
│   ├── assets/                   # Fonts, images, other static assets
│   ├── components/               # Reusable UI components (e.g., Navbar, Button)
│   ├── context/                  # React context providers (e.g., AuthContext)
│   ├── hooks/                    # Custom React hooks (e.g., useAuth)
│   ├── pages/                    # Page-level components (e.g., Home, Login)
│   ├── services/                 # API services (e.g., Auth API calls)
│   ├── utils/                    # Utility functions (e.g., token management)
│   ├── App.jsx                   # Main App component
│   ├── index.jsx                 # Entry point of the React app
│   └── main.jsx                  # Vite entry point
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.js                # Vite configuration
├── package.json                  # Project dependencies and scripts
└── .env                          # Environment variables
```

---

## Environment Variables

Make sure to set up your `.env` file with the following variables:

```bash
# Backend API URL
VITE_API_URL=https://frontend-test-api.aircall.dev

# Pusher API configuration for real-time events
VITE_PUSHER_APP_KEY=d44e3d910d38a928e0be
VITE_PUSHER_CLUSTER=eu
```

---

## Authentication

The app uses JWT (JSON Web Token) for authentication. After successful login, the token is stored in `localStorage`, and the following endpoints are used:

- **Login**: `POST /auth/login`
  - Request body:
    ```json
    {
      "username": "your-username",
      "password": "your-password"
    }
    ```
  - Response:
    ```json
    {
      "access_token": "your-access-token",
      "refresh_token": "your-refresh-token",
      "user": { ...userDetails }
    }
    ```

- **Refresh Token**: `POST /auth/refresh-token`
  - Automatically handled by the app when the token expires. The new `access_token` is retrieved based on the existing `refresh_token`.

---

## Real-time Events (Pusher)

To subscribe to real-time events, the app uses Pusher. The following event channels are set up:

- **Channel**: `private-aircall`
- **Event**: `update-call` — Triggered when a call is updated (e.g., a call is archived or a note is added).

The app listens for this event to reflect real-time changes in the UI.

---

## API Endpoints

### **Login**
- **Method**: `POST /auth/login`
- **Description**: Authenticates the user and returns an access token.
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "string",
    "refresh_token": "string",
    "user": { ... }
  }
  ```

### **Archive/Unarchive a Call**
- **Method**: `PUT /calls/:id/archive`
- **Description**: Archives or unarchives a call based on its current state.
- **Request Body**:
  ```json
  {
    "archive": true | false
  }
  ```
- **Response**:
  ```json
  {
    "id": "call-id",
    "is_archived": true | false
  }
  ```

---

## Custom Hooks

### `useAuth`

This custom hook manages the authentication state (login, logout, token handling) and provides an easy way to access authentication data.

Example usage:

```js
import { useAuth } from './context/AuthContext';

const MyComponent = () => {
  const { login, logout, accessToken } = useAuth();

  // Use login/logout functions in your component
};
```

---