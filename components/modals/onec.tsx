import { getPrinterInfo, setPrinterInfo } from "@/utils/storage";
import React, { useEffect, useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
    visible: boolean;
    onClose: () => void;
};

const HostPortModal: React.FC<Props> = ({ visible, onClose }) => {
    const [host, setHost] = useState<string>('');
    const [port, setPort] = useState<number>(9200);

    useEffect(() => {
        (async () => {
            const printerInfo = await getPrinterInfo()
            setHost(printerInfo.host)
            setPort(printerInfo.port)
        })()
    }, [])

    const handleSave = async () => {
        await setPrinterInfo(host.trim(), port);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.dialogContainer}>
                    <Text style={styles.dialogTitle}>Port va Host sozlamalari</Text>
                    <Text style={styles.dialogMessage}>Host (IP yoki domain):</Text>
                    <TextInput
                        style={styles.input}
                        value={host}
                        onChangeText={setHost}
                        placeholder="Masalan: 192.168.68.3"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <Text style={styles.dialogMessage}>Port:</Text>
                    <TextInput
                        style={styles.input}
                        value={port.toString()}
                        onChangeText={(e) => setPort(Number(e))}
                        placeholder="Masalan: 9100"
                        keyboardType="number-pad"
                    />
                    <View style={styles.dialogButtons}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Bekor qilish</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleSave}>
                            <Text style={styles.confirmButtonText}>Saqlash</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    dialogContainer: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        margin: 20,
        maxWidth: 400,
        width: "90%",
    },
    dialogTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
        textAlign: "center",
    },
    dialogMessage: {
        fontSize: 16,
        color: "#666",
        lineHeight: 22,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 16,
        fontSize: 16,
    },
    dialogButtons: {
        flexDirection: "row",
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        borderRadius: 16,
        paddingVertical: 12,
        alignItems: "center",
    },
    cancelButtonText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "600",
    },
    confirmButton: {
        flex: 1,
        backgroundColor: "#d63384",
        borderRadius: 16,
        paddingVertical: 12,
        alignItems: "center",
    },
    confirmButtonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "600",
    },
});

export default HostPortModal;
