# Social App (React + Vite)

A modern social media web app built with React, Vite, HeroUI, and Tailwind CSS.

## Tech Stack

- React 19
- Vite
- React Router
- HeroUI
- Tailwind CSS
- Axios
- React Toastify

## Run Locally

1. Install dependencies:
   - `npm install`
2. Start development server:
   - `npm run dev`
3. Build for production:
   - `npm run build`
4. Preview production build:
   - `npm run preview`

## Core Features

### Authentication & Account

- Register, login, and protected routes
- User profile retrieval via token
- Change password flow
- Better validation UX with friendly error messages
- Stable input layout without jump while showing validation errors

### Feed & Posts

- Create post with text and optional image
- Post privacy options:
  - `public`
  - `following`
  - `only_me`
- Edit and delete own posts
- Like, comment, share, and bookmark posts
- Text-only post style cards with stable random gradient backgrounds
- Full-image preview modal on post images (click to view original ratio)

### Comments & Replies

- Add comments and replies
- Like comments
- Edit and delete own comments
- Reply thread expand/collapse
- Clickable user avatars to navigate to profile
- Full-image preview modal on comment and reply images

### Profile Experience

- Public user profile page (`/users/:id`) with:
  - Cover photo
  - Profile avatar
  - User details
  - Follow/unfollow
  - Posts list
- My profile page (`/profile`) with Facebook-style header:
  - Cover photo section
  - Profile info and stats
  - Posts timeline
- Update profile image and cover photo

### Social Graph

- Followers and following pages for any user
- Navigate from profile stats to followers/following lists
- Back navigation between profile and list pages
- Self-follow button hidden when viewing your own account
- Fixed ID extraction for API calls to avoid `[object Object]` URL bugs

### Navbar & Global UX

- Home button in navbar to jump to News Feed
- Notification and bookmark badge counts
- Skeleton loaders for counts on refresh (prevents flashing `0`)
- Connections dropdown (followers/following counts)

## Project Structure (High Level)

- `src/components` → reusable UI and feature components
- `src/pages` → route-level pages
- `src/services` → API service layer
- `src/lib` → helper utilities and validation schemas
- `src/Layouts` → app and auth layouts

## Final Polish Completed

- Added full-image preview modals for posts, shared posts, comments, and replies
- Added text-only post visual cards for better feed engagement
- Added navbar home navigation shortcut
- Added skeleton-loading behavior for navbar badges and profile-related counts

## Mentor Review Checklist (Screenshots Needed)

> Replace each placeholder with your real screenshot path and caption.

### 1) Auth Screens

- [ ] Login page with validation message (friendly text)
  - Screenshot: `TODO_add_screenshot_login_validation.png`
- [ ] Register page responsive layout (mobile view)
  - Screenshot: `TODO_add_screenshot_register_mobile.png`

### 2) Feed & Post Features

- [ ] Create post with privacy selector open
  - Screenshot: `TODO_add_screenshot_post_privacy_selector.png`
- [ ] Feed card showing privacy icon tooltip
  - Screenshot: `TODO_add_screenshot_post_privacy_icon.png`
- [ ] Text-only post rendered as styled gradient card
  - Screenshot: `TODO_add_screenshot_text_only_post_card.png`
- [ ] Full-image preview modal for a post image
  - Screenshot: `TODO_add_screenshot_post_image_preview_modal.png`

### 3) Comments & Replies

- [ ] Comment image thumbnail + full-image preview modal
  - Screenshot: `TODO_add_screenshot_comment_image_preview.png`
- [ ] Reply image thumbnail + full-image preview modal
  - Screenshot: `TODO_add_screenshot_reply_image_preview.png`

### 4) Profile & Social Graph

- [ ] Public user profile (`/users/:id`) with cover + follow button
  - Screenshot: `TODO_add_screenshot_public_user_profile.png`
- [ ] My profile (`/profile`) with cover + profile details + stats
  - Screenshot: `TODO_add_screenshot_my_profile_facebook_style.png`
- [ ] Followers page and following page with back navigation
  - Screenshot: `TODO_add_screenshot_followers_following_pages.png`

### 5) Navbar & Navigation

- [ ] Navbar showing Home button + notification/bookmark badges
  - Screenshot: `TODO_add_screenshot_navbar_home_badges.png`
- [ ] Navbar loading state with skeleton badges on refresh
  - Screenshot: `TODO_add_screenshot_navbar_skeleton_badges.png`

## Known Notes

- Some additional Tailwind class normalization suggestions may still appear from linting (non-blocking, visual behavior unaffected).
- Backend privacy filtering behavior depends on API implementation.

## Author Notes

This project was iteratively improved to enhance UX quality, responsive behavior, and social interaction flow before mentor submission.
