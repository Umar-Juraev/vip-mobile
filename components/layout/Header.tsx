import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

// Import your local images/icons
import chinaFlag from "../../assets/images/chinaFlag.svg";
import engFlag from "../../assets/images/engFlag.svg";
import Logo from "../../assets/images/logo.png";
import ruFlag from "../../assets/images/ruFlag.svg";
import uzFlag from "../../assets/images/uzFlag.svg";
import { View } from "../View";

const { width } = Dimensions.get("window");

const Header = () => {
  const [visible, setVisible] = useState(false);
  const [language, setLanguage] = useState("uz");
  const [userInfo, setLocalUserInfo] = useState<any>(null);
  const [notificationCount, setNotificationCount] = useState("");

  const languages = [
    { label: "O'zbekcha", value: "uz", flag: uzFlag },
    { label: "Русский", value: "ru", flag: ruFlag },
    { label: "English", value: "en", flag: engFlag },
    { label: "中国人", value: "zh", flag: chinaFlag },
  ];

  useEffect(() => {
    loadUserInfo();
    loadLanguage();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userData = await AsyncStorage.getItem("userInfo");
      if (userData) {
        setLocalUserInfo(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user info:", error);
    }
  };

  const loadLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem("activeLang");
      if (savedLang) {
        setLanguage(savedLang);
      }
    } catch (error) {
      console.error("Error loading language:", error);
    }
  };

  const changeLanguage = async (lang: string) => {
    try {
      setLanguage(lang);
      await AsyncStorage.setItem("activeLang", lang);
      // Here you would typically update your i18n locale
      // changeLocale(lang);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("userInfo");
            router.push("/(tabs)/login");
          } catch (error) {
            console.error("Error during logout:", error);
          }
        },
      },
    ]);
  };

  const handleRoutePress = (route: any) => {
    router.push(route);
  };

  const getCurrentLanguage = () => {
    return languages.find((lang) => lang.value === language);
  };

  const getUserInitial = () => {
    return userInfo?.username ? userInfo.username.charAt(0).toUpperCase() : "U";
  };

  return (
    <View >
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.actionsContainer}>
          {/* Language Selector */}
          <View style={styles.languageContainer}>
            <Image
              source={getCurrentLanguage()?.flag}
              style={styles.flagIcon}
            />
            <Picker
              selectedValue={language}
              onValueChange={changeLanguage}
              mode="dropdown"
            >
              {languages.map((lang) => (
                <Picker.Item
                  key={lang.value}
                  label={lang.label}
                  value={lang.value}
                />
              ))}
            </Picker>
          </View>


          {/* User Avatar */}
          <TouchableOpacity
            style={styles.userAvatar}
            onPress={() => setVisible(!visible)}
          >
            <Text style={styles.userInitial}>{getUserInitial()}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* User Menu Popup */}
      {visible && (
        <View style={styles.popoverContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    // paddingVertical: 20,
  },
  logoContainer: {
    // flex: 1,
  },
  logo: {
    width: 94,
    height: 42,
  },
  actionsContainer: {
    // flexDirection: "row",
    // alignItems: "center",
    // gap: 20,
  },
  languageContainer: {
    // flexDirection: "row",
    // alignItems: "center",
    // backgroundColor: "#f5f5f5",
    // borderRadius: 12,
    // paddingHorizontal: 8,
    // minWidth: 80,
    // height: 40,
  },
  flagIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  notificationContainer: {
    // position: "relative",
  },
  notificationIcon: {
    // width: 24,
    // height: 24,
  },
  badge: {
    // position: "absolute",
    // top: -5,
    // right: -5,
    // backgroundColor: "#ff4444",
    // borderRadius: 10,
    // minWidth: 20,
    // height: 20,
    // justifyContent: "center",
    // alignItems: "center",
  },
  badgeText: {
    // color: "white",
    // fontSize: 12,
    // fontWeight: "bold",
  },
  userAvatar: {
    // width: 40,
    // height: 40,
    // borderRadius: 20,
    // backgroundColor: "rgba(4, 54, 153, 0.1)",
    // justifyContent: "center",
    // alignItems: "center",
  },
  userInitial: {
    fontSize: 14,
    fontWeight: "500",
    color: "#043699",
  },
  popoverContainer: {
    // position: "absolute",
    // top: 90,
    // right: 16,
    // backgroundColor: "white",
    // borderRadius: 8,
    // padding: 10,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    // zIndex: 1000,
  },
  logoutButton: {
    // paddingVertical: 10,
    // paddingHorizontal: 15,
  },
  logoutText: {
    // fontSize: 15,
    // fontWeight: "500",
    // color: "#333",
  },
  routesContainer: {
    // marginTop: 10,
    // paddingBottom: 20,
  },
  routesContent: {
    // paddingRight: 16,
  },
  routeButton: {
    // backgroundColor: "#f8f9fa",
    // paddingVertical: 8,
    // paddingHorizontal: 12,
    // borderRadius: 10,
    // marginRight: 14,
  },
  routeText: {
    // fontSize: 15,
    // fontWeight: "500",
    // color: "#6c757d",
  },
});

export default Header;
