# Backend Connection Guide

This document explains how the frontend (Login/Signup) connects to the backend.

## Connection Flow

### 1. Frontend Components
- **Login Page**: `client/component/LoginIn.tsx`
- **Sign Up Page**: `client/component/SignUp.tsx`

Both components use the `authService` to communicate with the backend.

### 2. Auth Service
- **Location**: `client/services/auth.ts`
- **Methods**:
  - `register()` - Calls `/api/signup`
  - `login()` - Calls `/api/login`

### 3. Axios Client
- **Location**: `client/lib/axios.ts`
- **Base URL**: `http://localhost:5000/api` (default)
- **Features**:
  - Automatic token injection in headers
  - Error handling and logging
  - 30-second timeout

### 4. Backend Endpoints
- **Signup**: `POST http://localhost:5000/api/signup`
- **Login**: `POST http://localhost:5000/api/login`

## How It Works

```
User fills form → Component calls authService → Axios sends request → Backend processes → Response with token → Token saved to localStorage
```

## Testing the Connection

### 1. Start the Backend
```bash
cd backend
npm run dev
```

You should see:
```
✅ Server running on port 5000
📍 API endpoints available at http://localhost:5000/api
```

### 2. Start the Frontend
```bash
cd client
npm run dev
```

### 3. Test Sign Up
1. Navigate to `http://localhost:3000/signup`
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
3. Click "Sign Up"
4. Check browser console for logs:
   - `🔗 API Base URL: http://localhost:5000/api`
   - `📤 POST /signup`
   - `✅ POST /signup 201`
   - `✅ Registration successful, token saved`

### 4. Test Login
1. Navigate to `http://localhost:3000/login`
2. Use the credentials you just created
3. Click "Sign In"
4. Check browser console for logs:
   - `📤 POST /login`
   - `✅ POST /login 200`
   - `✅ Login successful, token saved`

## Debugging

### Check Browser Console
Open browser DevTools (F12) and check the Console tab. You should see:
- API connection logs
- Request/response logs
- Error messages (if any)

### Common Issues

#### 1. "Unable to connect to backend server"
**Solution**: 
- Make sure backend is running on port 5000
- Check `http://localhost:5000/health` in browser
- Verify CORS is enabled (it should be)

#### 2. "User already exists"
**Solution**: Use a different email or delete the user from database

#### 3. "Invalid credentials"
**Solution**: Check email and password are correct

#### 4. Network Error
**Solution**: 
- Check backend is running
- Verify API URL in browser console
- Check firewall/antivirus isn't blocking localhost

### Environment Variables

If you need to change the API URL, create `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_TOKEN_KEY=token
```

## Request/Response Format

### Signup Request
```json
POST /api/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Signup Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login Request
```json
POST /api/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Token Storage

- **Location**: Browser `localStorage`
- **Key**: `token` (or value from `NEXT_PUBLIC_TOKEN_KEY`)
- **Usage**: Automatically added to all API requests via Axios interceptor

## Verification Checklist

- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3000
- [ ] Browser console shows API connection logs
- [ ] Sign up creates a new user successfully
- [ ] Login authenticates existing user
- [ ] Token is saved to localStorage
- [ ] User is redirected to home page after auth

## Next Steps

After successful login/signup:
1. Token is stored in localStorage
2. User is redirected to home page (`/`)
3. Token is automatically included in future API requests
4. Protected routes can check authentication status
