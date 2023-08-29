import express, { Application } from 'express';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io'; 
import path from 'path';
import cors from 'cors'; 
import Sockets from './sockets';

//Routes
import IndexRoutes from './routes/index.routes';
// import PostRoutes from './routes/post.routes';

export interface ServerToClientEvents {
    'mensaje-desde-server': (socket: SocketData) => void;
}


export interface ClientToServerEvents {
    'mensaje-cliente': (socket: SocketData) => void;
}

export interface InterServerEvents {
    'connection': (socket: SocketData) => void;
}

export interface SocketData {
    msg: string;
    // age: number;
}

export class App{ 
    private app: Application;
    private port: number | string;
    private server: any;
    private io

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        // http server
        this.server = http.createServer(this.app)
        this.io = new Server<
            ClientToServerEvents,
            ServerToClientEvents,
            InterServerEvents,
            SocketData
        >(this.server, { /* configuraciones */ });

        this.io.on('connection', (socket) => {
            socket.on("mensaje-cliente", (data) => {
                this.io.emit('mensaje-desde-server', data)
            })
        })
    }

    middlewares(){
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        // Desplegar el directorio publico
        this.app.use(express.static(path.resolve( __dirname, '../public')));
        // CORS
        this.app.use(cors());
    }
    routes(){
        this.app.use('/api',IndexRoutes);
        // this.app.use('/posts', PostRoutes)
    }

    socketsConfiguration() {
        new Sockets( this.io )
    }

    execute(){
        //init middlewares
        this.middlewares()

        // Init sockets
        this.socketsConfiguration() 

        // routes
        this.routes()

        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        })
    }
}