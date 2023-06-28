import express from 'express';
import * as BAPController from "@/controller/bap.controller"

export const router = express.Router();

router.post('/search', BAPController.search)
router.post('/on_search', BAPController.onSearch)