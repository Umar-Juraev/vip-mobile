import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ListRenderItem,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Import your assets and API functions

import StartScanningModal from "@/components/ScannerBoxModal";
import ScannerTrackingInput from "@/components/ScannerTrackingInput";
import { useBox, useBoxAssignTracking, useBoxFinished } from "@/hooks/useApi";
import { Nullable } from "@/types/common";
import { BoxDTO, TrackingDTO } from "@/types/data";
import {
  getIsLocalTrackingScannerVisible,
  getLocalBox,
  ILocalBox,
  removeLocalBox,
  setIsLocalTrackingScannerVisible,
  setLocalBox,
} from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
// import successSound from '../../assets/sounds/success.mp3';
// import errorSound from '../../assets/sounds/error.mp3';
// Main Component
const Scanner: React.FC = () => {
  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState("");
  const [scannerValue, setScannerValue] = useState("");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [isTrackingScannerVisible, setIsTrackingScannerVisible] =
    useState(false);
  const [statelocalBox, setStateLocalBox] = useState<Nullable<ILocalBox>>(null);
  const [box, setBox] = useState<Nullable<BoxDTO>>(null);

  const [scannedItems, setScannedItems] = useState<TrackingDTO[]>([]);
  const { t } = useTranslation();

  const { refetch, isFetching } = useBox(scannerValue);
  const boxAssignTracking = useBoxAssignTracking();
  const endScanning = useBoxFinished();

  const confirmEndScanning = () => {
    if (!statelocalBox?.boxId) return;
    endScanning.mutate(statelocalBox.boxId);
    setShowDialog(false);
    setIsTrackingScannerVisible(false);
    setShowStartModal(false);
    handleClear();
  };

  const handleEndScanning = (): void => {
    setShowDialog(true);
  };

  const handleDeleteItem = async ({
    id,
    trackingNumber,
    boxId,
  }: TrackingDTO) => {
    if (!boxId || !trackingNumber) return;
    await boxAssignTracking.mutateAsync({
      boxId: boxId,
      trackingNumber,
      unassign: !!boxId,
    });
    getData();
  };

  useFocusEffect(
    React.useCallback(() => {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }, [scannerValue])
  );

  useEffect(() => {
    if (!scannerValue) return;
    getData();
  }, [scannerValue]);

  useEffect(() => {
    if (!inputValue) return;
    const timer = setTimeout(() => {
      setScannerValue(inputValue);
    }, 100);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    (async () => {
      const localBox = await getLocalBox();
      setScannerValue(localBox?.boxNo || "");
      setStateLocalBox(localBox);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const isLocalTrackingScannerVisible =
        await getIsLocalTrackingScannerVisible();
      setIsLocalTrackingScannerVisible(
        isTrackingScannerVisible || isLocalTrackingScannerVisible
      );
    })();
  }, [isTrackingScannerVisible]);

  const getData = () => {
    refetch()
      .then(({ data }) => {
        console.log(data);

        if (data) {
          setScannedItems(data.waybills);
          setBox(data);
          const boxData = {
            boxNo: data.boxNo,
            boxId: data.id,
          };
          setShowStartModal(true);
          setStateLocalBox(boxData);
          setLocalBox(boxData);
        } else {
          handleClear()
          alert(`Diqqat! ${scannerValue} raqamli quti topilmadi!`);
        }
      })
      .catch((error) => {
        handleClear()
        alert(error.message);
      })
  };

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  function handleClear() {
    setInputValue("");
    setScannerValue("");
    setStateLocalBox(null);
    removeLocalBox();
  }

  const renderItem: ListRenderItem<TrackingDTO> = ({ item, index }) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemNumber}>{scannedItems.length - index}</Text>
      <Text style={styles.itemCode}>{item.trackingNumber}</Text>
      <Text style={styles.itemWeight}>{item.weight} KG</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            "Diqqat!",
            "Rostdan ham o'chirmoqchimisiz?",
            [
              {
                text: "Bekor qilish",
                style: "cancel",
              },
              {
                text: "O'chirish",
                onPress: () => handleDeleteItem(item),
                style: "destructive",
              },
            ],
            { cancelable: true }
          );
        }}
      >
        <Ionicons name="trash-outline" size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );

  if (isTrackingScannerVisible) {
    return (
      <View style={styles.trackingScannerContainer}>
        <Text style={styles.title}>Skanerlash</Text>

        <View style={styles.inputContainer}>
          <ScannerTrackingInput
            boxId={statelocalBox?.boxId ?? 0}
            onChange={getData}
          />
          <TouchableOpacity
            style={styles.endButton}
            onPress={handleEndScanning}
          >
            <Text style={styles.endButtonText}>Tugatish</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.boxStatusText}>
            Quti raqami: <Text style={styles.infoValue}>{box?.boxNo}</Text>
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.boxStatusText}>Jami soni: </Text>
            <Text style={styles.boxStatusText}>
              {scannedItems?.length ?? 0}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.boxStatusText}>Og&apos;irlik: </Text>
            <Text style={styles.boxStatusText}>{box?.weight ?? 0} kg</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.headerTextNum}>№</Text>
            <Text style={styles.headerText}>Trek raqami</Text>
            <Text style={styles.headerText}></Text>
            <Text style={styles.headerText}></Text>
          </View>

          {scannedItems?.length > 0 ? (
            <FlatList
              data={scannedItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.list}
              refreshControl={
                <RefreshControl refreshing={isFetching} onRefresh={getData} />
              }
            />
          ) : (
            <View style={styles.emptyState}>
              <Image
                source={require("../../assets/images/not-found.png")}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>
                Ma&apos;lumotlar mavjud emas!
              </Text>
              <Text style={styles.emptySubtitle}>
                Iltimos mahsulotlar trek raqamlarini skanerlang!
              </Text>
            </View>
          )}
        </View>

        <Modal
          visible={showDialog}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDialog(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.dialogContainer}>
              <Text style={styles.dialogTitle}>Skanerlashni yakunlash</Text>
              <Text style={styles.dialogMessage}>
                Rostdan ham ushbu quti uchun skanerlash jarayonini
                tugatmoqchimisiz?
              </Text>
              <View style={styles.dialogButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowDialog(false)}
                >
                  <Text style={styles.cancelButtonText}>Qaytish</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={confirmEndScanning}
                >
                  <Text style={styles.confirmButtonText}>Tugatish</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.content}>
            {isFetching ? (
              <ActivityIndicator size="large" />
            ) : (
              <>
                <Image
                  source={require("../../assets/images/scanner-box.png")}
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
                />
                <Text style={styles.text}>{t("scanBoxInstruction")}</Text>
              </>
            )}
          </View>
        </View>

        <StartScanningModal
          visible={showStartModal}
          onClose={() => {
            setShowStartModal(false);
            handleClear();
          }}
          onStartScanning={() => {
            // Handle start scanning
            setIsTrackingScannerVisible(true);
            setShowStartModal(false);
          }}
          onStartNewScanning={() => {
            // Handle scan new box
            setShowStartModal(false);
            handleClear();
          }}
          boxNumber={statelocalBox?.boxNo}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  trackingScannerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingTop: 36,
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

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
    flexDirection: "row",
    gap: 6,
  },
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
  endButton: {
    backgroundColor: "#D81B51",
    borderRadius: 16,
    flexDirection: "row",
    height: 48,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  endButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  infoSection: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 16,
    color: "#333",
  },
  infoValue: {
    color: "#2196f3",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 6,
  },
  statBox: {
    flexGrow: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
  },
  boxStatusText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  listHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  headerTextNum: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    flexGrow: 0.4,
  },
  list: {
    flex: 1,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemNumber: {
    flex: 0.5,
    fontSize: 16,
    color: "#333",
  },
  itemCode: {
    flex: 2,
    fontSize: 16,
    color: "#2196f3",
    fontWeight: "500",
  },
  itemWeight: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    textAlign: "right",
  },
  deleteButton: {
    marginLeft: 12,
    padding: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 48,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
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

export default Scanner;
