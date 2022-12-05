Server table

|PATH|METHOD|DESCRIPTION|
|----|------|---------|
|/api/services/allServices|GET|show all the services in the timebank|
|/api/services/serviceDetails/:service_id|GET|details of a specific service|
|/api/services/hireService/:service_id|POST|hiring the service of another user|
|/api/services/payservice/:service_id|POST|pay the service with the hours in your bank
|/api/services/addService|POST|create new service in the timebank|
|/api/services/editService|PUT|edit service thath you give to the bank|
|/api/services/deleteService|DELETE|delete service thath you give to the bank|
|/api/auth/signup|POST|register new user|
|/api/auth/login|POST|login to the user's session|
|/api/auth/verify|GET|verify user and session|

Client Table

|PATH|DESCRIPTION|PROTECTED|
|----|------|---------|
|/|main page of the app|❌|
|/servicios|a list with all the services in the bank|❌|
|/servicios/detalles/:service_id|Details of the specific service|✅|
|/servicios/contratar/:service_id|End of the service and pay button to balance the accounts|✅|
|/servicios/nuevo-servicio|Create a new service|✅|
|/servicios/editar-servicio/:service_id|Edit or update the info of this service|✅|
|/usuario/registro|Signup user|✅|
|/usuario/iniciar-sesion|Login user|✅|
|/usuario/mi-perfil|Personal profile of the user|✅|
|*|404 eror view page|❌|