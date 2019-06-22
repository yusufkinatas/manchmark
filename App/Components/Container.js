import React from 'react'
import PropTypes from 'prop-types'
import { View, SafeAreaView, Platform, StatusBar } from 'react-native'
import { _APP_SETTINGS } from '@Core';

const Container = ({ children, style, centered, androidPadStatusBar }) => {
  let containerStyle = {
    flex: 1,
    backgroundColor: _APP_SETTINGS.colors.secondary,
    justifyContent: centered == 'all' || centered == 'vertical' ? 'center' : undefined,
    alignItems: centered == 'all' || centered == 'horizontal' ? 'center' : undefined,
    paddingTop:
      androidPadStatusBar && Platform.OS == 'android' ? StatusBar.currentHeight : undefined,
    ...style,
  }
  return <SafeAreaView style={containerStyle}>{children}</SafeAreaView>
}

Container.propTypes = {
  style: PropTypes.object,
  centered: PropTypes.oneOf(['horizontal', 'vertical', 'all']),
  androidPadStatusBar: PropTypes.bool,
}

Container.defaultProps = {}

export default Container
