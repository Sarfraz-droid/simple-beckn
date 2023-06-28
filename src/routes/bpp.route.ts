import express from "express"
import * as BPPController from "@/controller/bpp.controller"

export const router = express.Router();

router.post('/search', BPPController.search);
router.post('/select', BPPController.select);