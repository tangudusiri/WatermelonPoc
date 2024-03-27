import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Button, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { database } from '../../Database/database'
import { decryptPassword } from '../../Database/schema'

const UserPage = ({ route, navigation }) => {
  // const user = route.params.userData
  const [users, setUsers] = useState([])
  const [userCount, setUserCount] = useState(0)
  // console.log('users..........', users)
  const userCollection = database.collections.get('users');
  
  useEffect(() => {
    const fetchUsers = async () => {
      
      try {
        const userLength = await userCollection.query().fetchCount();
        setUserCount(userLength)
        // console.log('count..........',userLength)
        const allUsers = await userCollection.query().fetch();
        setUsers(allUsers);
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [])

  const renderUserItem = ({ item }) => {
    const isValidUri = typeof item.profilePic === 'string' && (item.profilePic.startsWith("file://") || item.profilePic.startsWith("http://") || item.profilePic.startsWith("https://") || item.profilePic.startsWith("data:image/jpeg;base64"));

    return (
    <View style={styles.userItemContainer}>
      <View style={styles.userItem}>
        {isValidUri ?  (
          <View style={styles.profilePicContainer}>
            <Image source={{uri: item?.profilePic}} style={styles.profilePic} />
          </View>
        ) : (
          <View style={styles.profilePicContainer}>
            <Text style={styles.imgText}>
            {decryptPassword(item?.email).slice(0, 1).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <Text>Email: {decryptPassword(item.email)}</Text>
          <Text>Password: {decryptPassword(item.password)}</Text>
        </View>
      </View>
      <View style={{ marginTop: 25 }}>
        <Button
          title='+'
          onPress={() => navigation.navigate('Todos')}
        />
      </View>
    </View>

    )
  };

  const printDatabaseContents = async () => {
    const userCollection = database.collections.get('users');

    try {
      const allTasks = await userCollection.query().fetch();
      console.log('All Users:', allTasks.map(task => ({
        ID: task.id,
        email: decryptPassword(task.email),
        password: decryptPassword(task.password),
        // profilePic: task?.profilePic,
        status: task?._raw?._status
      })));
    } catch (error) {
      console.error('Error querying database:', error);
    }
  };

  // Call the function to print database contents
  printDatabaseContents();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Users ({userCount})</Text>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
      />
    </ScrollView>
  )
}

export default UserPage

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userItem: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 10,
  },
  profilePic: {
    marginRight: 10,
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profilePicContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    elevation: 2,
  },
  userInfo: {
    // alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  imgText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    marginVertical: 20,
  }
})