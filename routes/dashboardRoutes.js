const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboardController");

// Ruta para obtener los datos del Dashboard
router.get("/", getDashboardData);

module.exports = router;