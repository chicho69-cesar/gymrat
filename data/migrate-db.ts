import * as SQLite from 'expo-sqlite'
import { models } from './models/models'

export async function migrateDB(db: SQLite.SQLiteDatabase) {
  const DATABASE_VERSION = 1

  let { user_version: currentDbVersion }: any = await db.getFirstAsync(
    /* sql */`PRAGMA user_version;`
  )

  if (currentDbVersion >= DATABASE_VERSION) {
    return
  }

  if (currentDbVersion === 0) {
    await db.execAsync(
      /* sql */`
        PRAGMA foreign_keys = ON;
        PRAGMA journal_mode = 'wal';
      `
    )

    const tables = models.join(' ')
    await db.execAsync(tables)

    console.log('Tables created successfully')

    currentDbVersion = 1
  }

  await db.execAsync(/* sql */`PRAGMA user_version = ${DATABASE_VERSION}`)
}
