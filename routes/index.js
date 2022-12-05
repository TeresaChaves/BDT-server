module.exports = app => {
    const servicesRoutes = require("./services.routes");
    app.use("/api/services", servicesRoutes)

    // const authRoutes = require("./auth.routes");
    // app.use("/api/auth", authRoutes)
}