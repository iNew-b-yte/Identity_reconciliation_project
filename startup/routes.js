const express = require("express");
const error = require("../middleware/error");

const identityRecon = require("../routes/identityRecon");

module.exports = function (app) {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static("public"));
    app.use(express.json());
    app.use("/identity", identityRecon);
    app.use(error);
}