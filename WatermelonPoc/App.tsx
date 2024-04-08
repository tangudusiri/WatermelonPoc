import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginPage from './Components/LoginPage';
import UserPage from './Components/Users';
import TodoPage from './Components/TodoTask';
import MainPage from './Components';
import AssupolLogin from './Components/AssupolLogin';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainPage">
        <Stack.Screen
          name='AssupolLogin'
          component={AssupolLogin}
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
    </NavigationContainer>
  );
}

export default App;
