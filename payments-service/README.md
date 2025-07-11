<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Payment Service

Payment service với tính năng quản lý tài khoản người dùng và xử lý thanh toán.

## Tính năng

- **Quản lý tài khoản người dùng**: Tạo tài khoản, kiểm tra số dư, nạp/rút tiền
- **Xử lý thanh toán**: Kiểm tra số dư và xử lý thanh toán đơn hàng
- **Lịch sử giao dịch**: Theo dõi tất cả các giao dịch của người dùng
- **Hoàn tiền**: Hỗ trợ hoàn tiền cho các đơn hàng đã thanh toán
- **Kafka Integration**: Nhận sự kiện đơn hàng từ Orders Service

## Cài đặt

```bash
npm install
```

## Cấu hình Database

1. Tạo file `.env` với các biến môi trường:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/payments_db"
KAFKA_BROKER=kafka:9093
PORT=3003
```

2. Tạo database và chạy migration:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Chạy ứng dụng

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### Quản lý tài khoản

#### Tạo tài khoản mới

```http
POST /payments/accounts
Content-Type: application/json

{
  "email": "user@example.com",
  "initialBalance": 1000
}
```

#### Xem số dư

```http
GET /payments/accounts/{email}/balance
```

#### Nạp tiền

```http
PATCH /payments/accounts/{email}/deposit
Content-Type: application/json

{
  "amount": 500
}
```

#### Rút tiền

```http
PATCH /payments/accounts/{email}/withdraw
Content-Type: application/json

{
  "amount": 200
}
```

#### Xem lịch sử giao dịch

```http
GET /payments/accounts/{email}/transactions
```

#### Hoàn tiền

```http
POST /payments/refund/{orderId}
Content-Type: application/json

{
  "userEmail": "user@example.com"
}
```

## Kafka Events

### Consumer

- **Topic**: `order_events`
- **Payload**:

```json
{
  "orderId": "string",
  "amount": "number",
  "userEmail": "string"
}
```

### Producer

- **Topic**: `payment_results`
- **Payload**:

```json
{
  "orderId": "string",
  "status": "confirmed" | "declined"
}
```

## Database Schema

### UserAccount

- `id`: String (Primary Key)
- `email`: String (Unique)
- `balance`: Float (Default: 0)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Transaction

- `id`: String (Primary Key)
- `userAccountId`: String (Foreign Key)
- `orderId`: String
- `amount`: Float
- `type`: TransactionType (PAYMENT, REFUND, DEPOSIT, WITHDRAWAL)
- `status`: TransactionStatus (PENDING, COMPLETED, FAILED, CANCELLED)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Logic xử lý thanh toán

1. **Kiểm tra tài khoản**: Tự động tạo tài khoản nếu chưa tồn tại
2. **Kiểm tra số dư**: So sánh số dư hiện tại với số tiền cần thanh toán
3. **Xử lý thanh toán**:
   - Nếu đủ tiền: Trừ tiền và tạo giao dịch thành công
   - Nếu không đủ: Tạo giao dịch thất bại và từ chối thanh toán
4. **Gửi kết quả**: Gửi kết quả về Orders Service qua Kafka

## Development

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```
