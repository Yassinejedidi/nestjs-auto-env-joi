
# 🚀 nestjs-auto-env-joi

Auto Joi validation schema generation for `.env` files in NestJS projects.  
👉 Save time by auto-generating your validation schema from comments in your `.env` file!

---

## ✨ Features

- ✅ Supports basic types: `string`, `number`, `boolean`, `email`, `date`.
- ✅ Supports `enum` with allowed values → `// enum:admin|user|guest`.
- ✅ Supports optional variables → `// optional`.
- ✅ Automatically marks variables as `required` by default.
- ✅ Works seamlessly with `@nestjs/config`'s `validationSchema`.
- 🛑 **If you forget to add a type tag**, the server will throw an error at startup and tell you exactly which line to fix!

---

## 📦 Installation

```bash
npm install nestjs-auto-env-joi
# or
yarn add nestjs-auto-env-joi
```

---

## 🛠️ Usage Example in NestJS

Create a `.env` file in your project root with type annotations as comments:

```env
// string
DATABASE_URL=postgres://example

// optional
PORT=3000

// enum:admin|user|guest
USER_ROLE=admin

// boolean
DEBUG=true
```

Then import and use `AutoEnvValidation` in your `AppModule`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AutoEnvValidation } from 'nestjs-auto-env-joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: AutoEnvValidation({
        envPath: '.env', // Optional, defaults to '.env'
      }),
    }),
  ],
})
export class AppModule {}
```

---

## 🏷️ Supported Type Tags

| 🏷️ Type Tag | 📝 Description | 🧑‍💻 Example Annotation        |
|-------------|----------------|------------------------------|
| `string`    | Validates as a string (required) | `// string` |
| `number`    | Validates as a number (required) | `// number` |
| `boolean`   | Validates as a boolean (required) | `// boolean` |
| `email`     | Validates as a valid email string (required) | `// email` |
| `date`      | Validates as a valid date (required) | `// date` |
| `enum`      | Validates string in allowed values (required) | `// enum:admin\|user\|guest` |
| `optional`  | Validates as optional  | `// optional` |

---

## ⚠️ Important Notes

- 🚨 **Each environment variable must have a type tag** comment line starting with `//` directly above it.
- 🚨 **If you forget a type tag, your NestJS server will not start and will throw an error showing the line number you need to fix.**
- `enum` tags **must** include allowed pipe-separated values.
- All variables are required by default unless marked with `// optional`.
- The `.env` file must exist at the path provided (default `.env`).

---

## 📄 License

MIT

---

## ✍️ Author

[Yassine Jdidi](mailto:yassinejedidi10@gmail.com)

---

❤️ **Happy coding with strong env validation!**