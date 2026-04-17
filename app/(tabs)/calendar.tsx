import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Supplement } from '../../services/supplements';
import { getSupplements } from '../../services/supplements';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [checked, setChecked] = useState<{ [id: string]: boolean }>({});

  useFocusEffect(
    useCallback(() => {
      async function loadSupplements() {
        const data = await getSupplements();
        setSupplements(data);
      }

      loadSupplements();
    }, [])
  );

  const startOfWeek = useMemo(() => {
    const start = new Date(currentDate);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay());
    return start;
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  }, [startOfWeek]);

  const goToPreviousWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const goToNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const selectedDayName = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
  });

  const selectedSupplements = supplements.filter((sup) =>
    sup.days.includes(selectedDayName)
  );

  const completedCount = selectedSupplements.filter(
    (sup) => sup.takenToday || checked[sup.id]
  ).length;

  const totalCount = selectedSupplements.length;

  const completionPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const toggleCheck = (id: string) => {
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Calendar</Text>
      </View>

      <Text style={styles.sectionTitle}>Week View</Text>

      <View style={styles.weekNav}>
        <TouchableOpacity onPress={goToPreviousWeek} style={styles.arrowButton}>
          <Ionicons name="arrow-back" size={24} color="#0f7f43" />
        </TouchableOpacity>

        <Text style={styles.monthRangeText}>
          {weekDays[0].toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}{' '}
          -{' '}
          {weekDays[6].toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </Text>

        <TouchableOpacity onPress={goToNextWeek} style={styles.arrowButton}>
          <Ionicons name="arrow-forward" size={24} color="#0f7f43" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekCard}>
        <View style={styles.dayRow}>
          {weekDays.map((day, index) => {
            const selected = isSameDay(day, currentDate);
            const today = isSameDay(day, new Date());

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayBubble,
                  today && styles.todayBubble,
                  selected && styles.selectedBubble,
                ]}
                onPress={() => setCurrentDate(day)}
              >
                <Text
                  style={[
                    styles.dayLetter,
                    selected && styles.selectedBubbleText,
                  ]}
                >
                  {day.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1)}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    selected && styles.selectedBubbleText,
                  ]}
                >
                  {day.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#f1f1f1' }]} />
          <Text style={styles.legendText}>None</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#ffe86a' }]} />
          <Text style={styles.legendText}>Partial</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#79c98b' }]} />
          <Text style={styles.legendText}>All Done</Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.selectedText}>
          Selected:{' '}
          {currentDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </Text>

        <Text style={styles.completionText}>
          Completion: {completedCount}/{totalCount} ({completionPercent}%)
        </Text>

        {selectedSupplements.length === 0 ? (
          <Text style={styles.emptyText}>No vitamins scheduled for this day.</Text>
        ) : (
          <>
            {selectedSupplements.map((sup) => {
              const done = sup.takenToday || checked[sup.id];

              return (
                <View key={sup.id} style={styles.todoRow}>
                  <TouchableOpacity
                    onPress={() => toggleCheck(sup.id)}
                    style={[styles.checkbox, done && styles.checkboxDone]}
                  >
                    {done && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>

                  <View style={styles.todoContent}>
                    <Text
                      style={[
                        styles.todoName,
                        done && { textDecorationLine: 'line-through', color: '#7b8b81' },
                      ]}
                    >
                      {sup.name}
                    </Text>

                    <Text style={styles.todoSubtext}>
                      {sup.times.length > 0 ? sup.times.join(', ') : 'Anytime'}
                    </Text>

                    <Text style={styles.todoSubtext}>
                      {sup.withFood ? 'With Food' : 'No Food'}
                    </Text>
                  </View>
                </View>
              );
            })}

            <View
              style={[
                styles.statusPill,
                completionPercent === 100
                  ? styles.allDonePill
                  : completionPercent > 0
                  ? styles.partialPill
                  : styles.nonePill,
              ]}
            >
              <Text style={styles.statusPillText}>
                {completionPercent === 100
                  ? 'All Done'
                  : completionPercent > 0
                  ? 'Partially Complete'
                  : 'Not Started'}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccebc7',
    paddingTop: 42,
    alignItems: 'center',
  },
  hero: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 12,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#163221',
    marginTop: 10,
    marginBottom: 16,
  },
  weekNav: {
    width: '86%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  arrowButton: {
    padding: 6,
  },
  monthRangeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#173221',
  },
  weekCard: {
    width: '86%',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayBubble: {
    width: 42,
    height: 60,
    borderRadius: 21,
    backgroundColor: '#f4f7f2',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  todayBubble: {
    borderWidth: 2,
    borderColor: '#0f8d46',
  },
  selectedBubble: {
    backgroundColor: '#0f8d46',
  },
  selectedBubbleText: {
    color: '#ffffff',
  },
  dayLetter: {
    fontSize: 15,
    fontWeight: '700',
    color: '#223127',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#223127',
  },
  legendRow: {
    width: '86%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 13,
    color: '#304237',
  },
  detailsCard: {
    width: '86%',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#324237',
    marginBottom: 6,
  },
  completionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#324237',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#8a8a8a',
    fontStyle: 'italic',
    fontSize: 16,
    marginTop: 6,
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0f8d46',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxDone: {
    backgroundColor: '#0f8d46',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  todoContent: {
    flex: 1,
  },
  todoName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b2a20',
    marginBottom: 2,
  },
  todoSubtext: {
    fontSize: 14,
    color: '#5f6f65',
    marginBottom: 2,
  },
  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 6,
  },
  nonePill: {
    backgroundColor: '#f1f1f1',
  },
  partialPill: {
    backgroundColor: '#ffe86a',
  },
  allDonePill: {
    backgroundColor: '#79c98b',
  },
  statusPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#253328',
  },
});