import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { database } from '../../Database/database'
import { decryptPassword } from '../../Database/schema'
import NetInfo from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync';
import DeleteIocn from 'react-native-vector-icons/MaterialIcons';
import EditIcon from 'react-native-vector-icons/MaterialIcons'

const UserPage = ({ route, navigation }) => {
  // const user = route.params.userData
  const [users, setUsers] = useState([])
  const [userCount, setUserCount] = useState(0)
  const [editedUser, setEditedUser] = useState({});
  const [editingUserId, setEditingUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false)

  // console.log('users..........', users)
  const userCollection = database.collections.get('users');


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        console.log('state.........', state?.isConnected)
        mySync()
      }

    });
     fetchData();
    return () => {
      unsubscribe();
    };
  }, [])

  const fetchData = async () => {
    setRefreshing(true);
    await fetchUsers();
    mySync()
    setRefreshing(false);
  };

  const fetchUsers = async () => {
    try {
      const userLength = await userCollection.query().fetchCount();
      setUserCount(userLength);
      const allUsers = await userCollection.query().fetch();
      setUsers(allUsers);
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };

  const handleInputs = (name, value) => {
    console.log('inputs........', name, value)
    setEditedUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  }

  const toggleEdit = (userId) => {
    setEditingUserId(userId);
    const userToEdit = users.find(user => user.id === userId);
    console.log('userToEdit........', userToEdit)
    setEditedUser(userToEdit);
  };

  const saveChanges = async () => {
    try {
      // console.log('before edit......', editedUser)
      await database.write(async () => {
        const updateRecord = await userCollection.find(editingUserId)
        // console.log('updatedRecord..........', updateRecord)
        await updateRecord.update((user) => {
          user.email = editedUser.email;
          user.password = editedUser.password;
        });
        // console.log('after edit......', updateRecord)
      });

      setEditingUserId(null);
      await fetchUsers(); // Refresh user list after saving changes
      mySync()
    } catch (error) {
      console.log('Error saving changes:', error);
    }
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditedUser({});
  };

  const deleteUser = async (userId) => {
    console.log('userId..........', userId)
    try {
      await database.write(async () => {
        const user = await userCollection.find(userId);
        await user.markAsDeleted();
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
        await fetchUsers(); // Fetch users again after deletion
        mySync()
      });
    } catch (error) {
      console.error('Error deleting user:', error);
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
        pullChanges: async ({ lastPulledAt }) => {
          const response = await fetch(`https://e378-103-169-83-124.ngrok-free.app/api/Collection/pull/${lastPulledAt || 0}`)
          if (!response.ok) {
            throw new Error(await response.text())
          }

          // console.log('Checking Pull Response---->', JSON.stringify(response));
          const res = await response.json();

          const { changes, } = res;
          const timestamp = res.lastPulledAt;
          console.log("Changes consoling----->", JSON.stringify(changes), timestamp);
          // console.log("Checking timestamp====>", timestamp,lastPulledAt)
          return { changes, timestamp }

        },

        pushChanges: async ({ changes, lastPulledAt }) => {
          console.log('chamges..........', changes)

          const body = {
            // request: 'sync',
            changes: {
              notes: {
                created: changes.notes.created.map(record => ({
                  id: record.id,
                  title: record.title,
                  description: record.description,
                })),
                updated: changes.notes.updated.map(record => ({
                  id: record.id,
                  title: record.title,
                  description: record.description,
                })),
                deleted: changes.notes.deleted,
              },
              users: {
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
                  profilePic: record.profilePic || '',
                })),
                deleted: changes.users.deleted,
              }
            },
            last_pulled_at: lastPulledAt,
          };
          console.log('Request Body:', JSON.stringify(body));

          if (!changes || !changes.users || !changes.notes) {
            throw new Error('Invalid changes object');
          }
          const response = await fetch(`https://e378-103-169-83-124.ngrok-free.app/api/Collection/push/${lastPulledAt}`, {
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
      await fetchUsers()
      // await deleteLocalData()
    } catch (error) {
      console.log('Error during synchronization:', error);
    } finally {
      isSyncing = false;
    }
  };

  async function deleteLocalData() {
    try {
      await database.write(async () => {
        const allUsers = await database.collections.get('users').query().fetch();

        await Promise.all(allUsers.map(task => task?._raw?._status === '' ? task.markAsDeleted() : null));
        console.log('Local data deleted after synchronization', allUsers);
        printDatabaseContents()
      });
    } catch (error) {
      console.error('Error deleting local data:', error);
    }
  }

  const renderUserItem = ({ item }) => {
    // console.log('item............', item)
    const addBase64Prefix = (base64String) => {
      return `data:image/jpeg;base64,${base64String}`;
    };

    const isEditing = item.id === editingUserId;


    // const isValidUri = typeof item.profilePic === 'string';

    return (
      <View style={styles.userItemContainer}>
        <View style={styles.userItem}>
          <View style={{ flexDirection: 'row' }}>
            {item.profilePic ? (
              <View style={styles.profilePicContainer}>
                <Image source={{ uri: item.profilePic.startsWith('data:image/jpeg;base64') ? item.profilePic : addBase64Prefix(item.profilePic) }} style={styles.profilePic} />
              </View>
            ) : (
              <View style={styles.profilePicContainer}>
                <Text style={styles.imgText}>
                  {(item?.email).slice(0, 1).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.userInfo}>
              {isEditing ?
                <>
                  <TextInput
                    style={styles.input}
                    value={editedUser.email || ''}
                    onChangeText={email => handleInputs('email', email)}
                  />
                  <TextInput
                    style={styles.input}
                    value={editedUser.password || ''}
                    onChangeText={password => handleInputs('password', password)}
                  />
                </> :
                <>
                  <Text>Email: {item.email.length > 20 ? `${item.email.slice(0, 18)}...` : item.email}</Text>
                  <Text>Password: {(item.password)}</Text>
                  <Text>id: {(item.id)}</Text>

                </>
              }

            </View>

          </View>
          {isEditing ?
            <View style={{ flexDirection: 'column' }}>
              <TouchableOpacity onPress={saveChanges}>
                <Text>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelEdit}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View> :
            <View>
              <TouchableOpacity onPress={() => deleteUser(item.id)}>
                <DeleteIocn name='delete' size={20} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleEdit(item.id)}>
                <EditIcon name='edit' size={20} />
              </TouchableOpacity>

            </View>
          }
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
  // printDatabaseContents();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Users ({userCount})</Text>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData}/>}
      />
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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