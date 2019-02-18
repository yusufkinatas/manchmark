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
import Contacts from "react-native-contacts";
import DeviceInfo from "react-native-device-info";
import RNAccountKit from 'react-native-facebook-account-kit'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import { store, _APP_SETTINGS, _SCREEN, nav, Generics, user, api } from "../../core";
import CustomButton from "../../components/CustomButton";

export default class FindFriendsScreen extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'Find Your Friends',
        }
      },
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      contacts: user.get().contacts,
      follows: user.get().follows,
      showInfoText: true,
      isLoading: false,
    };
  }

  componentWillMount() {
    PermissionsAndroid.check("android.permission.READ_CONTACTS").then(granted => {
      if (granted) {
        this.setState({ showInfoText: false });
      }
    })
  }

  componentDidMount() {
    RNAccountKit.configure({
      responseType: 'code',
      initialPhoneCountryPrefix: '+90',
      defaultCountry: DeviceInfo.getDeviceCountry() || "TR",
    });
  }

  refreshUserData = () => {
    this.setState({
      contacts: user.get().contacts,
      follows: user.get().follows
    });
  }

  handleButtonPress = async () => {
    if (!user.get().phone) {

      try {
        const payload = await RNAccountKit.loginWithPhone()

        if (!payload) {
          console.warn('Login cancelled', payload)
        } else {
          console.warn('Logged with phone. Payload:', payload.code);
          var code = payload.code;
          user.changePhoneNumber(code).then(() => {
            this.handleButtonPress();
          }).catch(err => console.log("err", err));

        }
      } catch (err) {
        console.warn('Error', err.message)
      }

    }
    else {
      this.tryToGetContacts();
    }

  }

  tryToGetContacts = () => {

    PermissionsAndroid.request("android.permission.READ_CONTACTS").then(granted => {
      if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        Contacts.getAll((err, contacts) => {
          if (err) {
            console.log(err);
          }
          else {
            let nums = [];
            let country = DeviceInfo.getDeviceCountry();
            contacts.forEach(contact => {
              if (contact.phoneNumbers.length > 0 && contact.phoneNumbers[0].number) {
                nums.push(parsePhoneNumberFromString(contact.phoneNumbers[0].number, country).number);
              };
            });
            console.log(nums.length);
            console.log(nums);
            api.getContacts(nums).then(res => {
              console.log("CONTACTS", res);
              console.log("CONTACTS LEN", res.length);
              user.set({ contacts: res }, true);
              this.refreshUserData();
            })
              .catch(err => console.log("ERR", err));
          }
        })
      }
      else {
        console.log("NOT GRANTED");
      }
    }).catch(err => {
      console.log("ERR", err)
    })
  }

  onUserPress = (pressedUser) => {
    if (this.state.follows.indexOf(pressedUser._id) == -1) {
      user.follow(pressedUser._id).then(() => {
        this.refreshUserData();
      })
    }
    else {
      user.unfollow(pressedUser._id).then(() => {
        this.refreshUserData();
      });
    }
  }

  renderUser = (user) => {
    let isFollowing = this.state.follows.indexOf(user._id) != -1;
    return (
      <View style={{ flexDirection: "row", width: _SCREEN.width * 0.8, justifyContent: "space-between", padding: 10, backgroundColor: colors.secondaryLight, borderRadius: 5, elevation: 5, marginVertical: 8, marginHorizontal: 25, }} >
        <Text style={Generics.bigText} >{user.nickname}</Text>
        <TouchableOpacity
          style={{ width: 100, alignItems: "center", justifyContent: "center", backgroundColor: isFollowing ? colors.secondary : colors.primary, borderRadius: 5, borderWidth: isFollowing ? 1 : 0, borderColor: colors.secondaryDark }}
          onPress={() => this.onUserPress(user)} hitSlop={{ bottom: 20, top: 20, left: 20, right: 20 }}
        >
          <Text style={{ ...Generics.text, color: isFollowing ? colors.secondaryLight3 : colors.secondaryLight3 }} >{isFollowing ? "Friend" : "Add"}</Text>
        </TouchableOpacity>
      </View>
    );
  }


  render() {
    return (
      <View style={{ ...Generics.container, justifyContent: "flex-start" }} >

        <ScrollView style={{ flex: 1, width: _SCREEN.width, borderBottomWidth: 1, elevation: 2, marginBottom: 0 }} contentContainerStyle={{ alignItems: "center", paddingTop: 10 }} >
          <View style={{ alignItems: "center" }} >
            {this.state.showInfoText &&
              <Text style={{ ...Generics.text, fontSize: 12, color: colors.secondaryLight2, textAlign: "center", marginBottom: 10 }} >Rehberinizdeki oyuncuları arkadaş eklemeniz için telefon numaranızı doğrulamanız ve kişilere erişim izni vermeniz gerekmektedir</Text>
            }
            <CustomButton text="Rehberdeki arkadaşları bul" onPress={this.handleButtonPress} />
          </View>
          {
            this.state.contacts.map(user => this.renderUser(user))
          }
        </ScrollView>

      </View>
    )
  }
}

const colors = _APP_SETTINGS.colors;

var styles = StyleSheet.create({

});