import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useMemo, useReducer, useState } from "react";
import PageTitle from "../components/PageTitle";
import PageContainer from "../components/PageContainer";
import Input from "../components/Input";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { validateInput } from "../utils/actions/formAction";
import { reducer } from "../utils/reducers/formReducer";
import { useDispatch, useSelector } from "react-redux";
import Submitbutton from "../components/Submitbutton";
import {
  updateSignedInUserData,
  userLogout,
} from "../utils/actions/authActions";
import colors from "../constants/colors";
import { updateLoggedInData } from "../store/authSlice";
import ProfileImage from "../components/ProfileImage";
import DataItem from "../components/DataItem,";

const SettingsScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const starredMessages = useSelector(
    (state) => state.messages.starredMessages ?? {}
  );

  const sortStarredMessage = useMemo(() => {
    let result = [];
    const chats = Object.values(starredMessages);
    chats.forEach((chat) => {
      const chatMessages = Object.values(chat);
      result = result.concat(chatMessages);
    });

    return result;
  }, [starredMessages]);

  const firstName = userData?.firstName || "";
  const lastName = userData?.lastName || "";
  const email = userData?.email || "";
  const about = userData?.about || "";
  const initialState = {
    inputValues: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      about: about,
    },
    inputValidities: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      about: undefined,
    },
    formIsValid: false,
  };
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const inputChangeHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    [dispatchFormState]
  );

  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;
    try {
      setIsLoading(true);
      await updateSignedInUserData(userData?.userId, updatedValues);
      dispatch(updateLoggedInData({ newData: updatedValues }));
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [formState, dispatch]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;
    return (
      currentValues.firstName != firstName ||
      currentValues.lastName != lastName ||
      currentValues.email != email
    );
  };

  return (
    <PageContainer>
      <PageTitle title="Settings" />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <ProfileImage
          size={80}
          userId={userData?.userId}
          uri={userData?.profilePicture}
          showEditButton={true}
        />
        <Input
          id="firstName"
          label="First name"
          icon="user-o"
          iconPack={FontAwesome}
          inputChangeHandler={inputChangeHandler}
          autCapitalize="none"
          errorText={formState.inputValidities["firstName"]}
          initialValue={userData?.firstName}
        />
        <Input
          id="lastName"
          label="Last name"
          icon="user-o"
          iconPack={FontAwesome}
          inputChangeHandler={inputChangeHandler}
          autCapitalize="none"
          errorText={formState.inputValidities["lastName"]}
          initialValue={userData?.lastName}
        />
        <Input
          id="email"
          label="Email"
          icon="mail"
          keyboardType="email-address"
          iconPack={Feather}
          inputChangeHandler={inputChangeHandler}
          autCapitalize="none"
          errorText={formState.inputValidities["email"]}
          initialValue={userData?.email}
        />
        <Input
          id="about"
          label="About"
          icon="user-o"
          iconPack={FontAwesome}
          inputChangeHandler={inputChangeHandler}
          autCapitalize="none"
          errorText={formState.inputValidities["about"]}
          initialValue={userData?.about}
        />
        <View style={{ marginTop: 20 }}>
          {showSuccessMessage && <Text>Saved!</Text>}

          {isLoading ? (
            <ActivityIndicator
              size={"small"}
              color={colors.primary}
              style={{ marginTop: 10 }}
            />
          ) : (
            hasChanges() && (
              <Submitbutton
                title="Save"
                onPress={saveHandler}
                style={{ marginTop: 20 }}
                disabled={!formState.formIsValid}
              />
            )
          )}
        </View>
        <DataItem
          type={"link"}
          title="Starred messages"
          hideImage={true}
          onPress={() =>
            props.navigation.navigate("DataList", {
              title: "Starred messages",
              data: sortStarredMessage,
              type: "messages",
            })
          }
        />
        <Submitbutton
          title="Logout"
          onPress={() => dispatch(userLogout(userData))}
          style={{ marginTop: 20 }}
          color={colors.red}
        />
      </ScrollView>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    alignItems: "center",
  },
});
export default SettingsScreen;
