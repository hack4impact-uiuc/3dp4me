const express = require("express");
const router = express.Router();
const { errorWrap } = require("../../utils");

router.get(
    '/',
    errorWrap(async (req, res) => {
        console.log("Hello World!");
        res.status(200).json({
            code: 200,
            success: true,
            result: "hi",
        });
    }),
);

module.exports = router;
