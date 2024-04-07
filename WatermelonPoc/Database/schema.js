import { appSchema, tableSchema } from '@nozbe/watermelondb'
import CryptoJS from 'rn-crypto-js'
export const mySchema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'notes',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'status', type: 'string'},
        { name: 'lastModifiedAt', type: 'number', isOptional: true},
        { name: 'createdAt', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'users',
      columns: [
        { name: 'email', type: 'string' },
        { name: 'password', type: 'string' },
        { name: 'profilePic', type: 'string' },
      ]
    }),
  ],
})
// Function to encrypt password
export function encryptPassword(password) {
  return CryptoJS.AES.encrypt(password, 'secret key 123').toString();
}

// Now, you can use the encryptedPassword to store it in your WatermelonDB User table.

// Function to decrypt password
export function decryptPassword(encryptedPassword) {
  return CryptoJS.AES.decrypt(encryptedPassword, 'secret key 123').toString(CryptoJS.enc.Utf8);
}
