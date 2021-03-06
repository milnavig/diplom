const HTTPServer = require("moleculer-web"); // API gateway

module.exports = {
  name: "api",
  mixins: [HTTPServer],

  settings: {
	// Exposed port
	port: 3000,

	// Exposed IP
	ip: "0.0.0.0",
    // Global CORS settings for all routes
    cors: {
      // Configures the Access-Control-Allow-Origin CORS header.
      origin: "*",
      // Configures the Access-Control-Allow-Methods CORS header. 
      methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
      // Configures the Access-Control-Allow-Headers CORS header.
      allowedHeaders: [],
      // Configures the Access-Control-Expose-Headers CORS header.
      exposedHeaders: [],
      // Configures the Access-Control-Allow-Credentials CORS header.
      credentials: false,
      // Configures the Access-Control-Max-Age CORS header.
      maxAge: 3600
    },
    
    routes: [{
      path: "/public",
      aliases: {
        "POST /addPatient": "PatientService.addPatient",
        "GET /getPatientInfo": "PatientService.getPatient",
        "DELETE /deletePatient": "PatientService.deletePatient",
        "POST /addDoctor": "DoctorService.addDoctor",
        "POST /assign": "DoctorService.assign",
      }
    }]
  }
}
  