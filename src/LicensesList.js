// @flow
import React, {PureComponent} from 'react';
import {StyleSheet, View, SectionList, Text, ActivityIndicator} from 'react-native';
import R from 'ramda';

import LicensesItem from './LicensesItem';
import {colors, dimensions} from './theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: colors.sectionBackground,
    justifyContent: 'center',
    alignItems: 'center',
    padding: dimensions.sectionPadding,
  },
  sectionText: {
    color: colors.sectionText,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  renderItem?: any, // TODO: set function type
};

type PropsType = {
  showHeaders: boolean,
  extraLicenses?: Array<LicensesGroupType>,
  textStyle?: any, // TODO: set styles type
  sectionStyle?: any, // TODO: set styles type
  sectionTextStyle?: any, // TODO: set styles type
};

type StateType = {
  licensesData: Array<LicensesGroupType>,
};

class LicensesList extends PureComponent<PropsType, StateType> {
  static defaultProps = {
    showHeaders: true,
  };

  constructor(props: PropsType) {
    super(props);

    this.state = {
      licensesData: this.initLicensesData(props.extraLicenses),
    };
  }

  componentDidMount() {
    // Small delay to make navigation smoother as processing the list of software is a significant amount of time
    setTimeout(() => {
      const licensesData = this.mergeNpmLicenses(this.loadNpmLicenses());
      this.setState({
        licensesData,
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
    const npmLibs = require('../licenses.json');
    // TODO: Test this!
    if (!npmLibs) console.warn('Failed to load licenses.json. Please run: npm run create-licenses-report');

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

  mergeNpmLicenses(data: Array<LicenseType>) {
    return this.state.licensesData.map((licenseGroup: LicensesGroupType) => {
        if (licenseGroup.groupTitle === 'Licenses') {
          const updatedLicenseGroup = licenseGroup;
          updatedLicenseGroup.data = data;
          return updatedLicenseGroup;
        }
        return licenseGroup;
      }
    );
  }

  addRender(array: Array<LicensesGroupType>) {
    return array.map((licenseGroup) => !R.has('renderItem')(licenseGroup)
      ? R.assoc('renderItem', this.renderItem, licenseGroup)
      : licenseGroup
    );
  }

  keyExtractor = (item: LicenseType) => item.name;

  getProjectName = () => {
    const packageData = require('../package.json');
    return packageData.name
  };

  renderLoadingSpinner = () => (
    <View style={styles.spinner}>
      <ActivityIndicator size="large" />
    </View>
  );

  renderItem = ({item}: {item: LicenseType}) => item.licenseGroupIsLoading
    ? this.renderLoadingSpinner()
    : <LicensesItem data={item} textStyle={this.props.textStyle}/>;

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
          renderSectionHeader={this.props.showHeaders ? this.renderSectionHeader : () => null}
          keyExtractor={this.keyExtractor}
          sections={this.state.licensesData}
          stickySectionHeadersEnabled={true}
        />
      </View>
    );
  }
}

export default LicensesList;

