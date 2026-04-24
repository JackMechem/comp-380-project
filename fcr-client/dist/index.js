"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.browserApi = exports.ApiError = exports.parseResponse = exports.buildQuery = void 0;
// Types
__exportStar(require("./types"), exports);
// Utilities
var core_1 = require("./core");
Object.defineProperty(exports, "buildQuery", { enumerable: true, get: function () { return core_1.buildQuery; } });
Object.defineProperty(exports, "parseResponse", { enumerable: true, get: function () { return core_1.parseResponse; } });
Object.defineProperty(exports, "ApiError", { enumerable: true, get: function () { return core_1.ApiError; } });
// Browser client (safe for client components)
var browser_1 = require("./browser");
Object.defineProperty(exports, "browserApi", { enumerable: true, get: function () { return browser_1.browserApi; } });
