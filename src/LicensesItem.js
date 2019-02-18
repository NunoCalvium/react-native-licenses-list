// @flow
import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Linking} from 'react-native';

import type {TextStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {LicenseType} from './LicensesList'

import {dimensions} from './theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: dimensions.itemMarginVertical,
  },
  url: {
    textDecorationLine: 'underline',
  },
});

const urlSlop = {
  top: 15,
  right: 15,
  left: 15,
  bottom: 15,
};

type PropsType = {
  data: LicenseType,
  textStyle?: TextStyleProp,
};

class LicensesItem extends PureComponent<PropsType> {
  onUrlPress = (url: string) => Linking.openURL(url).catch(error => console.log(`Error loading webview: ${error}`));

  renderTitle = (name: string, licenses: ?string) => (
    <Text style={this.props.textStyle}>
      {`${name}${licenses ? ` | ${licenses}` : ''}`}
    </Text>
  );

  renderURL = (url: ?string, repository: ?string) => {
    const urlText = url || repository;
    if (!urlText) return null;
    return (
      <TouchableOpacity hitSlop={urlSlop} onPress={this.onUrlPress(urlText)}>
        <Text style={[styles.url, this.props.textStyle]}>
          {urlText}
        </Text>
      </TouchableOpacity>
    );
  };

  renderContact = (email: ?string, publisher: ?string) => {
    const contactText = email
      ? publisher
        ? `${publisher} (${email})`
        : email
      : publisher;
    return contactText && (
      <Text style={this.props.textStyle}>
        {contactText}
      </Text>
    );
  };

  render() {
    const {data} = this.props;
    return (
      <View style={styles.container}>
        {this.renderTitle(data.name, data.licenses)}
        {this.renderURL(data.url, data.repository)}
        {this.renderContact(data.email, data.publisher)}
      </View>
    );
  }
}

export default LicensesItem;

