import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { database } from '../../Database/database';
import { synchronize } from '@nozbe/watermelondb/sync'
import NetInfo from '@react-native-community/netinfo'

const TodoPage = () => {
  const [showCard, setShowCard] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [notes, setNotes] = useState([]);
  const [type, setType] = useState('new');
  const [selectedId, setSelectedId] = useState('')

  useEffect(() => {
    getNotes();

    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);

      // If there is an internet connection, perform the sync
      if (state.isConnected) {
        mySync();
      }
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  const getNotes = () => {
    const notesData = database.collections.get('notes');
    console.log("NotesData.....", notesData);
    notesData
      .query()
      .observe()
      .forEach(item => {
        console.log('item===>', item);
        let temp = [];
        item.forEach(data => {
          temp.push(data._raw);
        });
        setNotes(temp);
        mySync()
      });
  };

  const addNote = async () => {
    await database.write(async () => {
      const newPost = await database.get('notes').create(note => {
        note.note = title;
        note.desc = desc;
        note.needs_sync = true;
      });
      console.log('saved data---->', newPost);
      setTitle('');
      setDesc('');
      setShowCard(false);
      getNotes();
      mySync()
    });
  };

  const updateNote = async () => {
    await database.write(async () => {
      const note = await database.get('notes').find(selectedId)
      await note.update((item) => {
        item.note = title
        item.desc = desc
      })
      setType('new')
      setTitle('')
      setDesc('')
      setShowCard(false)
      getNotes()
      mySync()
    })
  };

  const deleteNote = async id => {
    await database.write(async () => {
      const note = await database.get('notes').find(id);
      await note.destroyPermanently();
      getNotes();
      mySync()
    });
  };

  async function deleteLocalData() {
    try {
      await database.write(async () => {
        const allNotes = await database.collections.get('notes').query().fetch();

        await Promise.all(allNotes.map(task => task?._raw?._status === 'synced' ? task.destroyPermanently() : null));
        console.log('Local data deleted after synchronization');
      });
    } catch (error) {
      console.error('Error deleting local data:', error);
    }
  }

  let isSyncing = false

  // async function mySync() {
  //   if (isSyncing) {
  //     console.log('Synchronization is already in progress.');
  //     return;
  //   }
  //   isSyncing = true;
  //   try {
  //     await synchronize({
  //       database,
  //       pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
  //         const { changes, timestamp } = await mockPullFromDatabase({
  //           lastPulledAt,
  //           schemaVersion,
  //           migration,
  //         });
  //         console.log("Pull changes------>", changes);
  //         return { changes, timestamp };
  //       },
  //       pushChanges: async ({ changes, lastPulledAt }) => {
  //         await mockPushToDatabase({ changes, lastPulledAt });
  //       },
  //       migrationsEnabledAtVersion: 2,
  //     });

  //     // const networkState = await NetInfo.fetch();
  //     // if (networkState.isConnected) {
  //     //   // Only delete local data if there is an active internet connection
  //     //   await deleteLocalData();
  //     // }
  //   } catch (error) {
  //     console.error('Error during synchronization:', error);
  //   } finally {
  //     isSyncing = false;
  //   }
  // }


  async function mockPullFromDatabase({ lastPulledAt, schemaVersion, migration }) {
    const changes = {
      notes: { created: [], updated: [], deleted: [] },
    };
    const timestamp = new Date().getTime();
    console.log('Pulling changes------->', JSON.stringify(changes));
    return { changes, timestamp };
  }

  async function mockPushToDatabase({ changes, lastPulledAt }) {
    console.log('Pushing changes------->', JSON.stringify(changes), 'Last pulled at:', lastPulledAt);
  }

  async function mySync() {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
        // const urlParams = `last_pulled_at=${lastPulledAt}&schema_version=${schemaVersion}&migration=${encodeURIComponent(
        //   JSON.stringify(migration),
        // )}`
        const response = await fetch(`https://knowing-gibbon-selected.ngrok-free.app/api/Note/pull/1711433419`)
        if (!response.ok) {
          throw new Error(await response.text())
        }

        console.log('Checking Pull Response---->', JSON.stringify(response));

        const { changes, timestamp } = await response.json()
        console.log("Changes consoling----->", JSON.stringify(changes));
        console.log("Checking timestamp====>", timestamp)
        setNotes(previousNotes => {
          const updatedNotes = [...previousNotes, ...changes.notes.created];
          console.log("Updated Notes------>",updatedNotes);
          return updatedNotes;
        });
        return { changes, timestamp }
      },

      pushChanges: async ({ changes, lastPulledAt }) => {
        const response = await fetch(`https://knowing-gibbon-selected.ngrok-free.app/api/Note/push/1711433419`, {
          method: 'POST',
          body: JSON.stringify(changes),
        })
        console.log("Push changes Response===>", response);
        if (!response.ok) {
          throw new Error(await response.text())
        }
      },
      migrationsEnabledAtVersion: 1,
    })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {showCard && (
        <View
          style={{
            width: '90%',
            paddingBottom: 20,
            backgroundColor: 'white',
            shadowColor: 'rgba(0,0,0,.5)',
            shadowOpacity: 0.5,
            alignSelf: 'center',
            padding: 10,
            marginTop: 20,
            borderRadius: 8,
          }}>
          <Text style={{ alignSelf: 'center', marginTop: 10, fontSize: 18, }}>
            {type == 'new' ? ' Add Note' : ' Update Note'}
          </Text>
          <TextInput
            placeholder="Enter Note Title"
            style={{
              width: '90%',
              height: 50,
              borderWidth: 0.5,
              alignSelf: 'center',
              marginTop: 20,
              paddingLeft: 20,
              color: 'black'
            }}
            value={title}
            onChangeText={txt => setTitle(txt)}
          />
          <TextInput
            placeholder="Enter Note Desc"
            style={{
              width: '90%',
              height: 50,
              borderWidth: 0.5,
              alignSelf: 'center',
              marginTop: 20,
              paddingLeft: 20,
              color: 'black'
            }}
            value={desc}
            onChangeText={txt => setDesc(txt)}
          />
          <TouchableOpacity
            style={{
              width: '90%',
              marginTop: 20,
              height: 50,
              borderRadius: 8,
              backgroundColor: 'purple',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              if (type == 'new') {
                addNote();
              } else {
                updateNote()
              }

            }}>
            <Text style={{ color: 'white', fontSize: 18 }}>
              {type == 'edit' ? 'Save Note' : 'Add Note'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '90%',
              marginTop: 20,
              height: 50,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: 'purple',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setShowCard(false);
            }}>
            <Text style={{ color: 'purple', fontSize: 18 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={notes}
        renderItem={({ item, index }) => {
          console.log("items check=====>", item);
          return (
            <View
              style={{
                width: '90%',
                height: 80,
                alignSelf: 'center',
                borderWidth: 0.5,
                paddingLeft: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: 10,
              }}>
              <View>
                <Text style={{ fontSize: 16, color: 'black' }}>{item.title}</Text>
                <Text style={{ fontSize: 16, color: 'black' }} >{item.description}</Text>
              </View>
              <View>
                <Text
                  style={{ color: 'red' }}
                  onPress={() => {
                    deleteNote(item.id);
                  }}>
                  DELETE
                </Text>
                <Text
                  style={{ color: 'blue', marginTop: 10 }}
                  onPress={() => {
                    setType('edit');
                    setTitle(item.note);
                    setDesc(item.desc);
                    setSelectedId(item.id)
                    setShowCard(true);
                  }}>
                  EDIT
                </Text>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 180 }}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        style={{
          width: '100%',
          bottom: 30,
          height: 60,
          backgroundColor: 'purple',
          position: 'absolute',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          setShowCard(true);
        }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Add New Note</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: '100%',
          bottom: 100,
          height: 60,
          backgroundColor: 'orange',
          position: 'absolute',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          // Confirm with the user before deleting
          Alert.alert(
            "Delete Synced Data",
            "Are you sure you want to delete all synced notes from your device?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "OK", onPress: () => deleteLocalData() }
            ]
          );
        }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Delete Synced Data</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};
export default TodoPage;