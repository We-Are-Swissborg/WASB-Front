import { socket } from '../socket';

export function ConnectionManager() {
  function connect() {
    console.log(`connect`, socket);

    socket.on("connect", () => {
        console.log('connect to ws');
    });
  }

  function disconnect() {
    console.log(`disconnect`, socket);

    socket.on("disconnect", () => {
        console.log(`disconnect gogo`);
    });
  }

  return (
    <>
      <button onClick={ connect }>Connect</button>
      <button onClick={ disconnect }>Disconnect</button>
    </>
  );
}