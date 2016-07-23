/* @flow */

import React, { PropTypes, Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { TabViewAnimated, TabViewPage, TabBarTop } from 'react-native-tab-view';
import PokemonDetails from './PokemonDetails';
import WeakAgainstList from './WeakAgainstList';
import StrongAgainstList from './StrongAgainstList';
import data from '../data.json';
import colors from '../colors.json';
import sprites from '../sprites';

const BAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: BAR_HEIGHT,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },

  button: {
    height: BAR_HEIGHT,
    width: BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    flex: 1,
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    fontFamily: 'Lato',
    fontSize: Platform.OS === 'ios' ? 16 : 18,
    marginHorizontal: 8,
  },

  image: {
    marginHorizontal: 8,
    height: 72,
    resizeMode: 'contain',
  },

  name: {
    fontFamily: 'Lato',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  meta: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  label: {
    fontFamily: 'Lato',
    fontSize: 12,
    fontWeight: 'bold',
    opacity: 0.5,
    width: 72,
    marginVertical: 2,
  },

  info: {
    fontFamily: 'Lato',
    fontSize: 13,
    marginVertical: 2,
  },

  tabview: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },

  tabbar: {
    backgroundColor: '#fff',
    elevation: 1,
  },

  tablabel: {
    fontFamily: 'Lato',
    fontSize: 10,
    fontWeight: 'bold',
    marginVertical: 8,
  },
});

type Route = {
  key: string;
  title: string;
}

type NavigationState = {
  index: number;
  routes: Array<Route>;
}

type Props = {
  onNavigate: Function;
  index: number;
  style?: any;
}

type State = {
  navigation: NavigationState;
}

export default class PokemonInfo extends Component<void, Props, State> {

  static propTypes = {
    onNavigate: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    style: ScrollView.propTypes.style,
  };

  state: State = {
    navigation: {
      index: 0,
      routes: [
        { key: 'strong-against', title: 'Strong against' },
        { key: 'weak-against', title: 'Weak against' },
        { key: 'details', title: 'Details' },
      ],
    },
  };

  _handleChangeTab = (index: number) => {
    this.setState({
      navigation: { ...this.state.navigation, index },
    });
  };

  _getColor = () => {
    return colors[data[this.props.index - 1].types[0].toLowerCase() + 'Dark'] || colors.normalDark;
  };

  _renderLabel = ({ route }: { route: Route }) => {
    return <Text style={[ styles.tablabel, { color: this._getColor() } ]}>{route.title.toUpperCase()}</Text>;
  }

  _renderHeader = (props: any) => {
    return (
      <TabBarTop
        {...props}
        renderLabel={this._renderLabel}
        indicatorStyle={{ backgroundColor: this._getColor() }}
        style={styles.tabbar}
      />
    );
  };

  _renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
    case 'weak-against':
      return <WeakAgainstList index={this.props.index} onNavigate={this.props.onNavigate} />;
    case 'strong-against':
      return <StrongAgainstList index={this.props.index} onNavigate={this.props.onNavigate} />;
    case 'details':
      return <PokemonDetails index={this.props.index} onNavigate={this.props.onNavigate} />;
    default:
      return null;
    }
  };

  _renderPage = (props: any) => {
    return <TabViewPage {...props} renderScene={this._renderScene} />;
  };

  _handleGoBack = () => {
    this.props.onNavigate({ type: 'pop' });
  };

  render() {
    const { index } = this.props;
    const item = data[index - 1];
    const color = this._getColor();

    return (
      <View {...this.props} style={[ styles.container, this.props.style ]}>
        <View style={styles.appbar}>
          <TouchableOpacity style={styles.button} onPress={this._handleGoBack}>
            {Platform.OS === 'ios' ?
              <EvilIcons
                name='chevron-left'
                size={36}
                style={{ color }}
              /> :
              <MaterialIcons
                name='arrow-back'
                size={24}
                style={{ color }}
              />
            }
          </TouchableOpacity>
          <Text style={[ styles.title, { color } ]}>#{item.index}</Text>
          <View style={styles.button} />
        </View>
        <View style={[ styles.row, styles.meta ]}>
          <View>
            <Text style={[ styles.name, { color } ]}>{item.name}</Text>
            <View style={styles.row}>
              <Text style={[ styles.label, { color } ]}>Type</Text>
              <Text style={[ styles.info, { color } ]}>{item.types.join(', ')}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[ styles.label, { color } ]}>Category</Text>
              <Text style={[ styles.info, { color } ]}>Seed Pokémon</Text>
            </View>
            <View style={styles.row}>
              <Text style={[ styles.label, { color } ]}>Weakness</Text>
              <Text style={[ styles.info, { color } ]}>Fire</Text>
            </View>
          </View>
          <Image style={styles.image} source={sprites[index - 1]} />
        </View>
        <TabViewAnimated
          style={styles.tabview}
          navigationState={this.state.navigation}
          renderScene={this._renderPage}
          renderHeader={this._renderHeader}
          onRequestChangeTab={this._handleChangeTab}
        />
      </View>
    );
  }
}
