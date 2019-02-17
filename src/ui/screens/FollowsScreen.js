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
  TouchableNativeFeedback,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Contacts from "react-native-contacts";
import DeviceInfo from "react-native-device-info";
import RNAccountKit from 'react-native-facebook-account-kit'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import { store, _APP_SETTINGS, _SCREEN, nav, Generics, user, api } from "../../core";
import CustomButton from "../../components/CustomButton";

export default class FollowsScreen extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'Friends',
        }
      },
    };
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    RNAccountKit.configure({
      responseType: 'code',
      initialPhoneCountryPrefix: '+90',
      defaultCountry: DeviceInfo.getDeviceCountry() || "TR",
    })
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
        console.log("GRANTED");
        Contacts.getAll((err, contacts) => {
          if (err) {
            console.log(err);
          }
          else {
            let nums = [];
            let country = DeviceInfo.getDeviceCountry();
            contacts.forEach(contact => {
              nums.push(parsePhoneNumberFromString(contact.phoneNumbers[0].number, country).number);
            });
            console.log(nums.length);
            console.log(nums);
            api.getContacts(nums).then(res => {
              console.log("CONTACTS", res);
              console.log("CONTACTS LEN", res.length);
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

  render() {
    return (
      <View style={Generics.container} >

        <View style={{ alignItems: "center" }} >
          <Text style={{ ...Generics.text, fontSize: 12, color: colors.secondaryLight2, textAlign: "center", marginBottom: 10 }} >Rehberinizdeki oyuncuları arkadaş eklemeniz için telefon numaranızı doğrulamanız ve kişilere erişim izni vermeniz gerekmektedir</Text>
          <CustomButton text="Rehberdeki arkadaşları bul" onPress={this.handleButtonPress} />
        </View>

      </View>
    )
  }
}

const colors = _APP_SETTINGS.colors;

var styles = StyleSheet.create({

});