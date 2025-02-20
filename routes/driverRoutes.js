const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");
const auth = require("../middlewares/auth");

console.log("driverRoutes cargado correctamente");

// Ruta protegida con el middleware auth
router.post("/conductores", auth, driverController.createRecord);
router.get("/conductores", auth, driverController.getAllRecords);
router.put("/conductores/:id", auth, driverController.updateRecord);
router.delete("/conductores/:id", auth, driverController.deleteRecord);
router.get('/conductores', auth, driverController.getUserRecords);


module.exports = router;
