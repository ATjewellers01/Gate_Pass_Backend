# Feature-Based Backend Folder Structure

A clean, scalable, and maintainable backend architecture organized by **features/domains** rather than technical layers.

---

## 📁 Root Structure

```
backend/
├── config/
├── shared/
├── features/
├── middlewares/
├── utils/
├── logs/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

---

## 📂 Detailed Breakdown

```
backend/
│
├── config/                          # App-wide configuration
│   ├── app.config.js                # App settings (port, env, etc.)
│   ├── db.config.js                 # Database connection config
│   ├── cors.config.js               # CORS options
│   ├── jwt.config.js                # JWT secret & expiry
│   └── multer.config.js             # File upload config
│
├── shared/                          # Shared code across features
│
├── features/                        # 🔑 Core: all business features
│   │
│   ├── auth/                        # Authentication & authorization
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.routes.js
│   │   ├── auth.validator.js
│   │   └── auth.test.js
│   │
│   └── user/                        # User management
│       ├── user.controller.js
│       ├── user.service.js
│       ├── user.routes.js
│       ├── user.validator.js
│       ├── user.model.js
│       └── user.test.js
│
├── middlewares/                     # Express/global middlewares
│   ├── auth.middleware.js           # JWT/session guard
│   ├── role.middleware.js           # RBAC / role checking
│   ├── error.middleware.js          # Global error handler
│   ├── rateLimiter.middleware.js    # Rate limiting
│   ├── logger.middleware.js         # Request logging
│   └── validate.middleware.js       # Request validation handler
│
├── utils/                           # Helper utilities
│   ├── response.util.js             # Standard API response formatter
│   ├── logger.util.js               # App logger (winston/pino)
│   ├── pagination.util.js           # Pagination helper
│   ├── token.util.js                # JWT generate/verify helpers
│   ├── hash.util.js                 # Bcrypt/hashing helpers
│   ├── email.util.js                # Email sender (nodemailer)
│   └── date.util.js                 # Date formatting helpers
│

├── logs/                            # Log files (auto-generated)
│   ├── error.log
│   └── combined.log
│
├── .env                             # Environment variables
├── .env.example                     # Env template for devs
├── .gitignore
├── package.json
└── server.js                        # App entry point & route registry
```

---

## 🗂️ Feature Folder Convention

Each feature is **fully self-contained**:

| File                       | Responsibility                              |
|----------------------------|---------------------------------------------|
| `*.controller.js`          | Handles HTTP request/response logic         |
| `*.service.js`             | Core business logic                         |
| `*.routes.js`              | Route definitions & middleware binding      |
| `*.validator.js`           | Request schema validation (Joi/Zod/express-validator) |
| `*.model.js`               | Database model/schema (Mongoose/Sequelize)  |
| `*.test.js`                | Unit & integration tests for that feature   |

---

## 🔗 Route Registry (`server.js`)

```js
// server.js — central route mounting
app.use('/api/auth',          require('./features/auth/auth.routes'));
app.use('/api/users',         require('./features/user/user.routes'));
```

---

## ✅ Benefits of This Structure

- **Scalable** — Add new features without touching existing code
- **Team-friendly** — Each team/dev owns a feature folder independently
- **Testable** — Feature-level tests co-located with the code
- **Readable** — No guessing where logic lives; everything is domain-grouped
- **Refactorable** — A feature can be extracted to a microservice easily

---

## 📌 Notes

- Add new features by simply creating a new folder under `features/`
- `shared/` and `utils/` should contain **only** code used by 2+ features
- Avoid cross-feature imports; communicate via services if needed
- Use an index/barrel file (`index.js`) inside each feature if the module grows large
