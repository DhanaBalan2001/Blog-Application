# Blog App - Frontend

A modern, responsive frontend for a comprehensive Blog application.

## Features:

- **Feed**: Personalized content feed with posts from followed users
- **User Profiles**: View and edit user profiles with profile pictures
- **Post Creation**: Create, edit, and delete posts with rich content
- **Social Interactions**: Like posts, bookmark content, follow users
- **Comments System**: Comment on posts with nested replies
- **Search**: Find posts and users with advanced search functionality
- **Notifications**: Real-time notifications for social interactions
- **Responsive Design**: Optimized for both desktop and mobile devices

## Tech Stack:

- **React**: Frontend library
- **Context API**: State management
- **React Router**: Navigation
- **Axios**: API requests
- **CSS**: Styling
- **React Icons**: UI icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd financial-management-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=https://expense-tracker-backend-944r.onrender.com/api
   # For local development:
   # REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```
   
## Key Pages:

- **Login/Register**: User authentication
- **Home Feed**: Main content feed with posts
- **Profile**: User profiles with posts and follower information
- **Post Detail**: Expanded view of posts with comments
- **Create Post**: Interface for creating new posts
- **Search**: Find posts and users
- **Bookmarks**: View saved posts
- **Settings**: Configure account settings
  
## Components:

- **Navbar**: Navigation and search functionality
- **Post Card**: Display post content with interaction buttons
- **Comment Section**: Display and add comments with nested replies
- **User Card**: Display user information with follow button
- **Profile Header**: Display user profile information
- **Feed**: Display posts in a scrollable feed
- **Modal**: Reusable modal for various forms
  
## State Management:

The application uses React Context API for state management, with separate contexts for:

- **Auth Contex**t: User authentication and profile information
- **Post Context**: Post creation, editing, and interaction
- **UI Context**: UI state like modals and notifications
  
## Deployment:

The frontend can be deployed Netlify Url:
https://stellular-marzipan-bb6b3d.netlify.app

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
