module.exports = app => {
    const servicesRoutes = require("./services.routes");
    app.use("/api/services", servicesRoutes)

    const authRoutes = require("./auth.routes");
    app.use("/api/auth", authRoutes)

    const uploadRoutes = require("./upload.routes");
    app.use("/api/upload", uploadRoutes)

    const uploadUserRoutes = require("./users.routes");
    app.use("/api/uploadHours", uploadUserRoutes)

 


}

