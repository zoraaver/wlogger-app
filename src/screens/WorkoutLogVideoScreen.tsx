import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import * as React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";
import Video from "react-native-video";
import { WorkoutLogStackParamList } from "../navigators/WorkoutLogStackNavigator";
import { LoadingScreen } from "./LoadingScreen";

type WorkoutLogVideoScreenProp = RouteProp<
  WorkoutLogStackParamList,
  "showVideo"
>;

export function WorkoutLogVideoScreen() {
  const videoUrl: string = useRoute<WorkoutLogVideoScreenProp>().params
    .videoUrl;
  const { width: windowWidth } = useWindowDimensions();
  const [token, setToken] = React.useState("");
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      EncryptedStorage.getItem("token").then((result) => {
        if (result) {
          setToken(result);
        }
      });
    }, [])
  );

  if (token === "") return <LoadingScreen backgroundColor="black" />;

  return (
    <Video
      source={{ uri: videoUrl, headers: { Authorisation: token } }}
      style={[styles.video, { height: "100%", width: windowWidth }]}
      audioOnly={false}
      controls
      ignoreSilentSwitch="ignore"
      onEnd={() => navigation.goBack()}
    />
  );
}

const styles = StyleSheet.create({
  video: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: "black",
  },
});
