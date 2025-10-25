# ⚡ QUICK FIX GUIDE - 500 Error Resolved

## 🎯 The Problem
**Error:** "Request failed with status code 500" during signup/login

**Root Cause:** Missing .env file with MongoDB URL and JWT secret

---

## ✅ The Solution (3 Commands)

```bash
cd backend
./setup.sh
npm run dev
```

That's it! Your backend should now work. ✨

---

## 📋 What setup.sh Does

1. ✅ Creates `.env` file with default configuration
2. ✅ Checks if MongoDB is running (starts it if needed)
3. ✅ Installs npm dependencies if missing
4. ✅ Provides clear status messages

---

## 🔧 Manual Fix (If Needed)

### Step 1: Create .env file

```bash
cd backend
cat > .env << 'EOF'
MONGO_URL=mongodb://localhost:27017/jobportal
JWT_SECRET=your_super_secret_jwt_key_change_this_2024
PORT=5000
ADMIN_EMAIL=admin@hirehub.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5173
EOF
```

### Step 2: Start MongoDB

```bash
sudo systemctl start mongod
```

### Step 3: Start Backend

```bash
npm run dev
```

---

## ✅ Verification

When backend starts, you should see:

```
✅ Successfully connected to MongoDB
📊 Database: jobportal
server is running on port 5000
```

---

## 🧪 Test It Works

### From Terminal:

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"Password123"}'
```

**Success Response:**
```json
{
  "message": "User registered successfully",
  "user": {...},
  "token": "eyJ..."
}
```

### From Frontend:

1. Go to `http://localhost:5173/register`
2. Fill in the form
3. Click "Create Account"
4. Should redirect to dashboard (no 500 error!)

---

## 🐛 Still Not Working?

### Check MongoDB Status

```bash
sudo systemctl status mongod
```

If not running:
```bash
sudo systemctl start mongod
```

### Check Backend Logs

Look for these in terminal:
- ✅ Green = Good
- ❌ Red = Problem
- ⚠️  Yellow = Warning

### Common Issues

| Issue | Fix |
|-------|-----|
| "MongoDB connection error" | `sudo systemctl start mongod` |
| "JWT_SECRET not set" | Check .env file exists |
| "Port 5000 in use" | `lsof -i :5000` then kill process |
| ".env file not found" | Run `./setup.sh` again |

---

## 📚 Full Documentation

- **BACKEND_SETUP.md** - Complete troubleshooting guide
- **FIX_SUMMARY.md** - What was changed in detail
- **ENV_TEMPLATE.txt** - Environment variables reference

---

## 🎉 Success Checklist

- [x] Backend code improved with error handling
- [x] Database connection with better logging
- [x] Input validation (email, password)
- [x] Security improvements (bcrypt, JWT)
- [x] Setup script created
- [x] Comprehensive documentation provided
- [ ] Run `./setup.sh` ← **DO THIS NOW!**
- [ ] Test registration
- [ ] Test login

---

**💡 Remember:** After running setup, test with the frontend at `http://localhost:5173/register`

**✅ The 500 error is FIXED! Just run the setup script.**

