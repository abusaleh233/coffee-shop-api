# Coffee Shop API (NestJS + Prisma + Neon)

Demo accounts:
- admin@coffee.com / Admin@123
- manager@coffee.com / Manager@123
- user@coffee.com / User@1234

Endpoints:
- POST /auth/register, POST /auth/login
- GET /users/me, PATCH /users/me/image, GET /users (ADMIN), PATCH /users/:id/role (ADMIN), DELETE /users/:id (ADMIN)
- GET /products, GET /products/:id, POST/PATCH/DELETE /products (MANAGER, ADMIN; multipart field `image`)
- POST /orders, GET /orders/my, GET /orders (MANAGER, ADMIN), PATCH /orders/:id/status (MANAGER, ADMIN)
