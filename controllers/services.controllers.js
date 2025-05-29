const router = require("express").Router();

const Service = require("./../models/Service.model");
const User = require("./../models/User.model");

const getServices = (req, res) => {
  let query;
  if (req.query.user === "undefined") {
    query = {};
  } else {
    query = {
      owner: req.query.user,
    };
  }
  Service.find(query)
    .select({ name: 1, image: 1, owner: 1, ratings: 1 })
    .then((services) => {
      const servicesWithRating = services.map((s) => s.toJSON());
      res.json(servicesWithRating);
    })
    .catch((err) => res.status(500).json(err));
};

const getOneService = (req, res, next) => {
  const { service_id } = req.params;

  Service.findById(service_id)
    .populate("owner")
    .then((service) => {
      if (!service)
        return res.status(404).json({ error: "Servicio no encontrado" });
      res.json(service.toJSON()); // Activar virtuales
    })
    .catch((err) => next(err));
};

const saveService = (req, res, next) => {
  const { name, description, image, date, status, disponibility } = req.body;
  const { _id: owner } = req.payload;

  Service.create({
    name,
    description,
    image,
    date,
    status,
    owner,
    disponibility,
  })
    .then((response) => res.json(response))
    .catch((err) => next(err));
};

const editService = (req, res, next) => {
  const { service_id } = req.params;
  const { name, description, image, disponibility } = req.body;

  Service.findByIdAndUpdate(
    service_id,
    { name, description, image, disponibility },
    { new: true }
  )
    .then((response) => res.json(response))
    .catch((error) => {
      next(error);
    });
};

const deleteService = (req, res, next) => {
  const { service_id } = req.params;

  Service.findByIdAndDelete(service_id)
    .then((response) => res.json(response))
    .catch((error) => {
      next(error);
    });
};
const getRate = async (req, res, next) => {
  const { serviceId } = req.params;

  try {
    const service = await Service.findById(serviceId).populate(
      "ratings.client",
      "name"
    );
    if (!service)
      return res.status(404).json({ error: "Servicio no encontrado." });

    res.json(service.ratings);
  } catch (error) {
    next(error);
  }
};

const postRate = async (req, res, next) => {
  const { serviceId } = req.params;
  const { rating, comment } = req.body;
  const clientId = req.payload._id;

  try {
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "La valoración debe ser entre 1 y 5." });
    }

    const service = await Service.findById(serviceId);
    if (!service)
      return res.status(404).json({ error: "Servicio no encontrado." });

    // Evitar que un usuario valore más de una vez el mismo servicio
    const alreadyRated = service.ratings.some(
      (r) => r.client.toString() === clientId.toString()
    );
    if (alreadyRated) {
      return res.status(400).json({ error: "Ya has valorado este servicio." });
    }

    service.ratings.push({
      client: clientId,
      rating,
      comment,
    });

    await service.save();
    await User.findByIdAndUpdate(clientId, {
      $pull: {
        servicesContract: {
          service: serviceId,
          status: "finalizado",
        },
      },
    });

    res.status(201).json({ message: "Valoración registrada correctamente." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getOneService,
  saveService,
  editService,
  getRate,
  postRate,
  deleteService,
};
