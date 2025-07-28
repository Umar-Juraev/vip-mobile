import { useBoxAssignTracking } from "@/hooks/useApi";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface ScanningInputProps {
  boxId: number;
  onChange: () => void;
}

const ScannerTrackingInput: React.FC<ScanningInputProps> = ({
  boxId,
  onChange,
}) => {
  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const boxAssignTracking = useBoxAssignTracking();

  const { t } = useTranslation();

  const handleClear = (): void => {
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (!inputValue || !trackingNumber) return;
    boxAssignTracking
      .mutateAsync(
        { boxId, trackingNumber },
        {
          onSuccess: () => {
            onChange();
          },
          onError: (error: any) => {
            const errorMessage = error?.error?.message || error?.message || "Trek raqam topilmadi yoki biriktirilgan!";
            alert(errorMessage);
          },
        }
      )
      .finally(() => {
        inputRef.current?.focus();
        setInputValue("");
      });
  }, [trackingNumber]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTrackingNumber(inputValue);
    }, 100);
    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <View style={styles.inputWrapper}>
      <Ionicons
        name="barcode-outline"
        size={20}
        color="#999"
        style={styles.inputIcon}
      />
      <TextInput
        ref={inputRef}
        style={styles.inputTracking}
        value={inputValue}
        onChangeText={setInputValue}
        placeholder={t("scanBarcode")}
        placeholderTextColor="#999"
        autoFocus={true}
        showSoftInputOnFocus={false}
      />
      {inputValue.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexGrow: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputTracking: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: 48,
  },
  clearButton: {
    backgroundColor: "#333",
    borderRadius: 16,
    padding: 4,
    marginLeft: 8,
  },
});

export default ScannerTrackingInput;
