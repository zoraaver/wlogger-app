import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import * as React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Video from "react-native-video";
import { NewWorkoutLogStackParamList } from "../navigators/NewWorkoutLogStackNavigator";
import { WorkoutLogStackParamList } from "../navigators/WorkoutLogStackNavigator";
import { useHideTabBarInNestedStack } from "../util/hooks";
import { getToken } from "../util/util";
import { LoadingScreen } from "./LoadingScreen";

type WorkoutLogVideoScreenRouteProp = RouteProp<
  WorkoutLogStackParamList | NewWorkoutLogStackParamList,
  "showVideo"
>;

export function WorkoutLogVideoScreen() {
  const {
    videoUrl,
    hideTabBar,
  } = useRoute<WorkoutLogVideoScreenRouteProp>().params;
  const { width: windowWidth } = useWindowDimensions();
  const [token, setToken] = React.useState("");
  const navigation = useNavigation();

  useHideTabBarInNestedStack(hideTabBar);

  useFocusEffect(
    React.useCallback(() => {
      getToken().then((result) => {
        setToken(result ?? "");
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
