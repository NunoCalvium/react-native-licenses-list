// @flow
import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Linking} from 'react-native';

import type {LicenseType} from './LicensesList'
import {dimensions} from './theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: dimensions.itemMarginVertical,
  },
  header: {

  },
  url: {
    textDecorationLine: 'underline',
  },
  contact: {

  }
});

const urlSlop = {
  top: 15,
  right: 15,
  left: 15,
  bottom: 15,
};

type PropsType = {
  data: LicenseType,
  textStyle?: any, // TODO: set styles type
};

class LicensesItem extends PureComponent<PropsType> {
  onUrlPress = (url: string) => Linking.openURL(url).catch(error => console.log(`Error loading webview: ${error}`));

  renderHeader = (name: string, licenses: ?string) => (
    <Text style={[styles.header, this.props.textStyle]}>
      {`${name}${licenses ? ` | ${licenses}` : ''}`}
    </Text>
  );

  renderURL = (url: ?string, repository: ?string) => {
    const urlValue = url || repository;
    if (!urlValue) return null;
    return (
      <TouchableOpacity hitSlop={urlSlop} onPress={() => this.onUrlPress(urlValue)}>
        <Text style={[styles.url, this.props.textStyle]}>
          {urlValue}
        </Text>
      </TouchableOpacity>
    );
  };

  renderContact = (email: ?string, publisher: ?string) => {
    const text = email
      ? publisher
        ? `${publisher} (${email})`
        : email
      : publisher;
    return text && (
      <Text style={[styles.contact, this.props.textStyle]}>
        {text}
      </Text>
    );
  };

  render() {
    const {data} = this.props;
    return (
      <View style={styles.container}>
        {this.renderHeader(data.name, data.licenses)}
        {this.renderURL(data.url, data.repository)}
        {this.renderContact(data.email, data.publisher)}
      </View>
    );
  }
}

export default LicensesItem;

