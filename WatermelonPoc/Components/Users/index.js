import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Button, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { database } from '../../Database/database'
import { decryptPassword } from '../../Database/schema'
import NetInfo from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync'

const UserPage = ({ route, navigation }) => {
  // const user = route.params.userData
  const [users, setUsers] = useState([])
  const [userCount, setUserCount] = useState(0)

  // console.log('users..........', users)
  const userCollection = database.collections.get('users');


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        console.log('state.........', state?.isConnected)
        mySync()
      }

    });

    return () => {
      unsubscribe();
    };
  }, [])
  
  const fetchUsers = async () => {
    try {
      const userLength = await userCollection.query().fetchCount();
      setUserCount(userLength)
      const allUsers = await userCollection.query().fetch();
      setUsers(allUsers);
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };


  async function mySync() {
    let isSyncing = false;
    if (isSyncing) {
      console.log('Synchronization is already in progress.');
      return;
    }
    isSyncing = true;
    try {
      await synchronize({
        database,
        pullChanges: async ({lastPulledAt}) => {
          const response = await fetch(`https://8fbe-2409-40f0-44-6800-eccf-f5fe-9313-b0f4.ngrok-free.app/api/Users/pull/${lastPulledAt || 0}`)
          if (!response.ok) {
            throw new Error(await response.text())
          }

          // console.log('Checking Pull Response---->', JSON.stringify(response));
          const res = await response.json();

          const { changes, } = res;
          const timestamp = res.lastPulledAt;
          console.log("Changes consoling----->", JSON.stringify(changes));
          // console.log("Checking timestamp====>", timestamp,lastPulledAt)
          return { changes, timestamp }

        },

        pushChanges: async ({ changes, lastPulledAt }) => {
          console.log('changes...........',changes)
          const body = {
            changes: {
              created: changes.users.created.map(record => ({
                id: record.id,
                email: record.email,
                password: record.password,
                profilePic: record.profilePic || '',
              })),
              updated: changes.users.updated.map(record => ({
                id: record.id,
                email: record.email,
                password: record.password,
                profilePic:  record.profilePic,
              })),
              deleted: changes.users.deleted,
            },
            last_pulled_at: lastPulledAt,
          };
          // console.log('Request Body:', JSON.stringify(body));
          if (!changes || !changes.users) {
            throw new Error('Invalid changes object');
          }
          const response = await fetch(`https://8fbe-2409-40f0-44-6800-eccf-f5fe-9313-b0f4.ngrok-free.app/api/Users/push/${lastPulledAt}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          })

          console.log("Push changes Response===>", response);
          if (!response.ok) {
            throw new Error(await response.text())
          }
        },
        migrationsEnabledAtVersion: 1,
      });
      fetchUsers();
      deleteLocalData()
    } catch (error) {
      console.log('Error during synchronization:', error);
    } finally {
      isSyncing = false;
    }
  }

  async function deleteLocalData() {
    try {
      await database.write(async () => {
        const allUsers = await database.collections.get('users').query().fetch();

        await Promise.all(allUsers.map(task => task?._raw?._status === 'synced' ? task.destroyPermanently() : null));
        // console.log('Local data deleted after synchronization');
      });
    } catch (error) {
      console.error('Error deleting local data:', error);
    }
  }

  const renderUserItem = ({ item }) => {
    // console.log('item............', item)
    const isValidUri = typeof item.profilePic === 'string' && (item.profilePic.startsWith("file://") || item.profilePic.startsWith("http://") || item.profilePic.startsWith("https://") || item.profilePic.startsWith("data:image/jpeg;base64"));

    return (
      <View style={styles.userItemContainer}>
        <View style={styles.userItem}>
          {isValidUri ? (
            <View style={styles.profilePicContainer}>
              <Image source={{ uri: item?.profilePic }} style={styles.profilePic} />
            </View>
          ) : (
            <View style={styles.profilePicContainer}>
              <Text style={styles.imgText}>
                {(item?.email).slice(0, 1).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.userInfo}>
            <Text>Email: {(item.email)}</Text>
            <Text>Password: {(item.password)}</Text>
          </View>
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
        email: (task.email),
        password: (task.password),
        profilePic: task?.profilePic,
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
        keyExtractor={item => item.id.toString()}
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