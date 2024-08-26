const { clientsHelperFunctionGenerator } = require("./models/helpers");

const io = require("socket.io")({
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const clients = {};

// Definimos lo que sucede con cada conexión
io.on("connection", (socket) => {

  // Destructuramos los datos que se obtienen del helper
  const { addClient, removeClient, newGame, sendShips, shot, end, lista, addVisitor } = clientsHelperFunctionGenerator(clients, socket, io);
  
  addClient();

  socket.on("newGame", newGame);

  socket.on("ships", sendShips);

  socket.on("shot", shot);

  socket.on("end", end);

  socket.on("disconnect", removeClient);

  socket.on("viewGame", (data) => {
     addVisitor(data[0], data[1]);
  });

  socket.on("obtener-partidas", lista)
});

io.listen(3001);
