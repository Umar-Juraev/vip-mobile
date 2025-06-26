import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Linking,
  View,
  Text,
  StatusBar,
} from "react-native";

const DOWNLOAD_URL =
  "https://staging-vip-client.zhongwugou.com/application/android.apk";

const Header = () => {
  const handleDownload = () => {
    Linking.openURL(DOWNLOAD_URL);
  };

  return (
    <View style={styles.header}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <TouchableOpacity onPress={handleDownload}>
        <Text style={styles.printText} onPress={handleDownload}>Ilovani yangilash</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  printText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
    color: "#0a7ea4",
    lineHeight: 24,
    textDecorationLine: "underline",
  },
});

export default Header;
