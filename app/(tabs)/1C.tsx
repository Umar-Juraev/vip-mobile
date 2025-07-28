import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useBoxOrTracking, useGenerateOnce } from "@/hooks/useApi";
import { useFocusEffect } from "@react-navigation/native";

import HostPortModal from "@/components/modals/onec";
import { useSendPrint } from "@/hooks/useSendPrint";
import { BoxDetailDTO } from "@/types/data";
import { calculateCubicMeterFromCm } from "@/utils/helpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "@/components/layout/Header";
// import { useSendPrint } from "@/hooks/useSendPrint";

const ScannerTracking: React.FC = () => {
  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState("");
  const [scannerValue, setScannerValue] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [boxNoOrTracking, setBoxNoOrTracking] = useState("");
  const [dimX, setDimX] = useState("50");
  const [dimY, setDimY] = useState("70");
  const [dimZ, setDimZ] = useState("80");
  const [quantity, setQuantity] = useState("1");
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");
  const { t } = useTranslation();
  const generateOnceMutation = useGenerateOnce();

  const { sendZpl } = useSendPrint();
  const { refetch, isFetching } = useBoxOrTracking(scannerValue);

  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }, [showDialog, modalVisible])
  );

  useEffect(() => {
    if (!scannerValue) return;
    refetch()
      .then(async ({ data }) => {
        if (data) {
          setBoxNoOrTracking(data.trackingNumber || data.boxNo);
          setDimZ(String(data.length));
          setDimX(String(data.width));
          setDimY(String(data.height));
          setVolume(String(data.volume ?? 0));
          setQuantity(String(data.waybillCount));
          setWeight(String(data.weight));
          setShowDialog(true);
        } else {
          handleClear();
          alert(`Diqqat! ${scannerValue} raqamli quti topilmadi!`);
        }
      })
      .catch((error) => {
        handleClear();
        alert(error.message);
      });
  }, [scannerValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScannerValue(inputValue);
    }, 100);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSubmit = async () => {
    if (
      !boxNoOrTracking ||
      !dimX ||
      Number(dimX) <= 0 ||
      !dimY ||
      Number(dimY) <= 0 ||
      !dimZ ||
      Number(dimZ) <= 0 ||
      !quantity ||
      Number(quantity) <= 0 ||
      !weight ||
      Number(weight) <= 0 ||
      !volume ||
      Number(volume) <= 0
    ) {
      alert("Diqqat! Barcha maydonlarni to'g'ri to'ldiring!");
      return;
    }
    if (Number(volume) < 0.001) {
      alert("Diqqat! O'lcham (volume) 0.001 dan kichik bo'lmasligi kerak!");
      return;
    }

    const data: BoxDetailDTO = {
      boxNo: boxNoOrTracking,
      width: Number(dimX),
      height: Number(dimY),
      length: Number(dimZ),
      volume: Number(volume),
      weight: Number(weight),
      waybillCount: Number(quantity),
    };


    try {
      const result = await generateOnceMutation.mutateAsync({ data });

      try {
        await sendZpl(result?.ZplFile);
      } catch (sendError) {
        alert("Printerga yuborishda xatolik yuz berdi.");
        return;
      }

    } catch (mutationError: any) {
      alert(mutationError?.message || "Noma'lum xatolik yuz berdi.");
      return;

    } finally {
      setShowDialog(false);
      handleFocusInput();
      handleClear();
    }
  };

  useEffect(() => {
    if (
      dimX &&
      dimY &&
      dimZ &&
      !isNaN(Number(dimX)) &&
      !isNaN(Number(dimY)) &&
      !isNaN(Number(dimZ)) &&
      Number(dimX) > 0 &&
      Number(dimY) > 0 &&
      Number(dimZ) > 0
    ) {
      const calculated = calculateCubicMeterFromCm(
        Number(dimZ),
        Number(dimX),
        Number(dimY)
      );

      console.log("calculated",calculated);
      
      setVolume(calculated.toFixed(3));
    }
  }, [dimX, dimY, dimZ]);

  const onCloseModal = () => {
    setModalVisible(false);
    handleFocusInput();
  };

  const handleFocusInput = () => {
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  function handleClear() {
    setInputValue("");
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <HostPortModal visible={modalVisible} onClose={onCloseModal} />
          {generateOnceMutation.isPending || isFetching ? (
            <ActivityIndicator size="large" />
          ) : (
            <>
              <Image
                source={require("../../assets/images/1c-scanner-icon.png")}
                style={styles.icon}
                resizeMode="contain"
              />
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder={t("scanBarcode")}
                showSoftInputOnFocus={false}
                onBlur={handleFocusInput}
                readOnly={generateOnceMutation.isPending || showDialog}
              />
              <Text style={styles.text}>{t("scan1CInstruction")}</Text>
              <Text
                style={styles.printText}
                onPress={() => setModalVisible(true)}
              >
                {t("printSetting")}
              </Text>
            </>
          )}
        </View>
      </View>
      <Modal
        visible={showDialog}
        animationType="fade"
        // transparent={true} // Consider adding this if you want background interactions or a custom overlay
        onRequestClose={() => {
          setShowDialog(false);
          setInputValue("");
        }}
      >
        {generateOnceMutation.isPending ? (
          <View
            style={{
              flex: 1,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styled1CDialog.keyboardAvoidingContainer}
            keyboardVerticalOffset={
              Platform.OS === "ios" ? 0 : -StatusBar.currentHeight!
            }
          >
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
            <View style={styled1CDialog.container}>
              <ScrollView
                contentContainerStyle={styled1CDialog.scrollViewContent}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styled1CDialog.content}>
                  <Text style={styled1CDialog.header}>
                    Quti ma&apos;lumotlari
                  </Text>

                  <View style={styled1CDialog.inputGroup}>
                    <TextInput
                      style={styled1CDialog.input}
                      value={boxNoOrTracking}
                      // onChangeText={setBoxNoOrTracking}
                      // placeholder="Box ID"
                      // keyboardType="default"
                      // returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                      editable={false}
                    />
                  </View>
                  <Text style={styled1CDialog.label}>
                    Quti o&apos;lchamlari (X-Y-Z)
                  </Text>
                  <View style={styled1CDialog.dimensionsContainer}>
                    <TextInput
                      style={styled1CDialog.dimensionInput}
                      value={dimX}
                      onChangeText={(text) =>
                        setDimX(text.replace(/[^0-9.]/g, ""))
                      }
                      keyboardType="numeric"
                      placeholder="X"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                      inputMode="decimal"
                      min={0.001}
                      required
                    />
                    <TextInput
                      style={styled1CDialog.dimensionInput}
                      value={dimY}
                      onChangeText={(text) =>
                        setDimY(text.replace(/[^0-9.]/g, ""))
                      }
                      keyboardType="numeric"
                      placeholder="Y"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                      inputMode="decimal"
                      min={0.001}
                      required
                    />
                    <TextInput
                      style={styled1CDialog.dimensionInput}
                      value={dimZ}
                      onChangeText={(text) =>
                        setDimZ(text.replace(/[^0-9.]/g, ""))
                      }
                      keyboardType="numeric"
                      placeholder="Z"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                      inputMode="decimal"
                      min={0.001}
                      required
                    />
                  </View>
                  <Text style={styled1CDialog.label}>Soni (dona)</Text>
                  <View style={styled1CDialog.inputGroup}>
                    <TextInput
                      style={styled1CDialog.input}
                      value={quantity}
                      onChangeText={setQuantity}
                      keyboardType="numeric"
                      placeholder="Quantity"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                      inputMode="decimal"
                      min={1}
                      editable={quantity ? false : true}
                      required
                    />
                  </View>
                  <Text style={styled1CDialog.label}>Og&apos;irligi</Text>
                  <View style={styled1CDialog.inputGroup}>
                    <TextInput
                      style={styled1CDialog.input}
                      value={weight}
                      onChangeText={(text) =>
                        setWeight(text.replace(/[^0-9.]/g, ""))
                      }
                      keyboardType="numeric"
                      placeholder="Weight"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                      inputMode="decimal"
                      min={0.001}
                      required
                    />
                    <Text style={styled1CDialog.unitText}>kg</Text>
                  </View>

                  <Text style={styled1CDialog.label}>O&apos;lchami</Text>
                  <View style={styled1CDialog.inputGroup}>
                    <TextInput
                      style={styled1CDialog.input}
                      value={volume}
                      // onChangeText={(text) =>
                      //   setVolume(text.replace(/[^0-9.]/g, ""))
                      // }
                      keyboardType="numeric"
                      placeholder="Volume"
                      // returnKeyType="done"
                      inputMode="decimal"
                      onSubmitEditing={Keyboard.dismiss}
                      editable={false}
                      min={0.001}
                      required
                    />
                    <Text style={styled1CDialog.unitText}>m³</Text>
                  </View>

                  <TouchableOpacity
                    disabled={generateOnceMutation.isPending}
                    style={styled1CDialog.button}
                    onPress={handleSubmit}
                  >
                    <Text style={styled1CDialog.buttonText}>
                      Jo&apos;natishga tasdiqlash
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
            {/* </TouchableWithoutFeedback> */}
          </KeyboardAvoidingView>
        )}
      </Modal>
    </View>
  );
};
const styled1CDialog = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 10,
    color: "#333",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    marginTop: 20,
  },
  inputGroup: {
    position: "relative",
    marginBottom: 10,
  },
  input: {
    height: 48,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  dimensionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
    gap: 8
  },
  dimensionInput: {
    flex: 1,
    height: 48,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
    width: '33.3%'
  },
  unitText: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -9 }],
    color: "#888",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    height: 58,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 24,
    width: "90%",
    height: 300,
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
  },
  icon: {
    width: 128,
    height: 128,
  },
  input: {
    position: "absolute",
    left: -9999,
    width: 1,
    height: 1,
    opacity: 0,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
    lineHeight: 24,
  },
  printText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
    color: "#0a7ea4",
    lineHeight: 24,
    textDecorationLine: "underline",
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
  },
  dialogMessage: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
    marginBottom: 24,
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

export default ScannerTracking;
