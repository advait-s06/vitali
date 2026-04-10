import { useVitamins } from '@/app/VitaminContext';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [checked, setChecked] = useState<{ [id: string]: boolean }>({});
  const { supplements } = useVitamins();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  const goToPreviousWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };
  const goToNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };

  const currentDayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const todaysSupplements = supplements.filter(sup => sup.days.includes(currentDayName));

  // Reset checked state when the day changes
  React.useEffect(() => {
    setChecked({});
  }, [currentDate]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRowCalendar}>
        <TouchableOpacity onPress={goToPreviousWeek} style={styles.arrowButton}>
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.monthYearContainer}>
          <Text style={styles.monthText}>{currentDate.toLocaleDateString('en-US', { month: 'long' })}</Text>
          <Text style={styles.monthText}>{currentDate.getFullYear()}</Text>
        </View>
        <TouchableOpacity onPress={goToNextWeek} style={styles.arrowButton}>
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.calendarBackground}>
        <View style={styles.headerRow}>
          {dayNames.map(day => <Text key={day} style={styles.headerText}>{day}</Text>)}
        </View>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          {weekDays.map((item, idx) => {
            const isToday = item.toDateString() === new Date().toDateString();
            const isSelected = item.toDateString() === currentDate.toDateString();
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.dayCell, isToday && styles.todayCell, isSelected && { borderWidth: 2, borderColor: '#028146' }]}
                onPress={() => setCurrentDate(item)}
              >
                <Text style={[styles.dayText, isToday && styles.todayText, isSelected && { textDecorationLine: 'underline' }]}>{item.getDate()}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.todoContainer}>
        <Text style={styles.todoHeader}>{currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</Text>
        {todaysSupplements.length === 0 ? (
          <Text style={styles.noTodosText}>No vitamins for this day.</Text>
        ) : (
          todaysSupplements.map(sup => (
            <View key={sup.id} style={{marginBottom: 10, alignItems: 'center', flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => setChecked(prev => ({ ...prev, [sup.id]: !prev[sup.id] }))}
                style={{ marginRight: 10 }}
              >
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: '#028146',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: checked[sup.id] ? '#028146' : '#fff',
                }}>
                  {checked[sup.id] && (
                    <Text style={{ color: '#fff', fontSize: 18 }}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
              <View style={{ alignItems: 'flex-start' }}>
                <Text style={{fontSize: 18, textDecorationLine: checked[sup.id] ? 'line-through' : 'none'}}>💊 {sup.name}</Text>
                <Text style={{fontSize: 14, color: '#028146'}}>Times: {sup.times.length > 0 ? sup.times.join(', ') : 'Anytime'}</Text>
                <Text style={{fontSize: 14, color: '#028146'}}>With Food: {sup.withFood ? 'Yes' : 'No'}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c2ecc7',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  monthText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  headerRowCalendar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  arrowButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  arrowText: {
    fontSize: 30,
    color: '#028146',
    fontWeight: 'bold',
  },
  monthYearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
  },
  calendar: {
    width: '100%',
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 20,
  },
  todayCell: {
    backgroundColor: '#028146',
  },
  dayText: {
    fontSize: 16,
  },
  todayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  calendarBackground: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#fff',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 340,
    alignSelf: 'center',
    marginBottom: 20,
    // Optional: subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  todoContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#fff',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 340,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 10,
    // Optional: subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  todoHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#028146',
    marginBottom: 10,
  },
  noTodosText: {
    color: '#888',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
});
