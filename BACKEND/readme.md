## Rough structure of a express app

#### 1.  (Route => Controller => Model)

``` bash
app (Express)
    ├── Initialize Middleware (body-parser, cors, etc.)
    ├── Authenticate Database Connection
    ├── Sync Database Models
    ├── Define Routes
    │   ├── /endpoint
    │   │   └── controller.handleRequest()
    │   │       └── interacts with Model and returns Response
    │   ├── /protected_endpoint
    │   │   ├── Auth Middleware
    │   │   └── controller.handleRequest()
    │   │       └── interacts with Model and returns Response
    └── Listen on Port

```

### 2. Folder Structure 
```bash
project/
├── config/          // Configuration files (db, env, etc.)
│   └── config.js
├── controllers/     // Route handlers
│   └── userController.js
├── models/          // Database models (ORM)
│   └── userModel.js
├── routes/          // Route definitions
│   └── userRoutes.js
├── middlewares/     // Custom middleware (auth, validation)
│   └── authMiddleware.js
├── services/        // Business logic, separate from controllers
│   └── userService.js
├── utils/           // Utility functions
│   └── logger.js
├── tests/           // Unit and integration tests
│   └── user.test.js
├── .env             // Environment variables
└── app.js           // Entry point

```
