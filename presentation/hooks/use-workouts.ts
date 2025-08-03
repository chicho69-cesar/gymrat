import { useDatabase } from './use-database'

export default function useWorkouts() {
  const { db } = useDatabase()
}
