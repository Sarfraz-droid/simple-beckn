import express from 'express';
import * as BAPController from "@/controller/bap.controller"
import { BECKN_ACTION } from '@/utils/constant';

export const router = express.Router();

router.use((req, res, next) => {
    // console.log(req)
    res.on('finish', () => {
        console.log(`[${req.method}] ${req.originalUrl} ${res.statusCode}`)
    });
    next()
})

router.post('/search', BAPController.EVENT({ action: BECKN_ACTION.SEARCH }))
router.post('/select', BAPController.EVENT({ action: BECKN_ACTION.SELECT }))
router.post('/init', BAPController.EVENT({ action: BECKN_ACTION.INIT }))
router.post('/confirm', BAPController.EVENT({ action: BECKN_ACTION.CONFIRM }))
router.post('/status', BAPController.EVENT({ action: BECKN_ACTION.STATUS }))

router.post('/on_search', BAPController.ON_EVENT({ type: 'search' }))
router.post('/on_select', BAPController.ON_EVENT({ type: 'select' }))
router.post('/on_init', BAPController.ON_EVENT({ type: 'init' }))
router.post('/on_confirm', BAPController.ON_EVENT({ type: 'confirm' }))
router.post('/on_status', BAPController.ON_EVENT({ type: 'status' }))