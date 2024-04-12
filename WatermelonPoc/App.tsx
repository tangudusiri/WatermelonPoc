import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginPage from './Components/LoginPage';
import UserPage from './Components/Users';
import TodoPage from './Components/TodoTask';
import MainPage from './Components';
import AssupolLogin from './Components/AssupolLogin';
import QuickQuote from './Components/QuickQuote';

import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import SendQuote from './Components/SendQuote';
import SendQuoteLanding from './Components/SendQuoteLanding';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <GluestackUIProvider config={config}>
      <Stack.Navigator initialRouteName="MainPage">
        <Stack.Screen
          name='AssupolLogin'
          component={SendQuote}
        />
        {/* <Stack.Screen
          name="MainPage"
          component={MainPage}
          options={{title: 'MainPage'}}
        />
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{title: 'LoginPage'}}
        />
        <Stack.Screen
          name="Users"
          component={UserPage}
          options={{title: 'Users'}}
        />
        <Stack.Screen
          name="Todo"
          component={TodoPage}
          options={{title: 'Todo'}}
        /> */}
      </Stack.Navigator>
      </GluestackUIProvider>
    </NavigationContainer>
  );
}

export default App;
