import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  const apiEndpoints = {
    "Blog App API": {
      "User Management": {
        "POST /api/users/register": "Register a new user",
        "POST /api/users/login": "Login a user",
        "GET /api/users/me": "Get current user profile (requires authentication)",
        "GET /api/users/:id": "Get user profile by ID",
        "PUT /api/users/me": "Update user profile (requires authentication)",
        "POST /api/users/profile-picture": "Update profile picture URL (requires authentication)",
        "PUT /api/users/follow/:id": "Follow a user (requires authentication)",
        "PUT /api/users/unfollow/:id": "Unfollow a user (requires authentication)",
        "GET /api/users/:id/followers": "Get user followers",
        "GET /api/users/:id/following": "Get users that a user is following"
      },
      "Post Management": {
        "POST /api/posts": "Create a new post (requires authentication)",
        "PUT /api/posts/posts/:id": "Update a post (requires authentication)",
        "DELETE /api/posts/posts/:id": "Delete a post (requires authentication)",
        "GET /api/posts": "Get all posts",
        "GET /api/posts/user/:userId": "Get posts by user",
        "GET /api/posts/search": "Search posts",
        "GET /api/posts/:id": "Get post by ID",
        "PUT /api/posts/like/:id": "Like/unlike a post (requires authentication)",
        "PUT /api/posts/bookmark/:id": "Bookmark/unbookmark a post (requires authentication)",
        "GET /api/posts/tag/:tag": "Get posts by tag"
      },
      "Comment Management": {
        "POST /api/comments/:postId": "Add comment to post (requires authentication)",
        "GET /api/comments/:postId": "Get comments for a post",
        "DELETE /api/comments/:id": "Delete a comment (requires authentication)",
        "PUT /api/comments/:id": "Edit a comment (requires authentication)",
        "PUT /api/comments/like/:id": "Like/unlike a comment (requires authentication)",
        "POST /api/comments/reply/:id": "Add reply to a comment (requires authentication)",
        "GET /api/comments/replies/:id": "Get replies for a comment"
      },
      "System": {
        "GET /health": "Health check endpoint",
        "GET /api/docs": "API documentation"
      }
    }
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Blog App API Documentation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
          }
          h2 {
            color: #34495e;
            margin-top: 30px;
          }
          .endpoint {
            margin: 15px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #3498db;
          }
          .method {
            color: #2980b9;
            font-weight: bold;
            font-size: 1.1em;
          }
          .path {
            color: #555;
            margin: 5px 0;
          }
          .description {
            color: #666;
            font-size: 0.9em;
          }
          .get { border-left-color: #27ae60; }
          .get .method { color: #27ae60; }
          .post { border-left-color: #e74c3c; }
          .post .method { color: #e74c3c; }
          .put { border-left-color: #f39c12; }
          .put .method { color: #f39c12; }
          .delete { border-left-color: #c0392b; }
          .delete .method { color: #c0392b; }
          .patch { border-left-color: #8e44ad; }
          .patch .method { color: #8e44ad; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Blog App API Documentation</h1>
          ${Object.entries(apiEndpoints["Blog App API"]).map(([category, endpoints]) => {
            return `
              <h2>${category}</h2>
              ${Object.entries(endpoints).map(([path, description]) => {
                const methodParts = path.split(' ');
                const method = methodParts.length > 0 ? methodParts[0].toLowerCase() : '';
                const pathPart = methodParts.length > 1 ? methodParts[1] : path;
                
                return `
                  <div class="endpoint ${method}">
                    <div class="method">${methodParts[0]}</div>
                    <div class="path">${pathPart}</div>
                    <div class="description">${description}</div>
                  </div>
                `;
              }).join('')}
            `;
          }).join('')}
        </div>
      </body>
    </html>
  `;

  res.send(html);
});

export default router;
