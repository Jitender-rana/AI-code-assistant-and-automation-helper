import express from "express"
import { issueClassifier, summarizePR } from "../controller/toolController";

const router = express.Router();

router.post("/summarizePR", summarizePR)
router.post("/issueClassifier", issueClassifier)

export default router