# MASKoff

MASKoff is a full‑stack MERN platform that combines job searching, professional engagement, and secure real‑time messaging. It provides customizable user profiles (with both public and anonymous modes), encrypted chat, friend management, and an integrated job process—all centered around job posts.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Schema Details](#schema-details)
- [User Flow](#user-flow)
- [Job Process & Tracker](#job-process--tracker)
- [Profile Settings & Page](#profile-settings--page)
- [Explore Page](#explore-page)
- [API Endpoints](#api-endpoints)
- [CRUD Operations](#crud-operations)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Attributions](#attributions)
- [Contact](#contact)

---

## Overview

MASKoff is designed to reduce bias in the hiring process while offering a robust platform for job seekers and employers alike. With integrated real‑time messaging (AES‑encrypted) and a dynamic feed of job posts, users can build personalized profiles and engage in professional networking and job‑related transactions—all in one place.

---

## Features

- **Authentication & Authorization**

  - JWT‑based authentication with secure password hashing (bcrypt)
  - Email verification and password reset flows via MailerSend

- **Profile Management**

  - **User Authentication Schema:**  
    Manages user credentials, tokens (for email verification and password reset), and friend relationships (using a friend sub‑schema with userID and username).  
    _Registration requires: First Name, Last Name, Email, Username, Date of Birth, Password, Repeat Password, and Anonymous Identity._
  - **User Profile Schema:**  
    Stores additional profile details such as bio, skills, achievements, and portfolio. These fields are optional and can be set during onboarding.
  - **Privacy Toggle (MASKon/MASKoff):**  
    Allows users to toggle between public and private profiles (MaskOFF displays full details, MaskON hides public information).

- **Jobs**

  - All posts are job‑related. Each job post falls under one of two categories:
    - **#Service:** For individuals offering freelance services.
    - **#Job:** For posting job positions (full‑time/part‑time) or recruitment opportunities.
  - **Application Process:**  
    Job posters create posts with details such as title, description, price/salary range, and contract period. Potential applicants click an **Apply/Request** button that sends an automated greeting to the job poster and triggers a toast notification.
  - **Job Tracker:**  
    A dedicated tracker page (in development) will display each job post with all its details—even if the original post is later removed from the main feed—and will include action buttons to progress through the hiring process (such as Approve/Decline, Mark as Completed/Abandoned). Both job posters and applicants can use the tracker alongside ongoing chat for further communication.

- **Direct Messaging**

  - Real‑time chat with AES‑encrypted messages via WebSocket notifications.
  - Enables ongoing communication regarding job applications and additional details.

- **Friend Management**
  - Send, accept, or reject friend requests.
  - View and manage a consolidated friend list.

---

## Schema Details

1. **UserAuth Schema**  
   _Purpose:_ Manage user credentials, friend relationships, and token data.  
   **Key Fields:**

   - First Name, Last Name (currently combined into a single `name` field)
   - Email, Username, Date of Birth
   - Password (and confirmation during registration)
   - Anonymous Identity
   - Arrays for friendRequestsSent, friendRequestsReceived, and friends (using a sub‑schema with userID and username)
   - Tokens for email verification and password resets

2. **UserProfile Schema**  
   _Purpose:_ Store additional profile details for onboarding and ongoing personalization.  
   **Key Fields (optional during onboarding):**
   - Bio, Skills, Achievements, Portfolio
   - Privacy flag to toggle between MaskON (anonymous) and MaskOFF (public) modes
   - Anonymous Info containing the Anonymous Identity (used when the user opts for MaskON)

---

## User Flow

1. **Registration:**

   - **User Create:**  
     The registration form (based on the UserAuth schema) requires First Name, Last Name, Email, Username, Date of Birth, Password, Repeat Password, and Anonymous Identity.
   - **Onboarding:**  
     After registration, users are directed to an onboarding page where they can optionally add profile details (bio, skills, achievements, portfolio) via the UserProfile schema.
   - **Navigation:**  
     Once onboarding is complete, users are taken to their profile page.

2. **Social & Friend Features:**
   - Users can search for and add friends.
   - A friend list and friend request system allow users to manage their network.

---

## Job Process & Tracker

- **Job Posting:**  
  Job posters create job posts with details such as title, description, price/salary range, contract period, and select a job category (either **#Service** or **#Job**).

- **Application:**  
  Potential applicants click the **Apply/Request** button on a job post. This action sends an automated greeting to the job poster and triggers a toast notification, while also adding the job post to the applicant’s tracker.

- **Job Tracker:**  
  A tracker page (currently outlined in the documentation) will:
  - Display the details of each job post (persisted even if removed from the main feed)
  - Allow job posters to approve or decline applications and to mark a job as Completed or Abandoned
  - Allow applicants to accept or decline job offers and view the current status of their applications
  - Update the status in real time; if a job is completed, the applicant’s completed jobs are listed on their profile under “Completed Jobs”

---

## Profile Settings & Page

**Display-Only Information:**

- First Name, Last Name
- Email
- Username
- Date of Birth

**Editable Fields:**

- Change Password (with confirmation)
- Bio
- Skills
- Achievements
- Portfolio (with upload capability)
- Profile Toggle (MaskON / MaskOFF to switch between public and private views)

---

## Explore Page

- **Recent Posts:**  
  - Shows only the 5 most recent posts  
  - Displays content, tags, upvotes, downvotes, number of comments, and post date/time.
- **Latest Jobs:**  
  - Shows only the 5 most recent jobs  
  - Displays job title, description, price, contract period, posted date, and an "Apply Now" button.

---

## API Endpoints

### User & Authentication

- **POST /api/register**  
  Registers a new user (creates both a UserAuth and corresponding UserProfile) and sends a verification email.

- **GET /api/verify-email?userID=&token=**  
  Verifies a user’s email address.

- **POST /api/forgot-password**  
  Requests a password reset email.

- **POST /api/reset-password**  
  Resets the user’s password using a token.

- **POST /api/users/login**  
  Authenticates a user and returns a JWT.

- **GET /api/user/:userID**  
  Retrieves combined user and profile details.

- **PUT /api/profile/:userID**  
  Updates the user’s profile details.

- **GET /api/users**  
  Retrieves a list of all users (public information).

### Jobs

- **POST /api/posts**  
  Creates a new job post (including content, tags, and anonymity flag).  
  _Tags should include either **#Service** or **#Job**._

- **GET /api/posts**  
  Retrieves all job posts with associated user profile information.

- **GET /api/posts/:postID**  
  Retrieves details of a specific job post.

- **PUT /api/posts/:postID**  
  Updates a job post.

- **DELETE /api/posts/:postID**  
  Deletes a job post.

- **POST /api/posts/:postID/comments**  
  _(Optional)_ Adds a comment to a job post.

- **POST /api/posts/:postID/upvote** / **downvote**  
  Allows users to vote on a job post.

### Chat & Messaging

- **POST /api/chat/create**  
  Creates a new chat between users.

- **GET /api/chats**  
  Lists all chats for the authenticated user.

- **POST /api/chat/send**  
  Sends a message (auto‑creates a chat if one doesn’t already exist).

- **GET /api/chat/messages/:chatID**  
  Retrieves all decrypted messages for a specific chat.

- **PUT /api/chat/message/:chatID/:messageID**  
  Edits an existing message within a chat.

- **DELETE /api/chat/message/:chatID/:messageID**  
  Deletes a specific message from a chat.

- **DELETE /api/chat/:chatID**  
  Deletes an entire chat conversation.

### Friends

- **POST /api/friends/request**  
  Sends a friend request to another user.

- **GET /api/friends/requests/received** / **sent**  
  Retrieves a list of friend requests that have been received or sent.

- **POST /api/friends/accept** / **reject**  
  Processes a friend request by either accepting or rejecting it.

- **GET /api/friends**  
  Retrieves the authenticated user's list of friends.

### Job Operations

- **POST /api/jobs**  
  Creates a new job listing with title, description, price, and contract period.

- **GET /api/jobs**  
  Retrieves all job listings with associated user profile information.
- **GET /api/jobs/:jobID**  
  Retrieves detailed information for a specific job.

- **PUT /api/jobs/:jobID**  
  Updates an existing job's details. Only the job creator can perform this action.

- **DELETE /api/jobs/:jobID**  
  Deletes a specific job listing. Only the job creator can perform this action.

---

## CRUD Operations

This section details the Create, Read, Update, and Delete (CRUD) operations available in MASKoff’s API for managing Users, Job Posts, Chats, and Friends.

### User Operations

- **Create User (Registration)**

  - **Endpoint:** `POST /api/register`
  - **Description:** Registers a new user by creating both a UserAuth record and a corresponding UserProfile. Sends an email verification.
  - **Required Data:** First Name, Last Name, Email, Username, Date of Birth, Password, Repeat Password, and Anonymous Identity.

- **Read User**

  - **Endpoint:** `GET /api/user/:userID`
  - **Description:** Retrieves detailed information about a specific user, including their profile details.

- **Update User Profile**

  - **Endpoint:** `PUT /api/profile/:userID`
  - **Description:** Updates the user's profile information (e.g., bio, skills, achievements, portfolio, and privacy settings).

- **Delete User**
  - **Note:** User deletion is not explicitly implemented in the current codebase.

---

### Job Post Operations

- **Create Job Post**
  - **Endpoint:** `POST /api/posts`
  - **Description:** Creates a new post that includes content, tags, and an anonymity flag. Tags must include either **#Service** or **#Job**.
- **Read Job Posts**

  - **Endpoint:** `GET /api/posts`
  - **Description:** Retrieves a list of all posts with associated user profile information.
  - **Endpoint:** `GET /api/posts/:postID`
  - **Description:** Retrieves detailed information for a specific post.

- **Update Job Post**

  - **Endpoint:** `PUT /api/posts/:postID`
  - **Description:** Updates the content, tags, or anonymity flag of a specific post.

- **Delete Job Post**
  - **Endpoint:** `DELETE /api/posts/:postID`
  - **Description:** Deletes a specific post.

---

### Chat Operations

- **Create Chat**

  - **Endpoint:** `POST /api/chat/create`
  - **Description:** Explicitly creates a new chat between two users.

- **Send Message**

  - **Endpoint:** `POST /api/chat/send`
  - **Description:** Sends a message within a chat. If a chat between the users does not exist, one is automatically created.

- **Read Chat Messages**

  - **Endpoint:** `GET /api/chat/messages/:chatID`
  - **Description:** Retrieves all decrypted messages for a specific chat.

- **Update Message**

  - **Endpoint:** `PUT /api/chat/message/:chatID/:messageID`
  - **Description:** Edits an existing message within a chat.

- **Delete Message**

  - **Endpoint:** `DELETE /api/chat/message/:chatID/:messageID`
  - **Description:** Deletes a specific message from a chat.

- **Delete Chat**
  - **Endpoint:** `DELETE /api/chat/:chatID`
  - **Description:** Deletes an entire chat conversation.

---

### Friend Operations

- **Send Friend Request**

  - **Endpoint:** `POST /api/friends/request`
  - **Description:** Sends a friend request to another user.

- **Read Friend Requests**

  - **Endpoint:** `GET /api/friends/requests/received`
  - **Endpoint:** `GET /api/friends/requests/sent`
  - **Description:** Retrieves a list of friend requests that have been received or sent.

- **Update Friend Request (Accept/Reject)**

  - **Endpoint:** `POST /api/friends/accept`
  - **Endpoint:** `POST /api/friends/reject`
  - **Description:** Processes a friend request by either accepting or rejecting it.

- **Read Friend List**
  - **Endpoint:** `GET /api/friends`
  - **Description:** Retrieves the authenticated user's list of friends.

---

### Job Operations

- **Create Job**

  - **Endpoint:** `POST /api/jobs`
  - **Description:** Creates a new job listing with title, description, price, and contract period.

- **Read Jobs**

  - **Endpoint:** `GET /api/jobs`
  - **Description:** Retrieves all job listings with associated user profile information.
  - **Endpoint:** `GET /api/jobs/:jobID`
  - **Description:** Retrieves detailed information for a specific job.

- **Update Job**

  - **Endpoint:** `PUT /api/jobs/:jobID`
  - **Description:** Updates an existing job's details. Only the job creator can perform this action.

- **Delete Job**
  - **Endpoint:** `DELETE /api/jobs/:jobID`
  - **Description:** Deletes a specific job listing. Only the job creator can perform this action.

---

## Tech Stack

### Front-end

- **React & Vite:** For a modern, fast development environment.
- **HeroUI:** For pre‑styled UI components.
- **Tailwind CSS & Tailwind‑Variants:** For utility‑first styling.
- **React Router:** For client‑side navigation.
- **Axios:** For HTTP requests.
- **Context API & Custom Hooks:** For state, theme, and user management.

### Back-end

- **Node.js & Express:** For RESTful API development.
- **MongoDB & Mongoose:** For data modeling and persistence.
- **JWT & bcrypt:** For secure authentication.
- **AES Encryption:** For securing chat messages.
- **WebSocket (ws):** For real‑time updates and notifications.
- **MailerSend:** For email verification and password reset notifications.

---

## Installation & Setup

```bash
git clone https://your-repo-url.git
cd your-repo-directory
```

## Attributions

- **HeroUI:** UI component library used to build the interface, providing pre‑styled and customizable React components.
- **Tailwind CSS & Tailwind‑Variants:** For responsive, utility‑first styling that speeds up development and ensures consistency across the application.
- **Express & Mongoose:** For building a robust RESTful API and managing interactions with the MongoDB database.
- **JWT & bcrypt:** For secure authentication, token generation, and password management.
- **WebSocket (ws):** For implementing real‑time messaging and live updates throughout the platform.
- **Axios, clsx, and other libraries:** For making HTTP requests, managing conditional class names, and supporting additional functionality within the codebase.
- **MailerSend:** For managing email notifications such as account verification and password resets.
- **Other Tools & Dependencies:** React, Vite, Node.js, and additional development tools streamline the overall development process.

---

## Contact

For any questions, feedback, or further information about MASKoff, please reach out via email at [app.MaskOFF@gmail.com](mailto:app.MaskOFF@gmail.com). We welcome contributions and suggestions from the community. You can also open an issue in our repository for any bug reports or feature requests.