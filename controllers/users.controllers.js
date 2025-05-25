const router = require("express").Router();

const User = require("./../models/User.model");
const Service = require("./../models/Service.model");

// const updateHours = (req, res, next) => {
//   let hours = parseInt(req.body.hours, 10);
//   if (isNaN(hours) || hours <= 0) {
//     return res
//       .status(400)
//       .json({ error: "La cantidad de horas debe ser mayor a cero" });
//   }

//   const user_id = req.payload._id;
//   const { owner } = req.params;
//   let hoursOwner;
//   let hoursLoggedUser;
//   let hoursSumOwner;
//   let hoursSubLoggedUser;
//   User.findById(owner)

//     .then((ownerData) => {
//       hoursOwner = ownerData.bankAccountTime;
//       return User.findById(user_id);
//     })
//     .then((userData) => {
//       hoursLoggedUser = userData.bankAccountTime;
//       hoursSumOwner = hoursOwner + hours;
//       hoursSubLoggedUser = hoursLoggedUser - hours;

//       if (hoursLoggedUser < hours) {
//         res
//           .status(200)
//           .json({
//             error: "No tienes suficientes horas para contratar el servicio",
//           });
//       } else {
//         return User.findByIdAndUpdate(
//           owner,
//           { bankAccountTime: hoursSumOwner },
//           { new: true }
//         );
//       }
//     })
//     .then(() => {
//       if (hoursLoggedUser < hours) {
//         res
//           .status(200)
//           .json({
//             error: "No tienes suficientes horas para contratar el servicio",
//           });
//       } else {
//         return User.findByIdAndUpdate(
//           user_id,
//           { bankAccountTime: hoursSubLoggedUser },
//           { new: true }
//         );
//       }
//     })
//     .then((user) => res.json(user))
//     .catch((error) => {
//       next(error);
//     });
// };

const getUserHours = (req, res, next) => {
  const { user_id } = req.params;

  User.findById(user_id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(user.bankAccountTime);
    })
    .catch((error) => {
      next(error);
    });
};

const getServicesContract = (req, res, next) => {
  const { user_id } = req.params;

  User.findById(user_id)
    .populate("servicesContract.service")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const filteredServices = user.servicesContract
        .filter((sc) => sc.service !== null)
        .map((sc) => ({
          service: sc.service,
          date: sc.date,
          status: sc.status,
          hours: sc.hours,
          owner: sc.owner,
        }));

      res.json(filteredServices);
    })
    .catch((error) => next(error));
};

//

const saveServiceContract = async (req, res, next) => {
  const { service_id, hours } = req.body; // Las horas y el servicio vienen en el cuerpo de la solicitud
  const user_id = req.payload._id;

  try {
    // Verificar si las horas son válidas
    if (!hours || isNaN(hours) || hours <= 0) {
      return res
        .status(400)
        .json({ error: "La cantidad de horas debe ser mayor a cero" });
    }

    //validaciones de si existe el usuario y el service existe

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const service = await Service.findById(service_id);
    if (!service)
      return res.status(404).json({ error: "Servicio no encontrado" });

    //saco el onwner_id del service
    const owner_id = service.owner;

    // Lógica para verificar las horas del cliente y del dueño
    let hoursOwner;
    let hoursLoggedUser;
    let hoursSumOwner;
    let hoursSubLoggedUser;

    // Obtenemos las horas del dueño
    const ownerData = await User.findById(owner_id);
    hoursOwner = ownerData.bankAccountTime;

    // Obtenemos las horas del cliente
    hoursLoggedUser = user.bankAccountTime;

    // Calcular el nuevo saldo de horas
    hoursSumOwner = hoursOwner + hours;
    hoursSubLoggedUser = hoursLoggedUser - hours;

    // Verificar si el servicio ya ha sido contratado por el usuario
    const alreadyContracted = user.servicesContract?.some(
      (contract) => contract?.service?.toString() === service_id
    );
    if (alreadyContracted) {
      return res.status(400).json({ error: "Ya has contratado este servicio" });
    }

    // Verificar si el cliente tiene suficientes horas
    if (user.bankAccountTime < hours) {
      return res.status(400).json({
        error: "No tienes suficientes horas para contratar el servicio",
      });
    }

    // ✅ Actualizar balances con $inc (evita errores de suma manual)
    await User.findByIdAndUpdate(owner_id, {
      $inc: { bankAccountTime: hours },
    });
    await User.findByIdAndUpdate(user_id, {
      $inc: { bankAccountTime: -hours },
    });

    // Crear el contrato para el cliente
    const newContract = {
      service: service_id,
      date: new Date(),
      status: "pendiente",
      owner: owner_id,
      hours,
    };

    // Crear la solicitud de servicio para el dueño
    const newReceived = {
      client: user_id,
      service: service_id,
      date: new Date(),
      hours,
      status: "pendiente",
    };

    // 1. Agregar contrato al cliente
    await User.findByIdAndUpdate(user_id, {
      $push: { servicesContract: newContract },
    });

    // 2. Agregar solicitud al dueño
    await User.findByIdAndUpdate(owner_id, {
      $push: { servicesReceived: newReceived },
    });

    res.status(201).json({ message: "Servicio contratado correctamente" });
  } catch (error) {
    next(error);
  }
};

///get de las peticiones de los demás usuarios a los servicios que yo he subido

const getServiceRequests = (req, res, next) => {
  const owner_id = req.payload._id;

  User.findById(owner_id)
    .populate("servicesReceived.service")
    .populate("servicesReceived.client")
    .then((owner) => {
      if (!owner) {
        return res.status(404).json({ message: "Owner no encontrado" });
      }

      const pendingRequests = owner.servicesReceived
        // .filter((request) => request.status === "pendiente")
        .map((request) => ({
          contractId: request._id,
          client: {
            _id: request.client._id,
            name: request.client.name,
          },
          service: request.service,
          date: request.date,
          hours: request.hours,
          status: request.status,
        }));

      res.json(pendingRequests);
    })
    .catch((error) => next(error));
};

const acceptServiceContract = async (req, res, next) => {
  const cleanId = (id) =>
    id
      ?.toString()
      .trim()
      .replace(/^:/, "")
      .replace(/[^a-fA-F0-9]/g, "");

  const clientId = cleanId(req.body.clientId);
  const serviceId = cleanId(req.body.serviceId);
  const ownerId = cleanId(req.payload._id);

  try {
    const client = await User.findById(clientId);
    const owner = await User.findById(ownerId);

    if (!client || !owner) {
      return res.status(404).json({ error: "Cliente u Owner no encontrado" });
    }

    // Actualizar en el cliente
    const contract = client.servicesContract.find(
      (c) =>
        c.service &&
        c.owner &&
        c.service.toString() === serviceId &&
        c.owner.toString() === ownerId &&
        c.status === "pendiente"
    );

    if (!contract) {
      return res
        .status(404)
        .json({ error: "Contrato no encontrado o ya aceptado" });
    }

    contract.status = "aceptado";
    client.markModified("servicesContract");

    // Actualizar en el owner
    const ownerContract = owner.servicesReceived.find(
      (c) =>
        c.service &&
        c.client &&
        c.service.toString() === serviceId &&
        c.client.toString() === clientId &&
        c.status === "pendiente"
    );

    if (ownerContract) {
      ownerContract.status = "aceptado";
      owner.markModified("servicesReceived");
      console.log(ownerContract.status);
    }

    await client.save();
    await owner.save();

    res.json({ message: "Contrato aceptado correctamente" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  //   updateHours,
  getUserHours,
  getServicesContract,
  saveServiceContract,
  getServiceRequests,
  acceptServiceContract,
};
