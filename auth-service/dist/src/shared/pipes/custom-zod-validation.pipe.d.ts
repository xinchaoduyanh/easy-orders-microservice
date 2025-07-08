declare const CustomZodValidationPipe: new (schemaOrDto?: import("zod").ZodType | import("nestjs-zod").ZodDto) => import("@nestjs/common").PipeTransform;
export default CustomZodValidationPipe;
