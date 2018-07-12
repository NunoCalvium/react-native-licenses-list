/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {LicensesList} from 'react-native-licenses-list';

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <LicensesList
          showHeaders={true}
          extraLicenses={extraLicenses}
          textStyle={styles.textStyle}
          sectionStyle={styles.sectionStyle}
          sectionTextStyle={styles.sectionTextStyle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textStyle: {
    color: '#000000',
  },
  sectionStyle: {
    backgroundColor: '#000FFF',
    borderRadius: 4,
  },
  sectionTextStyle: {
    color: '#FFF000',
  },
});

const extraLicenses = [
  {
    groupTitle: 'Fonts',
    data: [
      {
        name: 'Roboto-Regular.ttf',
        licenses: 'Copyright 2011 Google Inc.',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
      {
        name: 'Roboto-Italic.ttf',
        licenses: 'Copyright 2011 Google Inc.',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
      {
        name: 'Roboto-Medium.ttf',
        licenses: 'Copyright 2011 Google Inc.',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
      {
        name: 'Roboto-Bold.ttf',
        licenses: 'Copyright 2011 Google Inc.',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
      {
        name: 'Roboto-BoldItalic.ttf',
        licenses: 'Copyright 2011 Google Inc.',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
    ],
  },
  {
    groupTitle: 'Sounds',
    data: [
      {
        name: 'sfx_click.mp3',
        publisher: 'Mike Koenig',
        url: 'https://creativecommons.org/licenses/by/3.0',
        licenses: 'Creative Commons Attribution 3.0'
      }
    ],
  }
];
