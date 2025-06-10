import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface StartScanningModalProps {
  visible: boolean;
  onClose: () => void;
  onStartScanning: () => void;
  onStartNewScanning: () => void;
  boxNumber?: string;
}

const StartScanningModal: React.FC<StartScanningModalProps> = ({
  visible,
  onClose,
  onStartScanning,
  onStartNewScanning,
  boxNumber
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      hardwareAccelerated
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#999" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Skanerlangan quti</Text>

          <Image
            source={require("../assets/images/scanner-box.png")}
            style={styles.icon}
            resizeMode="contain"
          />

          {/* Box Number */}
          <Text style={styles.boxNumber}>Quti: {boxNumber}</Text>

          {/* Description */}
          <Text style={styles.description}>
            Ushbu quti bo&apos;yicha skanerlash jarayonini boshlaysizmi?
          </Text>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onStartScanning}
            >
              <Text style={styles.primaryButtonText}>Boshlash</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onStartNewScanning}
            >
              <Text style={styles.secondaryButtonText}>Boshqa quti skanerlash</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    marginTop: 16,
  },
  boxIconContainer: {
    marginBottom: 24,
  },
  boxIcon: {
    width: 80,
    height: 80,
    alignItems: 'center',
  },
  boxTop: {
    width: 60,
    height: 8,
    backgroundColor: '#4A90E2',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 2,
  },
  boxMain: {
    width: 70,
    height: 60,
    backgroundColor: '#D4A574',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  barcodeIcon: {
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
  recycleIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20
  },
  boxNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12
  },
  primaryButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    borderRadius: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',

  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default StartScanningModal;
