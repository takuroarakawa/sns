# SNS Platform

A social networking service combining features of Pixiv and X (Twitter), designed for **Scientists**, **Mangaka** (manga artists), and creative professionals, with support for **ROM** (Read-Only Mode) users.

## Features

### User Tiers
- **ROM (Read-Only Mode)**: Browse and engage with content without posting
- **Creator**: Share your work - text, images, videos, documents, and manga
- **Verified Creator**: Verified professionals with special badge

### Content Types
- Text posts with rich formatting
- Image galleries and artwork
- Video content
- Document uploads (PDFs, research papers)
- Manga series with chapter organization

### Social Features
- Follow/unfollow system
- Like, comment, and repost
- Direct messaging (Phase 4)
- Real-time notifications (Phase 4)
- Algorithmic and chronological feeds

### Content Organization
- SFW/NSFW content rating system
- Tags and categories
- Scientific metadata (DOI, citations) for research posts
- Manga series organization

### Monetization (Phase 5)
- Creator subscription tiers
- Tips and donations
- Premium-only content

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand + React Query
- **Storage**: Cloudflare R2 / AWS S3 (for media)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/takuroarakawa/sns.git
cd sns
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sns_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

4. Initialize the database:
```bash
npm run db:generate
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (main)/            # Main app pages (requires auth)
│   │   └── page.tsx       # Home feed
│   ├── [username]/        # User profile pages
│   └── api/               # API routes
│       ├── auth/
│       ├── posts/
│       └── users/
├── components/
│   ├── layout/            # Layout components
│   ├── post/              # Post-related components
│   ├── ui/                # Base UI components (shadcn/ui)
│   └── user/              # User-related components
├── lib/                   # Utilities and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Utility functions
└── types/                 # TypeScript type definitions
```

## Database Schema

Key models:
- **User**: User accounts with tier system (ROM, Creator, Verified)
- **Post**: Multi-type posts (text, image, video, document, manga)
- **Media**: Uploaded media files
- **Follow**: User follow relationships
- **Like/Bookmark**: Post engagement
- **MangaSeries**: Manga organization
- **Notification**: User notifications

See [`prisma/schema.prisma`](prisma/schema.prisma) for the complete schema.

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth handlers

### Posts
- `GET /api/posts` - Get feed posts
- `POST /api/posts` - Create a post
- `POST/DELETE /api/posts/[id]/like` - Like/unlike a post

### Users
- `GET /api/users/[username]` - Get user profile
- `PATCH /api/users/[username]` - Update profile
- `POST/DELETE /api/users/[username]/follow` - Follow/unfollow

## Development Phases

### Phase 1: Foundation (Current)
- [x] Project setup with Next.js, TypeScript, Tailwind CSS
- [x] Database schema with Prisma
- [x] Authentication with NextAuth.js
- [x] User registration with tier selection
- [x] Basic user profiles
- [x] Text posting functionality
- [x] Basic chronological feed
- [x] Follow/unfollow system
- [x] Like functionality

### Phase 2: Social Features
- [ ] Comments and threaded replies
- [ ] Repost and quote post
- [ ] Bookmarks
- [ ] In-app notifications
- [ ] Tag system
- [ ] Search functionality

### Phase 3: Advanced Content
- [ ] Image upload with processing
- [ ] Video upload and streaming
- [ ] Document upload
- [ ] Manga series system
- [ ] Scientific metadata

### Phase 4: Messaging & Real-time
- [ ] Direct messaging
- [ ] WebSocket notifications
- [ ] Online presence

### Phase 5: Monetization
- [ ] Stripe integration
- [ ] Creator subscriptions
- [ ] Tipping system
- [ ] Premium content

### Phase 6-8: Discovery, Moderation, Scale
- [ ] Algorithmic feed
- [ ] Creator verification
- [ ] Content moderation
- [ ] Performance optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Architecture

For detailed architecture documentation, see [`plans/sns-platform-architecture.md`](plans/sns-platform-architecture.md).
