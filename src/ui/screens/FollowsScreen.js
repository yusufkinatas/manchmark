import React, { Component } from 'react';
import { Navigation } from "react-native-navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  ImageBackground,
  Image,
  Alert,
  Linking,
  PermissionsAndroid,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DeviceInfo from "react-native-device-info";
import validator from "validator";

import { store, _APP_SETTINGS, _SCREEN, nav, Generics, user, api, translate } from "../../core";
import CustomButton from "../../components/CustomButton";
import LoadingIndicator from "../../components/LoadingIndicator";

export default class FollowsScreen extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: translate("friends"),
        }
      },
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      follows: user.get().follows,
      followsData: [],
      renderStatus: "follows", //follows - search
      showInfoText: true,
      isLoading: true,
      searchResults: [],
      searchText: "",
      errorText: "",
    };
  }

  pushScreen = (screen, passProps) => {
    nav.pushScreen(this.props.componentId, screen, passProps);
  }

  refreshUserData = (reRender = true) => {
    if (reRender) {
      api.getUsers(user.get().follows).then(res => {
        this.setState({ followsData: res, follows: user.get().follows });
      });
    }
    else {
      this.setState({ follows: user.get().follows });
    }
  }

  componentDidMount() {
    api.getUsers(this.state.follows).then(res => {
      this.setState({ followsData: res, isLoading: false });
    });
  }

  onChangeText = (text) => {
    let _text = text.trim();
    if (_text == "") {
      this.setState({ renderStatus: "follows", searchText: _text, errorText: "" });
    }
    else {
      if (!validator.isAlphanumeric(text)) {
        this.setState({ renderStatus: "search", searchText: _text, errorText: translate("errOnlyEngLetters") });
      }
      else {
        this.setState({ renderStatus: "search", searchText: _text, errorText: "" });
        api.search(_text).then(res => {
          let clone = []
          res.forEach(_user => {
            if (this.state.follows.indexOf(_user._id) != -1) {
              clone.push(_user);
            }
          })
          res.forEach(_user => {
            if (this.state.follows.indexOf(_user._id) == -1) {
              clone.push(_user);
            }
          })
          this.setState({ searchResults: clone });
        });
      }
    }
  }

  onUserPress = (pressedUser, userFromSearchResults) => {
    if (this.state.follows.indexOf(pressedUser._id) == -1) {
      user.follow(pressedUser._id).then(() => {
        this.refreshUserData(userFromSearchResults || false);
      })
    }
    else {
      user.unfollow(pressedUser._id).then(() => {
        this.refreshUserData(userFromSearchResults || false);
      });
    }
  }

  renderUser = (user, userFromSearchResults) => {
    let isFollowing = this.state.follows.indexOf(user._id) != -1;
    return (
      <View key={user.nickname} style={{ flexDirection: "row", width: _SCREEN.width * 0.8, padding: 10, backgroundColor: colors.secondaryLight, borderRadius: 5, elevation: 5, marginVertical: 8, marginHorizontal: 25, }} >
        <Text numberOfLines={1} style={{ ...Generics.bigText, flex: 1, textAlign: "left" }} >{user.nickname}</Text>
        <TouchableOpacity
          style={{ width: 100, alignItems: "center", justifyContent: "center", backgroundColor: isFollowing ? colors.secondary : colors.primary, borderRadius: 5, borderWidth: isFollowing ? 1 : 0, borderColor: colors.secondaryDark }}
          onPress={() => this.onUserPress(user, userFromSearchResults)} hitSlop={{ bottom: 20, top: 20, left: 20, right: 20 }}
        >
          <Text style={{ ...Generics.text, color: isFollowing ? colors.secondaryLight3 : colors.secondaryLight3 }} >{isFollowing ? translate("friend") : translate("add")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderFollows = () => {
    return (
      <ScrollView style={{ width: _SCREEN.width, marginBottom: 0 }} contentContainerStyle={{ alignItems: "center", paddingTop: 10 }} >
        {
          this.state.isLoading ?
            <LoadingIndicator text={translate("loading")} />
            :
            this.state.followsData.map(_user => this.renderUser(_user))
        }
      </ScrollView>
    );
  }

  renderSearchResults = () => {
    return (
      <ScrollView style={{ width: _SCREEN.width, marginBottom: 0 }} contentContainerStyle={{ alignItems: "center", paddingTop: 10 }} >
        <View>
          <Text style={Generics.text} >{translate("xUsersFound").replace("2", this.state.searchResults.length)}</Text>
        </View>
        {
          this.state.searchResults.map(_user => {
            if (user.get().nickname != _user.nickname) {
              return (this.renderUser(_user, true));
            }
          })
        }
      </ScrollView>
    );
  }

  renderContent = () => {
    switch (this.state.renderStatus) {
      case "follows":
        return (this.renderFollows());
      case "search":
        return (this.renderSearchResults());
    }
  }

  render() {
    return (
      <View style={{ ...Generics.container, justifyContent: "flex-start" }} >
        {(this.state.renderStatus == "follows" || this.state.renderStatus == "search") &&
          <View>
            <View style={{
              width: "100%",
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 10,
              backgroundColor: colors.secondaryDark2
            }}>

              <TouchableOpacity
                activeOpacity={1}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPressIn={() => this.textInputRef.focus()}
              >
                <Icon name="search" size={25} color={colors.secondaryLight2} />
                <TextInput
                  ref={r => this.textInputRef = r}
                  onChangeText={this.onChangeText}
                  autoCapitalize={"none"}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    fontSize: 20,
                    fontFamily: "roboto",
                    color: colors.secondaryLight2
                  }}
                  placeholder={translate("searchUser")}
                  placeholderTextColor={colors.secondaryLight2}
                  underlineColorAndroid={"transparent"}
                  value={this.state.searchText}
                />
              </TouchableOpacity>

              {this.state.searchText != "" &&
                <TouchableOpacity onPressIn={() => this.setState({ searchText: "", renderStatus: "follows" })} activeOpacity={1} >
                  <Icon color={colors.secondaryLight2} name="times" size={25} />
                </TouchableOpacity>
              }

            </View>

            {this.state.errorText != "" &&
              <Text style={Generics.errorText} >{this.state.errorText}</Text>
            }

            <View style={{ width: _SCREEN.width, backgroundColor: colors.secondaryDark, height: 1 }} />
            <View style={{ width: _SCREEN.width, backgroundColor: colors.secondaryDark + "55", height: 1 }} />
          </View>
        }

        {this.renderContent()}

        {user.get().settings.friendsEnabled &&
          <View style={{ alignItems: "center", backgroundColor: colors.secondaryDark2, width: _SCREEN.width }} >
            <View style={{ width: _SCREEN.width, backgroundColor: colors.secondaryDark + "55", height: 1 }} />
            <View style={{ width: _SCREEN.width, backgroundColor: colors.secondaryDark, height: 1, marginBottom: 8 }} />
            <CustomButton text={translate("findYourFriends")} onPress={() => this.pushScreen("FindFriendsScreen", { onClose: () => this.refreshUserData(true) })} />
            <View style={{ width: _SCREEN.width, backgroundColor: colors.secondaryDark + "55", height: 1 }} />
            <View style={{ width: _SCREEN.width, backgroundColor: colors.secondaryDark, height: 1 }} />
          </View>
        }

      </View>
    )
  }
}

const colors = _APP_SETTINGS.colors;

var styles = StyleSheet.create({

});