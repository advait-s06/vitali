import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Supplement } from '../../services/supplements';
import {
  getSupplements,
  toggleTakenForDate,
} from '../../services/supplements';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [supplements, setSupplements] = useState<Supplement[]>([]);

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

  const selectedDateKey = currentDate.toISOString().split('T')[0];

  const selectedSupplements = supplements.filter((sup) =>
    sup.days.includes(selectedDayName)
  );

  const completedCount = selectedSupplements.filter((sup) =>
    (sup.takenDates ?? []).includes(selectedDateKey)
  ).length;

  const totalCount = selectedSupplements.length;

  const completionPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const toggleCheck = async (id: string) => {
    await toggleTakenForDate(id, selectedDateKey);
    const updated = await getSupplements();
    setSupplements(updated);
  };

  const handleMarkAllTaken = async () => {
    for (const sup of selectedSupplements) {
      const done = (sup.takenDates ?? []).includes(selectedDateKey);
      if (!done) {
        await toggleTakenForDate(sup.id, selectedDateKey);
      }
    }

    const updated = await getSupplements();
    setSupplements(updated);
  };

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={26}
              color="#2b7a45"
            />
          </View>

          <View>
            <Text style={styles.heroTitle}>Calendar</Text>
            <Text style={styles.heroSubtitle}>Track your vitamins by day</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.todayButton}
          onPress={() => setCurrentDate(new Date())}
        >
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekCard}>
        <Text style={styles.weekLabel}>WEEK VIEW</Text>

        <View style={styles.weekNav}>
          <TouchableOpacity onPress={goToPreviousWeek} style={styles.arrowButton}>
            <Ionicons name="chevron-back" size={22} color="#ffffff" />
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
            <Ionicons name="chevron-forward" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.dayRow}>
          {weekDays.map((day, index) => {
            const selected = isSameDay(day, currentDate);

            return (
              <TouchableOpacity
                key={index}
                style={[styles.dayBubble, selected && styles.selectedDayBubble]}
                onPress={() => setCurrentDate(day)}
              >
                <Text style={[styles.dayLabel, selected && styles.selectedDayText]}>
                  {day
                    .toLocaleDateString('en-US', { weekday: 'short' })
                    .toUpperCase()}
                </Text>

                <Text style={[styles.dayNumber, selected && styles.selectedDayText]}>
                  {day.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#ececec' }]} />
          <Text style={styles.legendText}>None</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f2d65c' }]} />
          <Text style={styles.legendText}>Partial</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#86cc91' }]} />
          <Text style={styles.legendText}>All Done</Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.dateHeader}>
          <MaterialCommunityIcons
            name="calendar-check-outline"
            size={22}
            color="#2a6a3e"
          />
          <Text style={styles.dateHeaderText}>
            {currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercent}>{completionPercent}%</Text>
          </View>

          <View style={styles.progressTextWrap}>
            <Text style={styles.progressTitle}>
              {completedCount} of {totalCount} Completed
            </Text>
            <Text style={styles.progressSubtitle}>
              {totalCount === 0
                ? 'Nothing scheduled for this day.'
                : completionPercent === 100
                ? 'Everything is done!'
                : 'Keep going — you’re making progress.'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {selectedSupplements.length === 0 ? (
          <Text style={styles.emptyText}>No vitamins scheduled for this day.</Text>
        ) : (
          <>
            {selectedSupplements.map((sup) => {
              const done = (sup.takenDates ?? []).includes(selectedDateKey);

              return (
                <View key={sup.id} style={styles.todoCard}>
                  <TouchableOpacity
                    onPress={() => toggleCheck(sup.id)}
                    style={[styles.checkbox, done && styles.checkboxDone]}
                  >
                    {done && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>

                  <View style={styles.todoContent}>
                    <Text style={[styles.todoName, done && styles.todoNameDone]}>
                      {sup.name}
                    </Text>

                    <Text style={styles.todoSubtext}>
                      {sup.times.length > 0 ? sup.times.join(', ') : 'Anytime'}
                    </Text>

                    <Text style={styles.todoSubtext}>
                      {sup.withFood ? 'With Food' : 'No Food'}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      done ? styles.statusTaken : styles.statusPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        done ? styles.statusTakenText : styles.statusPendingText,
                      ]}
                    >
                      {done ? 'Taken' : 'Pending'}
                    </Text>
                  </View>
                </View>
              );
            })}

            <TouchableOpacity
              style={styles.markAllButton}
              onPress={handleMarkAllTaken}
            >
              <Ionicons name="checkmark" size={20} color="#ffffff" />
              <Text style={styles.markAllButtonText}>Mark All as Taken</Text>
            </TouchableOpacity>

            <View
              style={[
                styles.bottomStatus,
                completionPercent === 100
                  ? styles.bottomStatusDone
                  : completionPercent > 0
                  ? styles.bottomStatusPartial
                  : styles.bottomStatusNone,
              ]}
            >
              <Text style={styles.bottomStatusText}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#dff0d8',
  },
  content: {
    paddingTop: 22,
    paddingBottom: 40,
    alignItems: 'center',
  },

  heroCard: {
    width: '90%',
    backgroundColor: '#c6e5bb',
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#dff0d8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  heroTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#1e3d2b',
    marginBottom: 2,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#587262',
    fontWeight: '500',
  },
  todayButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  todayButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2c4735',
  },

  weekCard: {
    width: '90%',
    backgroundColor: '#2f8449',
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
  },
  weekLabel: {
    color: '#daf1da',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  monthRangeText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  arrowButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#26733f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayBubble: {
    width: 44,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#3d9157',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayBubble: {
    backgroundColor: '#d8efab',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ddf4df',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  selectedDayText: {
    color: '#20482c',
  },

  legendRow: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 18,
    height: 18,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#445a4c',
  },

  detailsCard: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 18,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dateHeaderText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#283f30',
    marginLeft: 8,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  progressCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 8,
    borderColor: '#6bb570',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    backgroundColor: '#f8fcf7',
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: '800',
    color: '#24382b',
  },
  progressTextWrap: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#24372c',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#738279',
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: '#e7eee5',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#8b8b8b',
    fontStyle: 'italic',
    marginTop: 8,
  },

  todoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbfdfb',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eef3ed',
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3c9a59',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxDone: {
    backgroundColor: '#4d9e5f',
    borderColor: '#4d9e5f',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  todoContent: {
    flex: 1,
  },
  todoName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#24352b',
    marginBottom: 3,
  },
  todoNameDone: {
    textDecorationLine: 'line-through',
    color: '#7f8c84',
  },
  todoSubtext: {
    fontSize: 14,
    color: '#77837b',
    marginBottom: 2,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 10,
  },
  statusTaken: {
    backgroundColor: '#d9efda',
  },
  statusPending: {
    backgroundColor: '#f4e7b8',
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  statusTakenText: {
    color: '#367d48',
  },
  statusPendingText: {
    color: '#8c6c10',
  },

  markAllButton: {
    backgroundColor: '#238846',
    borderRadius: 24,
    paddingVertical: 16,
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  markAllButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
  },

  bottomStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginTop: 14,
  },
  bottomStatusDone: {
    backgroundColor: '#8dcb94',
  },
  bottomStatusPartial: {
    backgroundColor: '#f2d65c',
  },
  bottomStatusNone: {
    backgroundColor: '#ececec',
  },
  bottomStatusText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2b3c31',
  },
});