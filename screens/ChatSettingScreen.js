import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import ProfileImage from "../components/ProfileImage";
import Input from "../components/Input";
import { reducer } from "../utils/reducers/formReducer";
import { updateChatData } from "../utils/actions/chatActions";
import colors from "../constants/colors";
import Submitbutton from "../components/Submitbutton";
import { validateInput } from "../utils/actions/formAction";
import DataItem from "../components/DataItem,";

const ChatSettingScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const chatId = props.route.params.chatId;
  const chatData = useSelector((state) => state.chats.chatsData[chatId]);
  const userData = useSelector((state) => state.auth.userData);

  const storedUsers = useSelector((state) => state.users.storedUsers);

  const initialState = {
    inputValues: { chatName: chatData.chatName },
    inputValidities: { chatName: undefined },
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
      await updateChatData(chatId, userData.userId, updatedValues);

      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [formState]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;
    return currentValues.chatName != chatData.chatName;
  };

  return (
    <PageContainer>
      <PageTitle title="Chat Setting" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ProfileImage
          showEditButton={true}
          size={80}
          chatId={chatId}
          userId={userData.userId}
          uri={chatData.chatImage}
        />
        <Input
          id="chatName"
          label="Chat name"
          autoCapitalize="none"
          initialValue={chatData.chatName}
          allowEmpty={false}
          inputChangeHandler={inputChangeHandler}
          errorText={formState.inputValidities["chatName"]}
        />
        {showSuccessMessage && <Text>Saved!</Text>}
        {isLoading ? (
          <ActivityIndicator size={"small"} color={colors.primary} />
        ) : (
          hasChanges() && (
            <Submitbutton
              title="Save changes"
              color={colors.primary}
              onPress={saveHandler}
              disable={!formState.formIsValid}
              style={{ marginTop: 10 }}
            />
          )
        )}

        <View style={styles.sectionConatiner}>
          <Text style={styles.heading}>
            {chatData.users.length} Participants
          </Text>
          <DataItem title="Add users" icon="plus" type="button" />
          {chatData.users.map((uid) => {
            const currentUsers = storedUsers[uid];
            return (
              <DataItem
                key={uid}
                image={currentUsers.profilePicture}
                title={`${currentUsers.firstName} ${currentUsers.lastName}`}
                type={uid !== userData.userId && "link"}
                onPress={() =>
                  uid !== userData.userId &&
                  props.navigation.navigate("Contact", { uid, chatId })
                }
              />
            );
          })}
        </View>
      </ScrollView>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    justifyContent: "center",
    alignItems: "center",
  },
  sectionConatiner: {
    width: "100%",
    marginTop: 10,
  },
  heading: {
    marginVertical: 8,
    color: colors.textColor,
    fontFamily: "bold",
    letterSpacing: 0.3,
  },
});
export default ChatSettingScreen;
