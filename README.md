# CommentHub - Social Comment System

A modern, full-stack social-style comment system built with Next.js, TypeScript, Express and MongoDB. Features nested comments, real-time interactions, email verification and Google OAuth authentication.

## Features

### Authentication & Users
- User registration with email verification
- Email login with JWT authentication
- Google OAuth integration
- Protected routes for verified users only
- User profile management

### Posts & Content
- Create, read, update and delete posts
- Rich text content support
- Optional image attachments
- Author information display
- Pagination for posts

### Comments & Replies
- Multi-level nested comment threads
- Real-time comment creation
- Edit and delete own comments
- Author and timestamp display
- Comment count per post
- Pagination for comments and replies
- Sort by recent or most liked

### Likes & Interactions
- Like/unlike comments and replies
- Toggle behavior (one like per user)
- Total like count display
- View users who liked

### Permissions & Moderation
- Only owners can edit their content
- Admin role for moderation
- Delete inappropriate content
- Rate limiting (5 comments per minute)

### UI/UX
- Modern, clean design with Tailwind CSS
- Smooth animations with Framer Motion
- Responsive mobile and desktop layouts
- Interactive hover effects
- Loading skeletons
- Toast notifications
- Intuitive nested thread view

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Brevo (Sendinblue)** - Email delivery service
- **Passport.js** - Google OAuth
- **Express Rate Limit** - API rate limiting
- **Express Validator** - Input validation

### Frontend
- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **date-fns** - Date formatting
- **Lucide React** - Icons

## Project Structure

```
Comment-System/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js        # MongoDB connection
│   │   │   ├── email.js           # Email configuration
│   │   │   └── passport.js        # OAuth configuration
│   │   ├── models/
│   │   │   ├── User.js           # User schema
│   │   │   ├── Post.js           # Post schema
│   │   │   └── Comment.js        # Comment schema
│   │   ├── controllers/
│   │   │   ├── authController.js  # Auth logic
│   │   │   ├── postController.js  # Post logic
│   │   │   └── commentController.js # Comment logic
│   │   ├── middleware/
│   │   │   ├── auth.js           # Auth middleware
│   │   │   ├── validator.js      # Input validation
│   │   │   └── rateLimiter.js    # Rate limiting
│   │   ├── routes/
│   │   │   ├── authRoutes.js     # Auth endpoints
│   │   │   ├── postRoutes.js     # Post endpoints
│   │   │   └── commentRoutes.js  # Comment endpoints
│   │   ├── utils/
│   │   │   └── token.js          # Token utilities
│   │   └── index.js              # Server entry point
│   ├── package.json
│   └── .env
│
└── client/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx         # Root layout
    │   │   ├── page.tsx           # Home page
    │   │   ├── login/             # Login page
    │   │   ├── register/          # Register page
    │   │   ├── verify-email/      # Email verification
    │   │   ├── posts/
    │   │   │   ├── create/        # Create post
    │   │   │   └── [id]/          # Post detail
    │   │   └── auth/callback/     # OAuth callback
    │   ├── components/
    │   │   ├── Navbar.tsx         # Navigation bar
    │   │   ├── CommentList.tsx    # Comments container
    │   │   ├── CommentItem.tsx    # Single comment
    │   │   ├── CommentForm.tsx    # Comment input
    │   │   └── CommentReplies.tsx # Nested replies
    │   ├── contexts/
    │   │   └── AuthContext.tsx    # Auth state management
    │   ├── services/
    │   │   ├── auth.ts           # Auth API calls
    │   │   ├── post.ts           # Post API calls
    │   │   └── comment.ts        # Comment API calls
    │   └── lib/
    │       └── axios.ts          # HTTP client setup
    ├── package.json
    └── .env.local
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Comment-System
```

### 2. Backend Setup

#### 2.1 Install Dependencies

```bash
cd server
npm install
```

#### 2.2 Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/comment-system
JWT_SECRET=your_secure_random_secret_key_here
JWT_EXPIRE=7d

# Brevo (Sendinblue) Email Settings
BREVO_API_KEY=your-brevo-api-key
BREVO_FROM_EMAIL=your-verified-email@example.com
BREVO_FROM_NAME=CommentHub

CLIENT_URL=http://localhost:3000

# Optional: Google OAuth (leave empty if not using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SESSION_SECRET=your-session-secret
SESSION_TTL_SECONDS=86400
```

#### 2.3 Setup Brevo (Sendinblue) Email Service

1. Sign up for a free account at [Brevo](https://www.brevo.com/)
2. Go to Settings → SMTP & API
3. Create a new API key
4. Copy the API key to `BREVO_API_KEY` in your `.env` file
5. Verify your sender email address in Brevo dashboard
6. Use the verified email in `BREVO_FROM_EMAIL`

#### 2.4 Setup Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

#### 2.6 Start Backend Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

#### 3.1 Install Dependencies

```bash
cd ../client
npm install
```

#### 3.2 Configure Environment Variables

Create `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### 3.3 Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health

## API Endpoints

### Authentication
```
POST   /api/auth/register              # Register new user
POST   /api/auth/login                 # Login user
GET    /api/auth/verify-email?token=   # Verify email
GET    /api/auth/me                    # Get current user
POST   /api/auth/resend-verification   # Resend verification email
GET    /api/auth/google                # Google OAuth login
GET    /api/auth/google/callback       # Google OAuth callback
```

### Posts
```
GET    /api/posts                     # Get all posts (paginated)
GET    /api/posts/:id                 # Get single post
POST   /api/posts                     # Create post (auth required)
PUT    /api/posts/:id                 # Update post (owner only)
DELETE /api/posts/:id                 # Delete post (owner/admin)
```

### Comments
```
POST   /api/comments                         # Create comment/reply (auth required)
GET    /api/comments/post/:postId            # Get post comments (paginated)
GET    /api/comments/:commentId/replies      # Get comment replies (paginated)
PUT    /api/comments/:id                     # Update comment (owner only)
DELETE /api/comments/:id                     # Delete comment (owner/admin)
POST   /api/comments/:id/like                # Toggle like (auth required)
GET    /api/comments/:id/likes               # Get users who liked
```

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10 for comments, 5 for replies)
- `sort` - Sort order: 'recent' or 'liked' (default: 'recent')

## Usage Guide

### 1. Register a New Account
1. Click "Sign Up" in the navigation bar
2. Fill in username, email and password
3. Click "Sign Up"
4. Check your email for verification link
5. Click the verification link

### 2. Login
1. Click "Login" in the navigation bar
2. Enter email and password
3. Or click "Continue with Google" for OAuth

### 3. Create a Post
1. After logging in, click "Create Post"
2. Enter title and content
3. Optionally add an image URL
4. Click "Create Post"

### 4. Comment on a Post
1. Click on any post to view details
2. Scroll to the comment section
3. Type your comment in the input field
4. Click "Comment"

### 5. Reply to a Comment
1. Click "Reply" under any comment
2. Type your reply
3. Click "Reply"

### 6. Like Comments
1. Click the heart icon on any comment
2. Click again to unlike

### 7. Edit Your Comment
1. Click the three dots menu on your comment
2. Click "Edit"
3. Update the content
4. Click "Save"

### 8. Delete Content
- **Your own**: Click three dots → Delete
- **As admin**: Click the trash icon on any content

## Rate Limiting

To prevent abuse, the following rate limits are enforced:

- **Comments**: 5 per minute per user
- **Authentication**: 5 attempts per 15 minutes

## Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Image upload with cloud storage
- [ ] User profiles and avatars
- [ ] Direct messaging
- [ ] Comment mentions (@username)
- [ ] Markdown support in comments
- [ ] Search and filtering
- [ ] Report/flag system
- [ ] Analytics dashboard
- [ ] Dark mode theme

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
- Check the documentation above
- Review the code comments
- Open an issue on GitHub