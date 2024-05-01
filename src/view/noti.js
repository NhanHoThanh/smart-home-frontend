import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Switch,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";
import SimpleDateTime from "react-simple-timestamp-to-date";
import COLORS from "../../colors";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  db,
  db1,
  ref,
  onValue,
  set,
  child,
  push,
  update,
  firebase,
} from "../../firebase";
import { collection, onSnapshot, orderBy } from "firebase/firestore";

const Notification = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const usersQuery = collection(db1, "act");
    onSnapshot(usersQuery, (snapshot) => {
      let usersList = [];
      snapshot.docs.map((doc) => usersList.push({ ...doc.data(), id: doc.id }));

      usersList.sort((a, b) => {
        // Sử dụng timeStamp của Firebase, nên bạn cần chuyển đổi nó sang milliseconds
        const timeA = a.time.toMillis();
        const timeB = b.time.toMillis();
        return timeB - timeA; // Sắp xếp giảm dần (newest first)
      });
      setPeople(usersList);
      setLoading(false);
    });
  }, []);

  const renderItem = ({ item }) => {
    let actorName = "";
    if (item.actor === "None") {
      actorName = "thủ công";
    } else {
      actorName = item.actor;
    }
    return (
      <View style={styles.item}>
        <Text style={styles.text}>
          {actorName} {item.act}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text>vào </Text>
          <Text>{item.time.toDate().toLocaleTimeString()}</Text>
          <Text> ngày </Text>
          <Text>{item.time.toDate().toLocaleDateString()}</Text>
        </View>
      </View>
    );
  };

  const Separator = () => {
    return (
      <View
        style={{
          alignItems: "center",
        }}>
        <View
          style={{
            height: 0.5,
            width: "90%",
            backgroundColor: COLORS.secondary,
          }}></View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../img/background.png")}
      resizeMode="cover"
      style={{
        height: "100%",
        width: "100%",
      }}>
      <SafeAreaView style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Lịch sử hoạt động
          </Text>
        </View>

        <FlatList
          data={people}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={Separator}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#fff",
    //alignItems: "center",
    //justifyContent: "center",
    marginTop: 50,
  },
  item: {
    flexDirection: "column",
    height: 60,
    padding: 10,
  },
  text: {
    fontSize: 18,
  },
});
