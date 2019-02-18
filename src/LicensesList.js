// @flow
import React, {PureComponent} from 'react';
import {StyleSheet, View, SectionList, Text, ActivityIndicator} from 'react-native';
import R from 'ramda';

import type {TextStyleProp, ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import LicensesItem from './LicensesItem';
import {colors, dimensions} from './theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: dimensions.sectionPadding,
    backgroundColor: colors.sectionBackground,
  },
  sectionText: {
    color: colors.sectionText,
  },
  spinner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: dimensions.spinnerPaddingTop,
  },
});

export type LicenseType = {
  name: string,
  email?: ?string,
  publisher?: ?string,
  repository?: ?string,
  licenses?: ?string,
  url?: ?string,
  licenseGroupIsLoading?: ?boolean, // Flag to track if license group is being loaded
};

type LicensesGroupType = {
  groupTitle: string,
  data: Array<LicenseType>,
};

type PropsType = {
  extraLicenses?: Array<LicensesGroupType>,
  sectionStyle?: ViewStyleProp,
  sectionTextStyle?: TextStyleProp,
  licenseTextStyle?: TextStyleProp,
};

type StateType = {
  licensesData: Array<LicensesGroupType>,
};

class LicensesList extends PureComponent<PropsType, StateType> {
  constructor(props) {
    super(props);
    this.state ={
      licensesData: [],
    };
  }

  componentDidMount() {
    this.state = {
      licensesData: this.initLicensesData(this.props.extraLicenses),
    };

    // Small delay to make navigation smoother as processing the list of software is a significant amount of time
    setTimeout(() => {
      this.setState({
        licensesData: this.mergeNpmLicenses(),
      });
    }, 1000);
  }

  initLicensesData(extraLicenses?: Array<LicensesGroupType>) {
    return this.addRender([
      ...extraLicenses || [],
      {
        groupTitle: 'Licenses',
        data: [{
          name: '',
          licenseGroupIsLoading: true,
        }],
      },
    ]);
  }

  loadNpmLicenses() {
    const npmLibs = require('../../../licenses.json');
    // TODO: Test this!
    if (!npmLibs) {
      console.warn('Failed to load licenses.json. Please run: npm run create-licenses-report');
      return [];
    }
    const npmLibsList = R.pipe(
      // Extract version from name
      R.map(item => ({...item, name: item.name.substr(0, R.lastIndexOf('@', item.name))})),
      // Remove duplicates
      R.uniqWith(R.eqProps('name')),
      // Remove project entry
      R.filter(item => item.name !== this.getProjectName())
    )(npmLibs);

    return npmLibsList
  }

  mergeNpmLicenses() {
    const npmLicenses: Array<LicenseType> = this.loadNpmLicenses();
    return this.state.licensesData.map((licenseGroup: LicensesGroupType) => {
        if (licenseGroup.groupTitle === 'Licenses') {
          const updatedLicenseGroup = {
            ...licenseGroup,
            data: npmLicenses
          };
          return updatedLicenseGroup;
        }
        return licenseGroup;
      }
    );
  }

  addRender(array: Array<LicensesGroupType>) {
    console.log(array);
    return array.map((licenseGroup) => !R.has('renderItem')(licenseGroup)
      ? R.assoc('renderItem', this.renderItem, licenseGroup)
      : licenseGroup
    );
  }

  keyExtractor = (item: LicenseType) => item.name;

  getProjectName = () => {
    const packageData = require('../../../package.json');
    return packageData.name
  };

  renderLoadingSpinner = () => (
    <View style={styles.spinner}>
      <ActivityIndicator size="large" />
    </View>
  );

  renderItem = ({item}: {item: LicenseType}) => item.licenseGroupIsLoading
    ? this.renderLoadingSpinner()
    : <LicensesItem data={item} textStyle={this.props.licenseTextStyle}/>;

  renderSectionHeader = ({section}: {section: LicensesGroupType}) => (
    <View style={[styles.sectionContainer, this.props.sectionStyle]} key={`section${section.groupTitle}`}>
      <Text style={[styles.sectionText, this.props.sectionTextStyle]}>
        {section.groupTitle}
      </Text>
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <SectionList
          renderSectionHeader={this.renderSectionHeader}
          keyExtractor={this.keyExtractor}
          sections={this.state.licensesData}
          stickySectionHeadersEnabled={true}
        />
      </View>
    );
  }
}

export default LicensesList;
