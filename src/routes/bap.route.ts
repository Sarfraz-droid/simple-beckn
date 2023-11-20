import express from 'express';
import * as BAPController from "@/controller/bap.controller"

export const router = express.Router();

router.use((req, res, next) => {
    // console.log(req)
    console.log(req.body,req.headers)
    res.on('finish', () => {
        console.log(`[${req.method}] ${req.originalUrl} ${res.statusCode}`)
    });
    next()
})

router.post('/search', BAPController.EVENT({ action: 'search' }))
router.post('/select', BAPController.EVENT({ action: 'select' }))
router.post('/init', BAPController.EVENT({ action: 'init' }))
router.post('/confirm', BAPController.EVENT({ action: 'confirm' }))
router.post('/status', BAPController.EVENT({ action: 'status' }))

router.post('/on_search', BAPController.ON_EVENT({ type: 'search' }))
router.post('/on_select', BAPController.ON_EVENT({ type: 'select' }))
router.post('/on_init', BAPController.ON_EVENT({ type: 'init' }))
router.post('/on_confirm', BAPController.ON_EVENT({ type: 'confirm' }))
router.post('/on_status', BAPController.ON_EVENT({ type: 'status' }))