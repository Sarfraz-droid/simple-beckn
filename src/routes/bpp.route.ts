import express, { NextFunction, Request, Response } from "express"
import * as BPPController from "@/controller/bpp.controller"
import * as OpenApiValidator from 'express-openapi-validator';

export const router = express.Router();

router.use(
    OpenApiValidator.middleware({
        apiSpec: './schemas/core.yaml',
        validateRequests: true,
        validateResponses: true,
        $refParser: {
            mode: 'dereference'
        },
    })
)

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // format error
    if (err !== null && err !== undefined) {
        console.log(err);
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors,
        });
        return;
    }

    next();


});

router.post('/search', BPPController.EVENT({
    action: 'search',
    response_action: 'on_search'
}));
router.post('/select', BPPController.EVENT({
    action: 'select',
    response_action: 'on_select'
}));


router.post('/init', BPPController.EVENT({
    action: 'init',
    response_action: 'on_init'
}))

router.post('/confirm', BPPController.EVENT({
    action: 'confirm',
    response_action: 'on_confirm'
}))