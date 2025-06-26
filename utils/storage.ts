import CacheKey from "@/constants/cache-key";
import { InfoDTO, PrinterInfoDTO } from "@/types/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Nullable } from '../types/common';

export interface ILocalBox {
    boxNo: string;
    boxId?: number
}
//User info
export const getLocalUserInfo = async (): Promise<InfoDTO | null> => {
    try {
        const value = await AsyncStorage.getItem(CacheKey.INFO);
        return value ? JSON.parse(value) as InfoDTO : null;
    } catch (error) {
        console.error("Error getting user info:", error);
        return null;
    }
};

export const removeLocalUserInfo = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(CacheKey.INFO);
    } catch (error) {
        console.error("Error removing user info:", error);
    }
};
export const setLocalUserInfo = async (info: InfoDTO): Promise<void> => {
    try {
        await AsyncStorage.setItem(CacheKey.INFO, JSON.stringify(info));
    } catch (error) {
        console.error("Error setting user info:", error);
    }
};
//box 
export const getLocalBox = async (): Promise<Nullable<ILocalBox>> => {
    try {
        const value = await AsyncStorage.getItem(CacheKey.BOX);
        return value ? JSON.parse(value) as ILocalBox : null;
    } catch (error) {
        console.error("Error getting user info:", error);
        return null;
    }
};

export const removeLocalBox = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(CacheKey.BOX);
    } catch (error) {
        console.error("Error removing user info:", error);
    }
};
export const setLocalBox = async (box: ILocalBox): Promise<void> => {
    try {
        await AsyncStorage.setItem(CacheKey.BOX, JSON.stringify(box));
    } catch (error) {
        console.error("Error setting user info:", error);
    }
};

export const setPrinterInfo = async (host: string, port: number): Promise<void> => {
    try {
        Promise.all([
            AsyncStorage.setItem(CacheKey.PRINT_HOST, host),
            AsyncStorage.setItem(CacheKey.PRINT_PORT, port.toString())
        ])
    } catch (error) {
        console.error("Error setting user info:", error);
    }
};

export const getPrinterInfo = async (): Promise<PrinterInfoDTO> => {
    const host = await AsyncStorage.getItem(CacheKey.PRINT_HOST) ?? '192.168.68.0';
    const port = Number(await AsyncStorage.getItem(CacheKey.PRINT_PORT) ?? '9100');
    return { port, host };
};