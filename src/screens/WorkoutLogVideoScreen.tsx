import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Video from "react-native-video";
import { HomeTabParamList } from "../navigators/HomeTabNavigator";
import { WorkoutLogStackParamList } from "../navigators/WorkoutLogStackNavigator";
import { getToken } from "../util/util";
import { LoadingScreen } from "./LoadingScreen";

type WorkoutLogVideoScreenRouteProp = RouteProp<
  WorkoutLogStackParamList,
  "showVideo"
>;

type WorkoutLogVideoScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabParamList, "Logs">,
  StackNavigationProp<WorkoutLogStackParamList>
>;

export function WorkoutLogVideoScreen() {
  const videoUrl: string = useRoute<WorkoutLogVideoScreenRouteProp>().params
    .videoUrl;
  const { width: windowWidth } = useWindowDimensions();
  const [token, setToken] = React.useState("");
  const navigation = useNavigation<WorkoutLogVideoScreenNavigationProp>();

  useFocusEffect(
    React.useCallback(() => {
      getToken().then((result) => {
        setToken(result ?? "");
      });
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      navigation.dangerouslyGetParent()?.setOptions({ tabBarVisible: false });
      return () => {
        navigation.dangerouslyGetParent()?.setOptions({ tabBarVisible: true });
      };
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
      onError={() => navigation.goBack()}
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
