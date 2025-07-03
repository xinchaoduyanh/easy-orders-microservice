// .eslintrc.js
module.exports = {
  root: true, // Đây là cấu hình gốc cho monorepo
  env: {
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      './orders-app/tsconfig.json', // Đường dẫn tới tsconfig của orders-app
      './payments-app/tsconfig.json', // Đường dẫn tới tsconfig của payments-app
    ],
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Kết hợp Prettier vào ESLint
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    'prettier/prettier': [
      // Tùy chỉnh quy tắc Prettier trong ESLint
      'error',
      {
        endOfLine: 'auto', // Tự động xử lý ký tự xuống dòng (quan trọng cho Windows/Linux)
      },
    ],
    // Thêm các quy tắc khác nếu cần
  },
  // Cấu hình overrides để ESLint biết cách xử lý các thư mục con
  overrides: [
    {
      files: ['orders-app/**/*.ts'],
      parserOptions: {
        project: ['./orders-app/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      // Bạn có thể thêm các quy tắc cụ thể cho orders-app tại đây nếu muốn
    },
    {
      files: ['payments-app/**/*.ts'],
      parserOptions: {
        project: ['./payments-app/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      // Bạn có thể thêm các quy tắc cụ thể cho payments-app tại đây nếu muốn
    },
    // Sau này nếu có frontend (Next.js)
    // {
    //   files: ['frontend-app/**/*.{ts,tsx}'],
    //   parserOptions: {
    //     project: ['frontend-app/tsconfig.json'],
    //     tsconfigRootDir: __dirname,
    //   },
    //   extends: [
    //     'plugin:react/recommended',
    //     // ... các config khác cho React/Next.js
    //   ],
    //   settings: {
    //     react: {
    //       version: 'detect',
    //     },
    //   },
    // },
  ],
};
