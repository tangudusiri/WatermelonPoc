import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import { database } from '../../Database/database';
import { encryptPassword } from '../../Database/schema';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import User from 'react-native-vector-icons/FontAwesome'

const LoginPage = () => {

  const navigation = useNavigation();
  const userCollection = database.collections.get('users')

  const [form, setForm] = useState({
    email: '',
    password: '',
    profilePic: null
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (name, value) => {
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };


  const handleProfilePicChange = (profilePic) => {
    setForm(prevForm => ({
      ...prevForm,
      profilePic: profilePic,
    }));
  };

  // Email validation function
  const validateEmail = email => {
    var regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email));
  };

  // Password validation function
  const validatePassword = password => {
    return password.length >= 6;
  };

  const handleValidation = () => {
    let valid = true;
    let emailError = '';
    let passwordError = '';

    setErrors({ email: '', password: '' });

    if (!validateEmail(form.email)) {
      emailError = 'Please provide valid Email Address';
      valid = false;
    }

    if (!validatePassword(form.password)) {
      passwordError = 'Password must be at least 6 characters long';
      valid = false;
    }

    setErrors({ email: emailError, password: passwordError });

    return valid;
  };

  // const registerUser = async (email, password) => {
  //   try {
  //     const connected = await isConnected();
  //     if (connected) {
  //       console.log('Sending data to server');
  //       await database.action(async () => {
  //         await database.get('users').create(newUser => {
  //           newUser.email = email;
  //           newUser.password = password;
  //           // You can add more fields here if needed
  //         });
  //       });
  //       console.log('User registered successfully online');
  //     } else {
  //       await database.action(async () => {
  //         await database.get('users').create(newUser => {
  //           newUser.email = email;
  //           newUser.password = password;
  //           // You can add more fields here if needed
  //         });
  //       });
  //       console.log('User registered successfully offline');
  //     }
  //   } catch (error) {
  //     console.log('Error registering user:', error);
  //   }
  // };


  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Both Email and Password are required");
      return;
    }

    // Validate email and password
    if (!handleValidation()) {
      console.log('Form is invalid');
      return;
    }

    try {
      await database.write(async () => {
        const createUser = await userCollection.create((user) => {
          user.email = (form.email),
          user.password = (form.password)
          user.profilePic = form.profilePic
        })
      })
      setForm({ email: '', password: '', profilePic: null })
      const fetchUsers = await userCollection.query();
      // console.log('fetch.........', fetchUsers)
      setForm(fetchUsers)
    } catch (error) {
      console.log('Error Creating User', error)
    }
    if (handleValidation() && form.email && form.password) {
      // console.log('Form is valid', form);
      // registerUser(form.email, form.password);

      navigation.navigate('Users', { userData: form });
    } else {
      console.log('Form is invalid');
    }
  };
  const handleImagePicker = async () => {
    const options = {
      title: 'Select Profile Picture',
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    try {
      const result = await launchImageLibrary(options); // or launchImageLibrary(options) for gallery
      if (!result.didCancel) {
        // Image selected, update form state
        const imagePath = result.assets[0].uri;
        const base64Data = await RNFS.readFile(imagePath, 'base64');
        const base64Image = `data:${result.assets[0].type};base64,${base64Data}`;
        // console.log('imagepath..........',base64Image)
        setForm(prevForm => ({
          ...prevForm,
          profilePic: base64Image || null, // or result.assets[0].uri for gallery
        }));
      }
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };

  const handleImageRemove = () => {
    setForm(prevForm => ({
      ...prevForm,
      profilePic: null,
    }));
  };



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title1}>
                Welcome to <Text style={{ color: '#d52b1e' }}>Assupol</Text>
              </Text>

              <View style={styles.imgContainer}>
                <Image
                  source={require('../assets/assupallogo.png')}
                  style={styles.image}
                />
                <View style={styles.profilePicContainer}>
                  {form.profilePic ? (
                    <Image source={{ uri: form.profilePic }} style={styles.profilePic} />
                  ) : (
                    <View style={styles.profilePicPlaceholder}
                    >
                      <User
                        name='user-o'
                        size={60}
                        color='#E5E4E2'
                        style={{ marginHorizontal: 20 }}
                      />
                    </View>
                  )}
                </View>
                {form?.profilePic ?
                  <TouchableOpacity onPress={handleImageRemove} style={styles.handleBtn}>
                    <Text style={styles.handleText}>{'Remove'}</Text>
                  </TouchableOpacity>
                  : <TouchableOpacity onPress={handleImagePicker} style={styles.handleBtn}>
                    <Text style={styles.handleText}>{'Add'}</Text>
                  </TouchableOpacity>
                }
              </View>

              {/* <Text style={styles.title2}>
                {'Register for self services and Rewards'}
              </Text>

              <Text style={styles.subtitle}>
                {'Please enter your Email address as well as your password.'}
              </Text> */}
            </View>

            <View style={styles.form}>
              <View style={styles.input}>
                {!form.email && (
                  <Text style={styles.inputLabel}>Email address *</Text>
                )}

                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={email => handleInputChange('email', email)}
                  style={styles.inputControl}
                  value={form.email}
                />
                {!!errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.input}>
                {!form.password && (
                  <Text style={styles.inputLabel}>Password *</Text>
                )}

                <TextInput
                  autoCorrect={false}
                  onChangeText={text => handleInputChange('password', text)}
                  style={styles.inputControl}
                  secureTextEntry={true}
                  value={form.password}
                />
                {!!errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <Text
                style={[
                  styles.subtitle,
                  {
                    color: '#d52b1e',
                    fontSize: 18,
                    fontWeight: 'bold',
                    margin: 10,
                  },
                ]}>
                {'Forgot Password?'}
              </Text>

              <View style={styles.formAction}>
                <TouchableOpacity
                  onPress={() => {
                    handleSubmit();
                  }}>
                  <View style={styles.btn}>
                    <Text style={styles.btnText}>Log in</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.formActionSpacer} />
              </View>

              <Text style={styles.formFooter}>
                By logging in, you agree to the{' '}
                <Text style={{ fontWeight: '600', color: '#d52b1e' }}>
                  {' '}
                  terms and conditions{' '}
                </Text>
                of the Assupol Portal.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LoginPage

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
  },
  title1: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1d1d1d',
    textAlign: 'center',
    marginBottom: 10,
  },
  title2: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1d1d1d',
    textAlign: 'center',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
    marginTop: 10,
  },
  imgContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  image: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  header: {
    marginTop: 36,
  },
  headerIcon: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    marginBottom: 36,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    // marginBottom: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginVertical: 24,
  },
  formActionSpacer: {
    // marginVertical: 50,
  },
  formFooter: {
    marginTop: 'auto',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
    color: '#929292',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    position: 'absolute',
    lineHeight: 44,
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#c0c0c0',
    zIndex: 9,
  },
  inputControl: {
    height: 44,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 24,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#d52b1e',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  profilePicContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profilePic: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  profilePicPlaceholder: {
    backgroundColor: '#fff',
    width: 160,
    height: 160,
    borderRadius: 80,
    marginTop: 20,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleBtn: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10
  },
  handleText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});