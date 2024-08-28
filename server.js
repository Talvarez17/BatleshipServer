const { clientsHelperFunctionGenerator } = require("./models/helpers");

const io = require("socket.io")({
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const clients = {};

io.on("connection", (socket) => {

  const { addClient, removeClient, newGame, sendShips, shot, end, lista, addVisitor } = clientsHelperFunctionGenerator(clients, socket, io);


  socket.on("seleccion", (data) => {

    switch (data.type) {

      case "PLAYER":

        addClient();

        socket.on("newGame", newGame);

        socket.on("ships", sendShips);

        socket.on("shot", shot);

        socket.on("end", end);

        socket.on("disconnect", removeClient);

        console.log("Eres un jugador");
        
        break;

      case "VIEWER":

        //Removemos el cliente si por alguna razon y estaba registrados
        removeClient();

        socket.on("obtener-partidas", lista)

        socket.on("viewGame", (data) => {
          addVisitor(data[0], data[1]);
        });

        console.log("Eres un visitante");

        break;

      default:
        break;
    }
  })

});

io.listen(3001);
