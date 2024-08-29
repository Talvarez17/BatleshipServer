const { clientsHelperFunctionGenerator } = require("./models/helpers");

const io = require("socket.io")({
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const clients = {};
const viewers = {};

io.on("connection", (socket) => {
  
  const { addClient, removeClient, newGame, sendShips, shot, end, lista, addVisitor, updateViewer } = clientsHelperFunctionGenerator(clients, socket, io, viewers);
  
  socket.on("newGame", newGame);
  
  socket.on("ships", sendShips);
  
  socket.on("shot", shot);
  
  socket.on("end", end);
  
  socket.on("disconnect", removeClient);
  
  socket.on("viewer-states", updateViewer);

  socket.on("view-game", (data) => {
    addVisitor(data[0], data[1]);
  });

  socket.on("seleccion", (data) => {

    switch (data.type) {

      case "PLAYER":

        addClient();

        console.log("Eres un jugador");

        break;

      case "VIEWER":

        //Removemos el cliente si por alguna razon y estaba registrados
        removeClient();

        socket.on("obtener-partidas", lista);



        console.log("Eres un visitante");

        break;

      default:
        break;
    }
  })

});

io.listen(3001);
