import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Switch,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import COLORS from "../../colors";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { db, ref, onValue, set, child, push, update } from "../../firebase";

const data = ref(db);
const Home = ({ navigation }) => {
  const [temp, setTemp] = useState(30);
  const [humid, setHumidity] = useState(30);
  const [lux, setLux] = useState(22);
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const [isEnabled3, setIsEnabled3] = useState(false);
  const [fan_level, setLevel] = useState(0);
  const toggleSwitch1 = () => {
    setIsEnabled1((previousState) => !previousState);
    update(data, { switch1: !isEnabled1 });
  };
  const toggleSwitch2 = () => {
    setIsEnabled2((previousState) => !previousState);
    update(data, { switch2: !isEnabled2 });
  };
  const toggleSwitch3 = () => {
    setIsEnabled3((previousState) => !previousState);
    update(data, { switch3: !isEnabled3 });
  };

  const increaseLevel = () => {
    if (fan_level < 3) {
      update(data, { fan_level: fan_level + 1 });
      setLevel(fan_level + 1);
    }
  };

  const decreaseLevel = () => {
    if (fan_level > 0) {
      update(data, { fan_level: fan_level - 1 });
      setLevel(fan_level - 1);
    }
  };

  useEffect(() => {
    //const data = ref(db);

    onValue(data, (snapshot) => {
      setTemp(Math.round(snapshot.val().temp));
      setHumidity(Math.round(snapshot.val().humid));
      setLux(Math.round(snapshot.val().lux));
      setIsEnabled1(snapshot.val().switch1);
      setIsEnabled2(snapshot.val().switch2);
      setIsEnabled3(snapshot.val().switch3);
      setLevel(snapshot.val().fan_level);
    });
  }, [db]);

  return (
    <ImageBackground
      source={require("../img/background.png")}
      resizeMode="cover"
      style={{
        height: "100%",
        width: "100%",
      }}>
      <SafeAreaView style={styles.container}>
        <View style={{ height: "5%", width: "100%", flexDirection: "row" }}>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => {
              navigation.popToTop();
            }}>
            <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
            <Text
              style={{
                fontSize: 17,
                color: COLORS.primary,
                //fontWeight: "bold",
                marginLeft: 0,
              }}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
        {/* first row */}
        <View style={styles.row_1}>
          <View style={styles.cell_11}>
            <View style={styles.container_1}>
              <Image
                source={require("../img/icon/avatar.png")}
                style={{ width: 60, height: 60 }}
              />
            </View>
          </View>
          <View style={styles.cell_12}>
            <Text style={styles.text}> Xin chào</Text>
          </View>
        </View>
        {/* second row */}
        <View style={styles.row_2}>
          <View style={styles.container_2}>
            <View style={styles.cell_21}>
              <View style={styles.sensor}>
                <Image
                  source={require("../img/icon/temparature.png")}
                  style={{ width: 60, height: 60 }}
                />
              </View>
              <View style={styles.sensor}>
                <Image
                  source={require("../img/icon/humidity.png")}
                  style={{ width: 50, height: 50 }}
                />
              </View>
              <View style={styles.sensor}>
                <Image
                  source={require("../img/icon/lux.png")}
                  style={{ width: 60, height: 60 }}
                />
              </View>
            </View>
            <View style={styles.cell_22}>
              <View style={styles.sensor}>
                <Text style={styles.text}>{temp}</Text>
              </View>
              <View style={styles.sensor}>
                <Text style={styles.text}>{humid}</Text>
              </View>
              <View style={styles.sensor}>
                <Text style={styles.text}>{lux}</Text>
              </View>
            </View>
            <View style={styles.cell_23}>
              <View style={styles.sensor}>
                <Text style={styles.text}>°C</Text>
              </View>
              <View style={styles.sensor}>
                <Text style={styles.text}>%</Text>
              </View>
              <View style={styles.sensor}>
                <Text style={styles.text}>lux</Text>
              </View>
            </View>
            <View style={styles.cell_24}>
              <View style={styles.sensor}>
                <View
                  style={{
                    height: "20%",
                    width: "20%",
                    borderRadius: "360",
                    backgroundColor: temp <= 30 ? "#00DFA2" : "#FF0060",
                  }}></View>
              </View>
              <View style={styles.sensor}>
                <View
                  style={{
                    height: "20%",
                    width: "20%",
                    borderRadius: "360",
                    backgroundColor: humid <= 20 ? "#00DFA2" : "#FF0060",
                  }}></View>
              </View>
              <View style={styles.sensor}>
                <View
                  style={{
                    height: "20%",
                    width: "20%",
                    borderRadius: "360",
                    backgroundColor: lux <= 10 ? "#00DFA2" : "#FF0060",
                  }}></View>
              </View>
            </View>
          </View>
        </View>
        {/* third row */}
        <View style={styles.row_3}>
          <View style={styles.container_2}>
            <View style={styles.cell_31}>
              <View style={styles.sensor1}>
                <Image
                  source={require("../img/icon/light.png")}
                  style={{ width: 50, height: 50 }}
                />
              </View>
              <View style={styles.sensor1}>
                <Image
                  source={require("../img/icon/air_conditioner.png")}
                  style={{ width: 60, height: 60 }}
                />
              </View>
              <View style={styles.sensor1}>
                <Image
                  source={require("../img/icon/fan.png")}
                  style={{ width: 55, height: 55 }}
                />
              </View>
              <View style={styles.sensor1}>
                <Image
                  source={require("../img/icon/door.png")}
                  style={{ width: 50, height: 50 }}
                />
              </View>
            </View>
            <View style={styles.cell_32}>
              <View style={styles.sensor1}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled1 ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch1}
                  value={isEnabled1}
                />
              </View>
              <View style={styles.sensor1}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled2 ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch2}
                  value={isEnabled2}
                />
              </View>
              <View style={styles.sensor1}>
                <TouchableOpacity onPress={decreaseLevel}>
                  <Ionicons
                    name="chevron-back"
                    size={40}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
                <Text style={styles.text}>{fan_level}</Text>
                <TouchableOpacity onPress={increaseLevel}>
                  <Ionicons
                    name="chevron-forward"
                    size={40}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.sensor1}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled3 ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch3}
                  value={isEnabled3}
                />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    height: "100%",
    width: "100%",
    borderWidth: "1",
    flex: 1,
    resizeMode: "cover",
    //justifyContent: "center",
  },
  row_1: {
    flexDirection: "row",
    height: "18%",
    width: "100%",
    //borderWidth: "1",
    // justifyContent: "center",
    alignItems: "center",
  },
  row_2: {
    flexDirection: "row",
    height: "35%",
    width: "100%",
    //borderWidth: "1",
    justifyContent: "center",
    alignItems: "center",
  },
  row_3: {
    flexDirection: "row",
    height: "43%",
    width: "100%",
    //borderWidth: "1",
    justifyContent: "center",
    alignItems: "center",
  },
  cell_11: {
    flexDirection: "row",
    height: "100%",
    width: "35%",
    //borderRightWidth: "1",
    alignItems: "center",
    justifyContent: "center",
  },
  cell_12: {
    flexDirection: "row",
    height: "100%",
    width: "65%",
    alignItems: "center",
    justifyContent: "center",
  },
  cell_21: {
    flexDirection: "column",
    height: "100%",
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  cell_22: {
    flexDirection: "column",
    height: "100%",
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  cell_23: {
    flexDirection: "column",
    height: "100%",
    width: "20%",
    //borderRightWidth: "1",
    alignItems: "center",
    justifyContent: "center",
  },
  cell_24: {
    flexDirection: "column",
    height: "100%",
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  cell_31: {
    flexDirection: "column",
    height: "100%",
    width: "50%",
  },
  cell_32: {
    flexDirection: "column",
    height: "100%",
    width: "50%",
  },
  container_1: {
    width: "90%",
    height: "90%",
    borderWidth: "2",
    borderRadius: "120",
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  container_2: {
    flexDirection: "row",
    width: "90%",
    height: "90%",
    borderRadius: "20",
    borderWidth: "2",
    borderColor: COLORS.primary,
  },
  sensor: {
    flexDirection: "row",
    height: "33.3%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  sensor1: {
    flexDirection: "row",
    height: "25%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
  },
});
