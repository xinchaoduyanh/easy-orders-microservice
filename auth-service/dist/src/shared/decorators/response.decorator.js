"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseNoContent = exports.ApiResponseAccepted = exports.ApiResponseCreated = exports.ApiResponseOk = exports.ApiResponse = exports.RESPONSE_METADATA_KEY = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
exports.RESPONSE_METADATA_KEY = 'response_metadata';
const ApiResponse = (options = {}) => {
    return (0, common_1.SetMetadata)(exports.RESPONSE_METADATA_KEY, {
        status: options.status || common_2.HttpStatus.OK,
        message: options.message,
    });
};
exports.ApiResponse = ApiResponse;
const ApiResponseOk = (message) => (0, exports.ApiResponse)({ status: common_2.HttpStatus.OK, message });
exports.ApiResponseOk = ApiResponseOk;
const ApiResponseCreated = (message) => (0, exports.ApiResponse)({ status: common_2.HttpStatus.CREATED, message });
exports.ApiResponseCreated = ApiResponseCreated;
const ApiResponseAccepted = (message) => (0, exports.ApiResponse)({ status: common_2.HttpStatus.ACCEPTED, message });
exports.ApiResponseAccepted = ApiResponseAccepted;
const ApiResponseNoContent = () => (0, exports.ApiResponse)({ status: common_2.HttpStatus.NO_CONTENT });
exports.ApiResponseNoContent = ApiResponseNoContent;
//# sourceMappingURL=response.decorator.js.map