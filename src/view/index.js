import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  Image,
  StatusBar,
} from "react-native";
import COLORS from "../../colors";
import Login from "./login";
import Home from "./home";
import Signup from "./signup";
import Notification from "./noti";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import Monitoring from './monitoring';
import Control from './control';
import AirCondition from "./devices/airCondition";

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.grey[200],
          paddingTop: 10,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          paddingBottom: 5,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.grey[400],
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../img/icon/home.png")}
              style={{ height: 24, width: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Activities"
        component={Notification}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../img/icon/noti.png")}
              style={{ height: 24, width: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Monitoring"
        component={Monitoring}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../img/icon/temparature.png")}
              style={{ height: 24, width: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Control"
        component={Control}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../img/icon/air_conditioner.png")}
              style={{ height: 24, width: 24, tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default RootComponent = function () {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="MyTabs" component={MyTabs} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Monitoring" component={Monitoring} />
        <Stack.Screen name="Control" component={Control} />
        <Stack.Screen name = "AirCondition" component = {AirCondition} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
