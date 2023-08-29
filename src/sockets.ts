import { Server } from 'socket.io'; 
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./app";

class Sockets {
    private io;

    constructor(io: Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
    >) {
        this.io = io;

        this.socketEvents()
    }


    socketEvents() {

        this.io.on('connection', (socket) => {

            socket.on('mensaje-cliente', (data) => {
                console.log(data)

                this.io.emit('mensaje-desde-server', data)
            })

        });
    }
}

export default Sockets;

