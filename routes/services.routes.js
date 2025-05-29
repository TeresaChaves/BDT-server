const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const {
  getServices,
  getOneService,
  saveService,
  editService,
  deleteService,
  postRate,
  getRate,
} = require("../controllers/services.controllers");

router.get("/allServices", getServices);
router.get("/serviceDetails/:service_id", getOneService);
router.post("/addService", isAuthenticated, saveService);
router.put("/edit-service/:service_id", editService);
router.delete("/delete-service/:service_id", isAuthenticated, deleteService);
router.post("/rate/:serviceId", isAuthenticated, postRate);
router.get("/rate/:serviceId", getRate);

module.exports = router;
