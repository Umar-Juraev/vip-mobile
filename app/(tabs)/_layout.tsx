import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useGlobalContext } from "../ContextProvider";

export default function TabLayout() {
  const { isLocalTrackingScannerVisible } = useGlobalContext()  

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={({ route }) => ({
        // tabBarActiveTintColor: Colors["light"].tint,
        headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: BlurTabBarBackground,
        tabBarStyle: [
          Platform.select({
            ios: { position: "absolute" },
            default: {},
          }),
          (route.name === "login" || isLocalTrackingScannerVisible) && { display: "none" },
          { height: 100 },
        ],
        tabBarIconStyle: {
          width: 45,
          height: 45,
        },
        tabBarLabelStyle: {
          fontSize: 14,
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: "Box Scanner",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={35} name="cube-scan" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="1C"
        options={{
          title: "1C Scanner",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={35}
              name="barcode-scan"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
