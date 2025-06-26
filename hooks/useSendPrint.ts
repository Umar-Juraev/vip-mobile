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
      const client = TcpSocket.createConnection(
        {
          port: printInfo.port,
          host: printInfo.host,
        },
        () => {
          client.write(zpl, undefined, (err: any) => {
            if (err) {
              setIsLoading(false);
              setError(`Yozishda xatolik: ${err?.message}`);
              reject(`Yozishda xatolik: ${err?.message}`);
            } else {
              client.end();
              setIsLoading(false);
              resolve("ZPL muvaffaqiyatli yuborildi");
            }
          });
        }
      );

      client.on("error", (error) => {
        setIsLoading(false);
        setError(`Ulanishda xatolik: ${error.message}`);
        reject(`Ulanishda xatolik: ${error.message}`);
      });

      client.on("close", () => {
        setIsLoading(false);
        setError("Ulanish kutilmaganda yopildi");
        reject(null);
      });
    });
  }, []);

  return { sendZpl, isLoading, error };
};
