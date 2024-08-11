import { MaterialIcons } from '@expo/vector-icons'
import moment, { Moment } from 'moment'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { DAY_NAMES, MONTH_NAMES } from '@/constants/dates'
import { StyleSheet } from 'react-native'

interface WeeklyCalendarProps {
  onSelectDate: (date: Moment) => void
}

export default function WeeklyCalendar({ onSelectDate }: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(moment())
  const [selectedDate, setSelectedDate] = useState(moment())

  const getWeekDates = (date: Moment) => {
    const weekStart = moment(date).startOf('week')
    const weekDates = []

    for (let i = 0; i < 7; i++) {
      const nextDay = moment(weekStart).add(i, 'days')
      weekDates.push(nextDay)
    }

    return weekDates
  }

  const handlePreviousWeek = () => {
    setCurrentWeek(currentWeek.clone().subtract(1, 'week'))
  }

  const handleNextWeek = () => {
    setCurrentWeek(currentWeek.clone().add(1, 'week'))
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {MONTH_NAMES[currentWeek.month()]}
        </Text>
      </View>

      <View style={styles.week}>
        <TouchableOpacity
          onPress={handlePreviousWeek}
          style={styles.box}
        >
          <MaterialIcons name='chevron-left' size={24} color='#fff' />
        </TouchableOpacity>

        {getWeekDates(currentWeek).map((date) => (
          <TouchableOpacity
            key={date.toString()}
            onPress={() => {
              setSelectedDate(date);
              onSelectDate(date);
            }}
            style={[
              styles.box,
              selectedDate && selectedDate.isSame(date, 'day') && styles.selected,
            ]}
          >
            <View>
              <Text
                style={[
                  styles.boxText,
                  selectedDate && selectedDate.isSame(date, 'day') && styles.boxTextSelected,
                ]}
              >
                {DAY_NAMES[date.day()]}
              </Text>

              <Text style={[
                styles.boxText,
                styles.boxDay,
                selectedDate && selectedDate.isSame(date, 'day') && styles.boxTextSelected,
              ]}>
                {date.date()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={handleNextWeek}
          style={styles.box}
        >
          <MaterialIcons name='chevron-right' size={24} color='#fff' />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    marginHorizontal: 3,
    marginTop: 15,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101010',
    shadowColor: '#303030',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A1CEDC'
  },
  week: {
    width: '100%',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 2,
  },
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#101010',
    borderRadius: 8,
  },
  selected: {
    backgroundColor: '#1D3D47'
  },
  boxText: {
    color: '#f1f1f1',
    fontSize: 16,
    textAlign: 'center',
  },
  boxDay: {
    fontWeight: 'bold'
  },
  boxTextSelected: {
    color: 'white',
    fontWeight: '500'
  },
})
