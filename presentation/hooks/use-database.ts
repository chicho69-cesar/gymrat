import { useSQLiteContext } from 'expo-sqlite'

export function useDatabase() {
  const db = useSQLiteContext()

  return {
    db
  }
}
