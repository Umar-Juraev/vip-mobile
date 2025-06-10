import { getPrinterInfo } from "@/utils/storage";
import { useCallback, useState } from "react";
import TcpSocket from "react-native-tcp-socket";

export const useSendPrint = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendZpl = useCallback(async (zpl: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    const printInfo = await getPrinterInfo();

    return new Promise((resolve, reject) => {
      alert(`{"printInfo", ${JSON.stringify(printInfo)}}`);

      const client = TcpSocket.createConnection(
        {
          port: printInfo.port,
          host: printInfo.host,
        },
        () => {
          client.write(zpl);
          client.destroy();
          setIsLoading(false);
          alert(`{"zpl", ${zpl}}`);
          alert("ZPL successfully sent");
          resolve("ZPL successfully sent");
        }
      );

      client.on("error", (error) => {
        alert(`{"error:", :${error.message}}`);
        setIsLoading(false);
        setError(error.message);
        alert(`Connection failed: ${error.message}`);
        reject(`Connection failed: ${error.message}`);
      });

      client.on("close", () => {
        setIsLoading(false);
        alert("close connection");
      });
    });
  }, []);

  return { sendZpl, isLoading, error };
};
