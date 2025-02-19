# MASKoff

MASKoff is a full-stack MERN job platform that combines job searching with community engagement and messaging features. The app empowers job seekers and employers by offering customizable profiles, secure real-time messaging, community posts, and integrated interview scheduling—all with robust role-based authentication.

> **Note:** Some features (e.g. community posts, job posts, profile customization, admin panel, anonymous introductions) are WIP.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Stories](#user-stories)
- [Wireframe & UI Architecture](#wireframe--ui-architecture)
- [ERD](#erd)
- [API Routes](#api-routes)
- [Express Auth](#express-auth)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Feed Tabs UI](#feed-tabs-ui)
- [Attributions](#attributions)
- [Contact](#contact)

---

## Overview

MASKoff is designed to reduce bias in the hiring process while empowering both job seekers and employers.  
**Currently Implemented in Codebase:**
- **User Authentication:** Registration and login endpoints using JWT, bcrypt, and secure password handling.
- **Friend Management:** Endpoints to send, accept, and delete friend requests, and to list friends.
- **Direct Messaging:** Secure, real-time chat using encrypted messages; chat logs with CRUD operations (sending, editing, deleting messages) and WebSocket integration for live updates.
- **Basic Chat Log Management:** Automatic creation of chat logs between users when a message is sent.

**Planned Features (Not Yet Implemented):**
- **Community Posts & Comments:** Full CRUD for community posts and comments.
- **Job Posting & Interview Scheduling:** Interfaces and endpoints for job posts with an integrated calendar for scheduling interviews.
- **Profile Customization & Privacy Controls:** Options for users to customize their profile and choose which information to share per application.
- **Admin Panel & Role-Based Access:** Separate admin functionalities for managing content and moderating users.
- **Anonymous Introductions:** Endpoints and UI for anonymous posts and introductions.

---

## Features

### Already Implemented:
- **Authentication & Role-Based Access:**
  - User registration (`POST /api/newuser`), login (`POST /api/users/login`), and fetching user data (`GET /api/user/:userID`).
  - An admin panel is available via dedicated admin routes (e.g. `/admin/login`, `/admin/dashboard`, etc.).
- **Friend Management:**
  - Endpoints for sending (`POST /api/friends/request`), canceling/declining (`DELETE /api/friends/request`), retrieving (`GET /api/friends/requests`), accepting (`POST /api/friends/accept`), and listing friends (`GET /api/friends`).
- **Direct Messaging & Chat:**
  - Chat log creation (`POST /api/chat/create`), message sending (`POST /api/chat/send`), retrieval (`GET /api/chats` and `GET /api/chat/messages/:chatId`), editing (`PUT /api/chat/message/:chatId/:messageId`), and deletion (`DELETE /api/chat/message/:chatId/:messageId`).
  - Deleting an entire chat (`DELETE /api/chat/:chatId`).
  - Real‐time notifications via WebSocket.
- **Community Posts & Introductions:**
  - **Posts:** Users can now create posts through the `/api/posts` endpoint. A “postType” flag allows a post to be marked as either a regular community post or a job post.
  - **Introductions:** Anonymous introductions are available via `/api/introduction` (POST) and `/api/introductions` (GET).

### Planned (Future Implementation):
- **Community Post Details & Management:**
  - Endpoints for viewing a single post (`GET /api/posts/:postId`), updating (`PUT /api/posts/:postId`), and deleting posts (`DELETE /api/posts/:postId`).
  - Adding and managing comments on posts (`POST /api/posts/:postId/comments`).
- **Job Posting & Interview Scheduling:**
  - Although job posts can be created via the posts endpoint (using postType “job”), dedicated job post endpoints (e.g., `/api/jobs`) with full CRUD operations and integrated interview scheduling are planned.
- **Profile Customization & Privacy Controls:**
  - Options for users to customize their profile (including themes, custom fields, and privacy settings).
  - A multi-step onboarding process and profile completion analytics.
- **Admin Panel Enhancements:**
  - Extended admin functionalities for content moderation and user management.
  - (Documentation for admin routes such as `/admin/login`, `/admin/dashboard`, etc. is pending.)
- **Additional Analytics & Export Features:**
  - Profile insights (views, engagement), a badge system, and one-click profile export.

---

## User Stories

- **Account Management**
  - *As a guest,* I can create an account and log in to receive a JWT token.
  - *As a user,* I can log out, ending my session.
- **Friend Management**
  - *As a user,* I can send, view, accept, and delete friend requests.
- **Direct Messaging**
  - *As a user,* I can send, edit, and delete messages in real time.
  - *As a user,* I receive live chat updates via WebSocket.
- **Planned Stories for Future Implementation**
  - *As a user,* I will be able to create, view, and manage community posts and comments.
  - *As a user,* I will have the ability to post and filter job-related posts.
  - *As a user,* I will be able to customize my profile and set privacy preferences.
  - *As an admin,* I will have dedicated tools to moderate content and manage users.
  - *As a user,* I can post anonymously via the introductions feed.

---

## Wireframe & UI Architecture

### Routing Overview (Planned & Implemented)
| URI                       | Use Case                                              |
| ------------------------- | ----------------------------------------------------- |
| `/signup`                 | Form to create a new account                          |
| `/login`                  | Log in to the system                                  |
| `/home`                   | Landing page and community post feed                  |
| `/posts/new`              | Form to create a new community post (Planned)         |
| `/posts`                  | List all community posts (Planned)                    |
| `/posts/:postId`          | View a single post (Details page, Planned)            |
| `/posts/:postId/edit`     | Edit a post (Planned)                                 |
| `/posts/:postId/comments` | Create a comment on a post (Planned)                  |
| `/jobs/new`               | Form to create a new job post (Planned)               |
| `/jobs`                   | List all job posts (Planned)                          |
| `/jobs/:jobId`            | View details of a specific job post (Planned)         |
| `/messages`               | List direct messages (Implemented)                    |
| `/messages/:chatId`       | View a chat conversation (Implemented)              |

### Components & Architecture

- **Pages & Components:**  
  - **Authentication:** Login and Create User pages.
  - **Dashboard:** Navigation to friend management, messaging, and finding users.
  - **Messaging:** A dedicated messages page that lists chats and provides real-time chat functionality.
  - **Feed Tabs (Planned):**  
    - **Tab 1:** Anonymous Introductions feed.
    - **Tab 2:** Posts feed for both regular posts and job posts (job posts marked with a `#Job` tag).  
      Both tabs will feature a reusable post input field at the top, followed by a list of posts sorted by most recent. Tab 2 will include a filter button to view only regular posts or only `#Jobs`.

### Feed Tabs UI

The application will feature **two distinct feed tabs** on the Posts page:

1. **Tab 1: Anonymous/Introductions**
   - This tab will display anonymous posts (introductions).
   - At the top of the tab, a **reusable post input component** will allow users to submit new anonymous posts.
   - Posts will be displayed in reverse chronological order (most recent first).

2. **Tab 2: Posts (Regular & Job Posts)**
   - This tab will show both regular community posts and job posts.
   - **Job posts** will have a simple `#Job` tag appended to them.
   - A **filter button** will allow users to toggle between viewing only regular posts or only job posts.
   - Like Tab 1, Tab 2 will begin with the same **reusable post input component** to create a new post, followed by the list of posts ordered from most recent to oldest.

---

## ERD

### Implemented Entities
- **User**
  - **Fields:** userID, username, password, role, friends (array of User IDs), friendRequests (array of User IDs)
- **ChatLog**
  - **Fields:** chatID, participants (array of User IDs), messages (array of Message objects), createdAt, updatedAt
- **Message**
  - **Fields:** messageID, sender (User ID), recipient (User ID), encryptedMessage, iv, timestamp

### Planned Entities (For Future Implementation)
- **Post (Community Post)**
  - **Fields:** postID, title, content, author (User ID), comments (array of Comment IDs), createdAt, updatedAt
- **Comment**
  - **Fields:** commentID, postID, content, author (User ID), createdAt, updatedAt
- **JobPost**
  - **Fields:** jobID, title, description, employer (User ID), applicants (array of User IDs), createdAt, updatedAt
- **Introduction (Anonymous Post)**
  - **Fields:** introID, content, createdAt

#### Profile Onboarding & Settings

##### Multi-Step Onboarding Wizard
To enhance user experience, MASKoff will introduce a guided profile onboarding process:
1. **Step 1:** Basic Info (Username, Profile Picture Upload)
2. **Step 2:** Add Skills & Interests
3. **Step 3:** Privacy Preferences (Set visibility for profile sections)
4. **Step 4:** Recommended Connections (Suggest connections based on shared interests)

##### Profile Completion Score
- Users will see a profile completion progress bar encouraging them to add missing details.
- Sections like "Skills, Summary, Location" will be optional but improve profile discoverability.
- A "Complete Profile" button will be placed on the dashboard for easy access.

##### Customizable Profile Sections
Users can:
- Enable/disable visibility for fields (e.g., "Hide location from public").
- Add custom fields like "Portfolio Links" or "Certifications."
- Toggle between public/private mode (useful for anonymous browsing).

##### Advanced Privacy Controls
Users can manage:
- **Profile Visibility:** Public / Friends Only / Private.
- **Messaging Preferences:** Everyone / Only Friends / No One.
- **Friend Request Settings:** Everyone / Friends of Friends / No One.
- **Anonymous Browsing Mode:** Prevents users from seeing profile views.

##### Profile Customization
Users can personalize their profile with:
- **Themes:** Dark mode, custom UI themes.
- **Profile Backgrounds:** Users can upload a background image.
- **Pinned Sections:** Users can highlight certain sections (e.g., Featured Jobs, Portfolio).

##### Profile Insights
Users will have access to analytics:
- **Profile Views:** Who viewed my profile? (Anonymous/Named)
- **Post Engagements:** Number of likes/comments on user posts.
- **Message Response Rate:** If the user is active in responding to messages.

##### Badge System
Earn badges as users complete milestones and engage with the platform:
- **100% Profile Completion:** Badge earned when a user's profile is fully filled out.
- **Social Butterfly:** Connect with 10+ friends to earn this badge.
- **Early Adopter:** Earned by joining MASKoff during the launch phase.
- **Community Contributor:** Awarded for posting 10 or more community posts.
- **Quick Responder:** Earned for maintaining a high message response rate.

##### One-Click Profile Export
Users can download their profile as a PDF/Resume:
- **Export Profile as a Resume** (PDF format).
- **Option to Generate a Resume** based on profile fields.

---

## API Routes

| HTTP Method | Controller             | URI                                   | Response Codes                                                                                                                                      | Request Body Example                                                        | Use Case                                                                  | Status       |
| ----------- | ---------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------ |
| POST        | createUser             | `/api/newuser`                        | **201:** User registered successfully<br>**400:** Missing fields<br>**409:** Username already taken<br>**500:** Server error                        | `{ "username": "exampleUser", "password": "StrongPassword123!" }`           | Create a new user account                                                 | Implemented  |
| POST        | loginUser              | `/api/users/login`                    | **200:** Login successful<br>**400:** Missing credentials<br>**404:** User not found<br>**401:** Invalid credentials<br>**500:** Server error       | `{ "username": "exampleUser", "password": "StrongPassword123!" }`           | Log in an existing user                                                   | Implemented  |
| GET         | fetchUserData          | `/api/user/:userID`                   | **200:** User data retrieved<br>**403:** Access denied<br>**404:** User not found<br>**500:** Server error                                           | N/A                                                                         | Fetch user data (protected route)                                         | Implemented  |
| GET         | retrieveAllUsers       | `/api/users`                          | **200:** Users retrieved<br>**500:** Server error                                                                                                  | N/A                                                                         | List all users                                                            | Implemented  |
| POST        | sendFriendReq          | `/api/friends/request`                | **200:** Friend request sent<br>**400:** Missing target user ID or request already sent<br>**404:** Target user not found<br>**500:** Server error   | `{ "targetUserId": "userId" }`                                               | Send a friend request                                                     | Implemented  |
| DELETE      | deleteFriendRequest    | `/api/friends/request`                | **200:** Friend request canceled/declined successfully<br>**400:** Missing target user ID or no pending request<br>**404:** Target user not found<br>**500:** Server error | `{ "targetUserId": "userId" }`                                               | Cancel/decline a pending friend request                                   | Implemented  |
| GET         | retrieveFriendRequests | `/api/friends/requests`               | **200:** Friend requests retrieved<br>**500:** Server error                                                                                        | N/A                                                                         | Retrieve incoming friend requests                                         | Implemented  |
| POST        | acceptFriend           | `/api/friends/accept`                 | **200:** Friend request accepted<br>**400:** Missing requester ID or no friend request<br>**500:** Server error                                      | `{ "requesterId": "userId" }`                                                | Accept a friend request                                                   | Implemented  |
| GET         | fetchFriends           | `/api/friends`                        | **200:** Friend list retrieved<br>**500:** Server error                                                                                            | N/A                                                                         | Get the friend list for the logged in user                                | Implemented  |
| POST        | createChat             | `/api/chat/create`                    | **201:** Chat created successfully<br>**500:** Server error                                                                                        | `{ "recipientId": "otherUserId" }`                                           | Create a chat log between users                                           | Implemented  |
| POST        | sendMessage            | `/api/chat/send`                      | **200:** Message sent successfully<br>**400:** Chat ID and message required<br>**404:** Chat not found<br>**403:** Not authorized<br>**500:** Server error | `{ "recipientID": "userID", "text": "Hello!" }`                             | Send a message in an existing chat                                        | Implemented  |
| GET         | seeChatLog             | `/api/chat/messages/:chatId`          | **200:** Chat messages retrieved<br>**404:** Chat log not found<br>**500:** Server error                                                            | N/A                                                                         | Get decrypted chat messages                                               | Implemented  |
| DELETE      | deleteMessage          | `/api/chat/message/:chatId/:messageId`  | **200/204:** Message deleted<br>**404:** Chat/message not found<br>**500:** Server error                                                            | N/A                                                                         | Delete a specific message (only by the sender)                            | Implemented  |
| DELETE      | deleteChatLog          | `/api/chat/:chatId`                   | **200/204:** Chat log deleted<br>**404:** Chat log not found<br>**500:** Server error                                                                | N/A                                                                         | Delete an entire chat log                                                 | Implemented  |
| POST        | createPost             | `/api/posts`                          | **201:** Post created successfully<br>**400:** Title and content required<br>**500:** Server error                                                   | `{ "title": "Post Title", "content": "Post content" }`                      | Create a new community post                                               | Planned      |
| GET         | getPosts               | `/api/posts`                          | **200:** Posts retrieved<br>**500:** Server error                                                                                                  | N/A                                                                         | Retrieve all community posts                                              | Planned      |
| GET         | getPost                | `/api/posts/:postId`                  | **200:** Post retrieved<br>**404:** Post not found<br>**500:** Server error                                                                         | N/A                                                                         | Retrieve a single community post                                          | Planned      |
| PUT         | updatePost             | `/api/posts/:postId`                  | **200:** Post updated successfully<br>**404:** Post not found<br>**403:** Not authorized<br>**500:** Server error                                    | `{ "title": "Updated title", "content": "Updated content" }`                | Update a community post (only by the author)                              | Planned      |
| DELETE      | deletePost             | `/api/posts/:postId`                  | **200:** Post deleted successfully<br>**404:** Post not found<br>**403:** Not authorized<br>**500:** Server error                                    | N/A                                                                         | Delete a community post (only by the author)                              | Planned      |
| POST        | addComment             | `/api/posts/:postId/comments`         | **201:** Comment added successfully<br>**400:** Comment content required<br>**404:** Post not found<br>**500:** Server error                        | `{ "content": "Comment content" }`                                         | Add a comment to a community post                                         | Planned      |
| POST        | createJob              | `/api/jobs`                           | **201:** Job post created successfully<br>**400:** Title and description required<br>**500:** Server error                                           | `{ "title": "Job Title", "description": "Job description" }`                | Create a new job post (by any user)                                       | Planned      |
| GET         | getJobs                | `/api/jobs`                           | **200:** Job posts retrieved<br>**500:** Server error                                                                                              | N/A                                                                         | Retrieve all job posts                                                    | Planned      |
| GET         | getJob                 | `/api/jobs/:jobId`                    | **200:** Job post retrieved<br>**404:** Job post not found<br>**500:** Server error                                                                 | N/A                                                                         | Retrieve a specific job post                                              | Planned      |
| PUT         | updateJob              | `/api/jobs/:jobId`                    | **200:** Job post updated successfully<br>**404:** Job post not found<br>**403:** Not authorized<br>**500:** Server error                             | `{ "title": "Updated title", "description": "Updated description" }`        | Update a job post (only by the employer who posted it)                    | Planned      |
| DELETE      | deleteJob              | `/api/jobs/:jobId`                    | **200:** Job post deleted successfully<br>**404:** Job post not found<br>**403:** Not authorized<br>**500:** Server error                             | N/A                                                                         | Delete a job post (only by the employer who posted it)                    | Planned      |
| POST        | postIntroduction       | `/api/introduction`                   | **201:** Introduction posted successfully<br>**400:** Content required<br>**500:** Server error                                                       | `{ "content": "Introduction content" }`                                  | Post an anonymous introduction                                            | Planned      |
| GET         | getIntroductions       | `/api/introductions`                  | **200:** Introductions retrieved<br>**500:** Server error                                                                                          | N/A                                                                         | Retrieve all anonymous introductions                                    | Planned      |

---

## Express Auth

- **User Registration:**  
  - **Endpoint:** `POST /api/newuser`
  - **Description:** Registers a new user with a unique username and hashed password.
  - **Authentication:** Returns a JWT token upon successful registration.
- **User Login:**  
  - **Endpoint:** `POST /api/users/login`
  - **Description:** Authenticates the user and returns a JWT token used for accessing protected routes.

---

## Tech Stack

### Front-end:
- **React:** Building dynamic user interfaces.
- **HeroUI:** Pre-styled components (Navbar, Buttons, Inputs, etc.).
- **Tailwind CSS & Tailwind-Variants:** For responsive, utility-first styling.
- **React Router:** For client-side routing.
- **Custom Hooks & Context API:** For state management (user config, theme, messaging, etc.).

### Back-end:
- **Node.js & Express:** RESTful API server.
- **MongoDB & Mongoose:** Database persistence and schema management.
- **JWT & bcrypt:** For authentication and secure password storage.
- **AES Encryption:** For secure messaging between users.
- **WebSocket (ws):** For real-time chat updates and notifications.

---

## Installation & Setup

1. **Clone the repository.**
2. **Install dependencies:**
   ```bash
   npm install

---

## Attributions

- **HeroUI:** UI component library used to build the interface.
- **Tailwind CSS & Tailwind-Variants:** For responsive and utility-first styling.
- **Express & Mongoose:** For building the RESTful API and managing database interactions.
- **JWT & bcrypt:** For secure authentication and password management.
- **WebSocket (ws):** For real-time messaging and live updates.
- **Axios, clsx, etc.:** Additional libraries used in the codebase.

---

## Contact

For any questions, feedback, or further information, please reach out via email at [app.MASKoff@gmail.com](mailto:app.MASKoff@gmail.com).