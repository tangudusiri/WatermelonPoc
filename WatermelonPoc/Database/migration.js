import { schemaMigrations, createTable } from '@nozbe/watermelondb/Schema/migrations'

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
          name: 'notes',
          columns: [
            { name: 'title', type: 'string' },
            { name: 'description', type: 'string', isOptional: true },
            { name: 'status', type: 'string' },
            { name: 'lastModifiedAt', type: 'number', isOptional: true },
            { name: 'createdAt', type: 'number' },
          ]
        }),
        createTable({
          name: 'users',
          columns: [
            { name: 'email', type: 'string' },
            { name: 'password', type: 'string' },
            { name: 'profile_pic', type: 'string' },
          ],
        }),
      ],
    },
  ],
});
