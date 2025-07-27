const exerciseTable = /* sql */`
  CREATE TABLE IF NOT EXISTS Exercise (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    rest INTEGER DEFAULT 120 -- In seconds
  );
`

const workoutDayTable = /* sql */`
  CREATE TABLE IF NOT EXISTS WorkoutDay (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT
  );
`

const workoutDayExerciseTable = /* sql */`
  CREATE TABLE IF NOT EXISTS WorkoutDayExercise (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    workoutDayId TEXT NOT NULL,
    exerciseId TEXT NOT NULL,
    sets INTEGER NOT NULL,
    heatingSets INTEGER NOT NULL DEFAULT 0
    -- FOREIGN KEY (workoutDayId) REFERENCES WorkoutDay(id) ON DELETE CASCADE ON UPDATE CASCADE,
    -- FOREIGN KEY (exerciseId) REFERENCES Exercise(id) ON DELETE CASCADE ON UPDATE CASCADE
  );
`

const routineTable = /* sql */`
  CREATE TABLE IF NOT EXISTS Routine (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT
  );
`

const circuitWorkoutTable = /* sql */`
  CREATE TABLE IF NOT EXISTS CircuitWorkout (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    routineId TEXT NOT NULL,
    workoutDayId TEXT NOT NULL,
    orderNumber INTEGER NOT NULL
    -- FOREIGN KEY (routineId) REFERENCES Routine(id) ON DELETE CASCADE ON UPDATE CASCADE,
    -- FOREIGN KEY (workoutDayId) REFERENCES WorkoutDay(id) ON DELETE CASCADE ON UPDATE CASCADE
  );
`

const workoutTable = /* sql */`
  CREATE TABLE IF NOT EXISTS Workout (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    date TEXT NOT NULL,
    routineId TEXT NOT NULL,
    workoutDayId TEXT NOT NULL
    -- FOREIGN KEY (routineId) REFERENCES Routine(id) ON DELETE CASCADE ON UPDATE CASCADE,
    -- FOREIGN KEY (workoutDayId) REFERENCES WorkoutDay(id) ON DELETE CASCADE ON UPDATE CASCADE
  );
`

const workoutExerciseTable = /* sql */`
  CREATE TABLE IF NOT EXISTS WorkoutExercise (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    workoutId TEXT NOT NULL,
    workoutDayExerciseId TEXT NOT NULL
    -- FOREIGN KEY (workoutId) REFERENCES Workout(id) ON DELETE CASCADE ON UPDATE CASCADE,
    -- FOREIGN KEY (workoutDayExerciseId) REFERENCES WorkoutDayExercise(id) ON DELETE CASCADE ON UPDATE CASCADE
  );
`

const exerciseSetTable = /* sql */`
  CREATE TABLE IF NOT EXISTS ExerciseSet (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    workoutExerciseId TEXT NOT NULL,
    weight REAL NOT NULL,
    reps INTEGER NOT NULL,
    unit TEXT DEFAULT 'Kg',
    setNumber INTEGER NOT NULL
    -- FOREIGN KEY (workoutExerciseId) REFERENCES WorkoutExercise(id) ON DELETE CASCADE ON
  );
`

export const models = [
  exerciseTable,
  workoutDayTable,
  workoutDayExerciseTable,
  routineTable,
  circuitWorkoutTable,
  workoutTable,
  workoutExerciseTable,
  exerciseSetTable
]
