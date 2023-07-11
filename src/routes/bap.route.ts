import express from 'express';
import * as BAPController from "@/controller/bap.controller"

export const router = express.Router();

router.post('/search', BAPController.EVENT({ action: 'search' }))
router.post('/select', BAPController.EVENT({ action: 'select' }))
router.post('/init', BAPController.EVENT({ action: 'init' }))
router.post('/confirm', BAPController.EVENT({ action: 'confirm' }))

router.post('/on_search', BAPController.ON_EVENT({ type: 'search' }))
router.post('/on_select', BAPController.ON_EVENT({ type: 'select' }))
router.post('/on_init', BAPController.ON_EVENT({ type: 'init' }))
router.post('/on_confirm', BAPController.ON_EVENT({ type: 'confirm' }))