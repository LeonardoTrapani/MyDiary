import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Root: 'Root',
      Login: 'Login',
      Signup: 'Signup',
      CreateWeek: 'CreateWeek',
      NotFound: '*',
    },
  },
};

export default linking;
