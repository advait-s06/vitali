import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroLeft}>
          <View style={styles.heroIconBox}>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={28}
              color="#146a38"
            />
          </View>
          <Text style={styles.heroTitle}>Calendar</Text>
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
                style={[
                  styles.dayBubble,
                  selected && styles.selectedDayBubble,
                ]}
                onPress={() => setCurrentDate(day)}
              >
                <Text
                  style={[
                    styles.dayLabel,
                    selected && styles.selectedDayText,
                  ]}
                >
                  {day
                    .toLocaleDateString('en-US', { weekday: 'short' })
                    .toUpperCase()}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    selected && styles.selectedDayText,
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
          <View style={[styles.legendColor, { backgroundColor: '#f0f0f0' }]} />
          <Text style={styles.legendText}>None</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#f6de63' }]} />
          <Text style={styles.legendText}>Partial</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#7bc98d' }]} />
          <Text style={styles.legendText}>All Done</Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.dayHeaderRow}>
          <View style={styles.dayHeaderLeft}>
            <MaterialCommunityIcons
              name="calendar-check-outline"
              size={22}
              color="#1d5d35"
            />
            <Text style={styles.selectedText}>
              {currentDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressCircleOuter}>
            <View
              style={[
                styles.progressCircleInner,
                {
                  borderColor:
                    completionPercent === 100
                      ? '#4ea864'
                      : completionPercent > 0
                      ? '#e6c84b'
                      : '#d4d4d4',
                },
              ]}
            >
              <Text style={styles.progressPercent}>{completionPercent}%</Text>
            </View>
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

        {selectedSupplements.length === 0 ? (
          <Text style={styles.emptyText}>No vitamins scheduled for this day.</Text>
        ) : (
          <>
            <View style={styles.divider} />

            {selectedSupplements.map((sup) => {
              const done = (sup.takenDates ?? []).includes(selectedDateKey);

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
                        done && styles.todoNameDone,
                      ]}
                    >
                      {sup.name}
                    </Text>

                    <Text style={styles.todoSubtext}>
                      {sup.times.length > 0 ? sup.times.join(', ') : 'Anytime'} •{' '}
                      {sup.withFood ? 'With Food' : 'No Food'}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.smallStatusPill,
                      done
                        ? styles.smallStatusTaken
                        : styles.smallStatusPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.smallStatusText,
                        done
                          ? styles.smallStatusTextTaken
                          : styles.smallStatusTextPending,
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
    backgroundColor: '#d9efd2',
    paddingTop: 40,
    alignItems: 'center',
  },

  hero: {
    width: '88%',
    backgroundColor: '#bfe3b5',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#d6edd0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#173a24',
  },
  todayButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  todayButtonText: {
    color: '#244731',
    fontWeight: '700',
    fontSize: 15,
  },

  weekCard: {
    width: '88%',
    backgroundColor: '#1f7a43',
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
  },
  weekLabel: {
    color: '#d7f0d4',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  weekNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  monthRangeText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  arrowButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#176537',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayBubble: {
    width: 42,
    height: 62,
    borderRadius: 18,
    backgroundColor: '#2b864d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayBubble: {
    backgroundColor: '#d2f0a7',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#dff2db',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  selectedDayText: {
    color: '#1d4e2a',
  },

  legendRow: {
    width: '88%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 18,
    height: 18,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: '#355340',
    fontWeight: '600',
  },

  detailsCard: {
    width: '88%',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 20,
  },
  dayHeaderRow: {
    marginBottom: 14,
  },
  dayHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2a4031',
    marginLeft: 8,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  progressCircleOuter: {
    marginRight: 14,
  },
  progressCircleInner: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fbf7',
  },
  progressPercent: {
    fontSize: 20,
    fontWeight: '800',
    color: '#23362b',
  },
  progressTextWrap: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#21362a',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#6c7b72',
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: '#e7eee5',
    marginBottom: 14,
  },

  emptyText: {
    textAlign: 'center',
    color: '#8a8a8a',
    fontStyle: 'italic',
    fontSize: 16,
    marginTop: 4,
  },

  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2d8a4c',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxDone: {
    backgroundColor: '#2d8a4c',
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
    color: '#1b2d21',
    marginBottom: 3,
  },
  todoNameDone: {
    textDecorationLine: 'line-through',
    color: '#7b8b81',
  },
  todoSubtext: {
    fontSize: 14,
    color: '#67776d',
    marginBottom: 2,
  },

  smallStatusPill: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  smallStatusTaken: {
    backgroundColor: '#d8eed8',
  },
  smallStatusPending: {
    backgroundColor: '#f4e7b9',
  },
  smallStatusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  smallStatusTextTaken: {
    color: '#2c7d47',
  },
  smallStatusTextPending: {
    color: '#8c6c10',
  },

  markAllButton: {
    marginTop: 6,
    backgroundColor: '#1f7a43',
    borderRadius: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  markAllButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },

  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 14,
  },
  nonePill: {
    backgroundColor: '#efefef',
  },
  partialPill: {
    backgroundColor: '#f6de63',
  },
  allDonePill: {
    backgroundColor: '#7bc98d',
  },
  statusPillText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2a3a2f',
  },
});