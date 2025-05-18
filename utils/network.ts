import net from "net";

export const isServerAlive = async (
  host: string,
  port: number,
  timeout: number = 1000,
): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.on("error", () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect({ host, port });
  });
};
