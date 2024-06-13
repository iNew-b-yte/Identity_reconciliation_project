const express = require("express");
const router = express.Router();

const asyncMiddle = require("../middleware/asyncMiddleware");
const identityReconciliationService = require("../services/identityRecon");


router.post("/", asyncMiddle(async (req, res) => {
    const { email, phoneNumber } = req.body;

    const responseObj = await identityReconciliationService(email, phoneNumber);

    res.status(200).send(responseObj);
}));

module.exports = router;