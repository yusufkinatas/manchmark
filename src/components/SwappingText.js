import React, { Component } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
} from "react-native";
import _ from "lodash";
import PropTypes from "prop-types";

export default class SwappingText extends Component {

  constructor(props) {
    super(props);

    this.appearAnim = new Animated.Value(0);
    this.textID = 0;
    this.state = {
      isAnimating: false,
      text: props.children,
      floatingTexts: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.children, this.props.children)) {
      this.popText(nextProps.children);
    }
  }

  popText = (newText) => {
    var id = this.textID;
    this.textID++;
    this.setState({
      floatingTexts: this.state.floatingTexts.concat({
        id,
        text: this.state.text,
        anim: new Animated.Value(0)
      }),
      text: newText,
      isAnimating: true
    }, () => {
      if (this.state.floatingTexts.length > 0) {
        Animated.timing(this.state.floatingTexts.find(t => t.id == id).anim, {
          duration: this.props.animationDuration,
          toValue: 1,
          useNativeDriver: true,
          easing: Easing.quad,
        }).start(() => {
          this.setState({
            floatingTexts: this.state.floatingTexts.slice(1)
          });
        });
      }
    });
  }

  render() {
    var textStyle = { fontSize: 70, color: "black", fontWeight: "bold" };
    return (
      this.state.isAnimating ?
        <View style={{ alignItems: "center" }} >
          {
            this.state.floatingTexts.map((floatingText, index) => {
              return (
                <Animated.View
                  style={{
                    position: "absolute",
                    scaleX: floatingText.anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.6]
                    }),
                    scaleY: floatingText.anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.6]
                    }),
                    translateY: floatingText.anim.interpolate({
                      inputRange: [0, 0.3, 1],
                      outputRange: [0, -40, -50]
                    }),
                    opacity: floatingText.anim.interpolate({
                      inputRange: [0, 0.3, 1],
                      outputRange: [1, 0.1, 0],
                    }),
                  }}
                  key={index} >
                  <Text style={this.props.style} >{floatingText.text}</Text>
                </Animated.View>
              );
            })
          }
          <Animated.View>
            <Text style={this.props.style} >{this.state.text}</Text>
          </Animated.View>
        </View>
        :
        <Animated.View>
          <Text style={this.props.style} >{this.state.text}</Text>
        </Animated.View>
    )
  }
}

SwappingText.propsTypes = {
  style: PropTypes.object,
  animationDuration: PropTypes.number
}

SwappingText.defaultProps = {
  animationDuration: 500
}
