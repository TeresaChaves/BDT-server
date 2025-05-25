const router = require("express").Router();

const uploader = require("./../config/cloudinary.config");

router.post("/image", uploader.single("imageData"), (req, res) => {
  if (!req.file) {
    res.status(500).json({ errorMessage: "Error caragndo el archivo" });
    return;
  }

  // URL original de Cloudinary
  const originalUrl = req.file.path;

  // Insertamos parámetros de optimización en la URL
  const optimizedUrl = originalUrl.replace(
    "/upload/",
    "/upload/q_auto,f_auto,w_600/"
  );

  // Devolvemos la URL optimizada al frontend
  res.json({ cloudinary_url: optimizedUrl });
});

module.exports = router;
