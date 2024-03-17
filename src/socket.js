import { Manager } from 'socket.io-client';

const manager = new Manager("http://localhost:3000");
export const socket = manager.socket("/");