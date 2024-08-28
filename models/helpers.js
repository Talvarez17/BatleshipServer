const getKeys = (clients) => Object.keys(clients);

const clientsHelperFunctionGenerator = (clients, socket, io, viewers) => {

    const getSocketById = (id) => io.sockets.sockets.get(id);

    const addClient = (avoidOpponent) => {

        const keys = getKeys(clients);

        console.log(clients)

        for (let i = 0; i < keys.length; i++) {
            const otherSocketId = keys[i];

            const otherSocketOpponent = clients[otherSocketId];

            if (!otherSocketOpponent && otherSocketId !== avoidOpponent) {
                clients[otherSocketId] = socket.id;
                clients[socket.id] = otherSocketId;
                i = keys.length;
                const otherSocket = getSocketById(otherSocketId);
                otherSocket.emit("opponent", socket.id);
            }
        }

        const newKey = getKeys(clients);
        if (!newKey.includes(socket.id)) {
            clients[socket.id] = null;
        }

        socket.emit("opponent", clients[socket.id]);
        socket.emit('partidas-actuales', clients);

    };

    const removeClient = () => {

        const otherSocketId = clients[socket.id];

        if (otherSocketId) {
            clients[otherSocketId] = null;

            const otherSocket = getSocketById(otherSocketId);
            otherSocket.emit("opponent", null);
        }

        delete clients[socket.id];
    };

    const newGame = () => {
        const opponent = clients[socket.id];
        removeClient();
        addClient(opponent);
    };

    const sendShips = (ships) => {
        const opponentSocket = getSocketById(clients[socket.id]);
        opponentSocket.emit("opponentShips", ships);
        updateViewer("opponentShips", ships)
    };

    const shot = (coordinate) => {
        const opponentSocket = getSocketById(clients[socket.id]);
        opponentSocket.emit("shot", coordinate);
        updateViewer("shot", coordinate)
    };

    const end = (coordinate) => {
        const opponentSocket = getSocketById(clients[socket.id]);
        opponentSocket.emit("end", coordinate);
        updateViewer("end", coordinate)
    };

    const lista = () => {
        socket.emit('partidas-actuales', clients);
    }

    const addVisitor = (p1, p2) => {
        viewers[socket.id] = [p1, p2];
        console.log(viewers);
    }

    const updateViewer = (action, data) => {
        Object.keys(viewers).forEach((viewer) => {
            if (viewers[viewer][0] == socket || viewers[viewer][1] == socket) {
                socket.to(viewer).emit(action, data);
            }
        })
    }

    return { addClient, removeClient, newGame, sendShips, shot, end, lista, addVisitor };
};

module.exports = { clientsHelperFunctionGenerator };
