# Password Security Implementation

## Overview

This application implements industry-standard password security practices to protect user credentials.

## Security Measures

### 1. Password Hashing with bcrypt

**Location**: `server/models/User.js`

Passwords are automatically hashed before being saved to the database using bcrypt with a salt factor of 10.

```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

**How it works:**
- When a user registers or changes their password, the plain text password is hashed
- A unique salt is generated for each password
- The hashed password is stored in the database, never the plain text
- Even if the database is compromised, passwords cannot be easily recovered

### 2. Secure Password Verification

**Location**: `server/models/User.js`

Passwords are verified using bcrypt's secure comparison function:

```javascript
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

**How it works:**
- When a user logs in, their entered password is compared against the stored hash
- bcrypt handles the comparison securely, preventing timing attacks
- The plain text password is never stored or logged

### 3. JWT Token Authentication

**Location**: `server/routes/auth.js`

After successful authentication, a JWT token is issued instead of sending credentials:

```javascript
const token = jwt.sign(
  { userId: user._id, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

**Security benefits:**
- No password is sent after initial login
- Tokens expire after 7 days
- Tokens are signed with a secret key
- User ID and username are embedded (not sensitive data)

### 4. Password Exclusion from Responses

**Location**: `server/routes/auth.js`, `server/middleware/auth.js`

Passwords are explicitly excluded from all API responses:

```javascript
const user = await User.findById(decoded.userId).select('-password');
```

**Protection:**
- Even if there's a bug, passwords won't accidentally be sent to the client
- User objects returned to the frontend never contain password fields

### 5. Protected Routes

**Location**: `server/middleware/auth.js`

Protected routes require a valid JWT token:

```javascript
export const authenticateToken = async (req, res, next) => {
  // Verifies JWT token before allowing access
  // Returns 401 if token is invalid or expired
}
```

**Usage:**
- Applied to routes that require authentication (POST/DELETE announcements)
- Validates token signature and expiration
- Prevents unauthorized access

### 6. Input Validation

**Location**: `server/routes/auth.js`

Basic validation ensures password requirements:

```javascript
if (password.length < 6) {
  return res.status(400).json({ message: 'Password must be at least 6 characters long' });
}
```

## Security Best Practices Implemented

✅ **Never store plain text passwords**
✅ **Use bcrypt for password hashing** (industry standard)
✅ **Use JWT tokens for authentication** (stateless, secure)
✅ **Exclude passwords from all responses**
✅ **Implement token expiration**
✅ **Protect sensitive routes with middleware**
✅ **Validate input on the server side**
✅ **Use environment variables for secrets** (JWT_SECRET)

## What Happens During Registration

1. User submits username and password
2. Server validates input (length, format)
3. Password is automatically hashed by Mongoose pre-save hook
4. Hashed password is stored in database
5. JWT token is generated and returned
6. Plain text password is discarded

## What Happens During Login

1. User submits username and password
2. Server finds user by username
3. Server compares submitted password with stored hash using bcrypt
4. If match: JWT token is generated and returned
5. If no match: Generic error message (prevents user enumeration)
6. Plain text password is never stored or logged

## Database Storage

In MongoDB, passwords are stored as hashed strings like:
```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

This is a bcrypt hash that includes:
- Algorithm identifier (`$2a$`)
- Cost factor (`10`)
- Salt (22 characters)
- Hash (31 characters)

## Additional Security Recommendations

For production, consider:

1. **Rate limiting** - Prevent brute force attacks
2. **Password complexity requirements** - Enforce strong passwords
3. **HTTPS only** - Encrypt data in transit
4. **Refresh tokens** - For better token management
5. **Account lockout** - After multiple failed login attempts
6. **Password reset flow** - Secure password recovery
7. **Audit logging** - Track authentication events

## Environment Variables

Ensure these are set securely:

```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
MONGODB_URI=mongodb://localhost:27017/announcement
```

**Important**: Never commit `.env` files to version control!

