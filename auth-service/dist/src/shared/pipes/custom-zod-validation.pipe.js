"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const nestjs_zod_1 = require("nestjs-zod");
const CustomZodValidationPipe = (0, nestjs_zod_1.createZodValidationPipe)({
    createValidationException: (error) => {
        return new common_1.UnprocessableEntityException(error.errors.map((error) => {
            return {
                ...error,
                path: error.path.join('.'),
            };
        }));
    },
});
exports.default = CustomZodValidationPipe;
//# sourceMappingURL=custom-zod-validation.pipe.js.map