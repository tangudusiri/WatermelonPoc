import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {mySchema} from './schema';
import { Database } from '@nozbe/watermelondb';
import Note from './Model/Note';
import User from './Model/User';
import { migrations } from './migration';
import RNFS from 'react-native-fs';

mySchema;
const adapter = new SQLiteAdapter({
  dbName: 'WatermelonDb',
  schema: mySchema,
  migrations,
});

console.log(
    'Database file should be located at:' +
      RNFS.DocumentDirectoryPath +
      '/MyAppDatabase.sqlite',RNFS.DocumentDirectoryPath)

export const database= new Database({
    adapter,
    modelClasses:[Note, User],
    actionEnabled:true
})
