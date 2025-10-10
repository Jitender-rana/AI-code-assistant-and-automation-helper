"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const toolController_1 = require("../controller/toolController");
const router = express_1.default.Router();
router.post("/summarizePR", toolController_1.summarizePR);
exports.default = router;
