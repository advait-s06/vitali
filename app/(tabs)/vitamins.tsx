import { useVitamins } from '@/VitaminContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type { Supplement } from '../../services/supplements';
import {
  addSupplement,
  deleteSupplement,
  getSupplements,
  toggleTaken as toggleTakenService,
  updateSupplement,
} from '../../services/supplements';

export default function Vitamins() {
  const { supplements, setSupplements } = useVitamins();

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<Date[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [withFood, setWithFood] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());
  const [editingVitaminId, setEditingVitaminId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function loadSupplements() {
        const data = await getSupplements();
        setSupplements(data);
      }

      loadSupplements();
    }, [setSupplements])
  );

  const daysOfWeek = [
    { id: 0, label: 'S', full: 'Sunday' },
    { id: 1, label: 'M', full: 'Monday' },
    { id: 2, label: 'T', full: 'Tuesday' },
    { id: 3, label: 'W', full: 'Wednesday' },
    { id: 4, label: 'T', full: 'Thursday' },
    { id: 5, label: 'F', full: 'Friday' },
    { id: 6, label: 'S', full: 'Saturday' },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const toggleDay = (dayName: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayName)
        ? prev.filter((d) => d !== dayName)
        : [...prev, dayName]
    );
  };

  const onTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed') {
      return;
    }

    if (date) {
      setTempTime(date);
    }
  };

  const removeTime = (indexToRemove: number) => {
    setSelectedTimes((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const resetForm = () => {
    setEditingVitaminId(null);
    setText('');
    setSelectedDays([]);
    setSelectedTimes([]);
    setWithFood(false);
    setShowPicker(false);
    setTempTime(new Date());
  };

  const handleEditVitamin = (item: Supplement) => {
    setEditingVitaminId(item.id);
    setText(item.name);
    setSelectedDays(item.days);
    setWithFood(item.withFood);

    const parsedTimes = item.times.map((timeString) => {
      const parsed = new Date(`2000-01-01 ${timeString}`);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    });

    setSelectedTimes(parsedTimes.length > 0 ? parsedTimes : []);
  };

  const saveVitamin = async () => {
    if (!text.trim() || selectedTimes.length === 0) return;

    const vitamin: Supplement = {
      id: editingVitaminId ?? Date.now().toString(),
      name: text.trim(),
      days: selectedDays,
      times: selectedTimes.map(formatTime),
      withFood,
      takenToday: false,
    };

    if (editingVitaminId) {
      const existing = supplements.find((s) => s.id === editingVitaminId);

      await updateSupplement({
        ...vitamin,
        takenToday: existing?.takenToday ?? false,
      });
    } else {
      await addSupplement(vitamin);
    }

    const updated = await getSupplements();
    setSupplements(updated);
    resetForm();
  };

  const handleToggleTaken = async (id: string) => {
    await toggleTakenService(id);
    const updated = await getSupplements();
    setSupplements(updated);
  };

  const handleDeleteVitamin = async (id: string) => {
    await deleteSupplement(id);
    const updated = await getSupplements();
    setSupplements(updated);
  };

  const todaysCount = supplements.filter((item) => !item.takenToday).length;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Vitamins</Text>

        <View style={styles.heroIconWrap}>
          <MaterialCommunityIcons name="pill" size={32} color="#169c4e" />
        </View>
      </View>

      <View style={styles.formCard}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="add-circle" size={26} color="#8ac89b" />
          <Text style={styles.sectionTitle}>Add a Vitamin</Text>
        </View>

        <View style={styles.inputWrap}>
          <Ionicons name="leaf-outline" size={22} color="#3c9a59" />
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Enter vitamin name..."
            placeholderTextColor="#7d8f83"
          />
        </View>

        <Text style={styles.smallLabel}>Repeat on</Text>
        <View style={styles.daysRow}>
          {daysOfWeek.map((day) => {
            const selected = selectedDays.includes(day.full);

            return (
              <TouchableOpacity
                key={day.id}
                style={[styles.dayCircle, selected && styles.dayCircleActive]}
                onPress={() => toggleDay(day.full)}
              >
                <Text
                  style={[
                    styles.dayCircleText,
                    selected && styles.dayCircleTextActive,
                  ]}
                >
                  {day.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.twoColumnRow}>
          <View style={styles.column}>
            <Text style={styles.smallLabel}>Time</Text>

            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowPicker(true)}
            >
              <Ionicons name="time-outline" size={20} color="#17854a" />
              <Text style={styles.timeButtonText}>+ Add Time</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.column}>
            <Text style={styles.smallLabel}>With Food?</Text>

            <View style={styles.foodToggleRow}>
              <TouchableOpacity
                style={[styles.foodChoice, withFood && styles.foodChoiceYes]}
                onPress={() => setWithFood(true)}
              >
                <Text
                  style={[
                    styles.foodChoiceText,
                    withFood && styles.foodChoiceTextActive,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.foodChoice, !withFood && styles.foodChoiceNo]}
                onPress={() => setWithFood(false)}
              >
                <Text
                  style={[
                    styles.foodChoiceText,
                    !withFood && styles.foodChoiceTextActive,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {selectedTimes.length > 0 && (
          <View style={styles.timeChipsWrap}>
            {selectedTimes.map((time, index) => (
              <View key={index} style={styles.timeChip}>
                <Text style={styles.timeChipText}>{formatTime(time)}</Text>
                <TouchableOpacity onPress={() => removeTime(index)}>
                  <Ionicons name="close" size={16} color="#6d7d74" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.addButton} onPress={saveVitamin}>
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={styles.addButtonText}>
            {editingVitaminId ? 'Save Changes' : 'Add Vitamin'}
          </Text>
        </TouchableOpacity>

        {editingVitaminId && (
          <TouchableOpacity style={styles.cancelEditButton} onPress={resetForm}>
            <Text style={styles.cancelEditButtonText}>Cancel Edit</Text>
          </TouchableOpacity>
        )}

        {showPicker && (
          <View style={styles.pickerCard}>
            <DateTimePicker
              value={tempTime}
              mode="time"
              display="spinner"
              is24Hour={false}
              onChange={onTimeChange}
              style={styles.picker}
            />

            <View style={styles.pickerActions}>
              <TouchableOpacity
                style={styles.cancelPickerButton}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.cancelPickerText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmPickerButton}
                onPress={() => {
                  setSelectedTimes((prev) => [...prev, tempTime]);
                  setShowPicker(false);
                }}
              >
                <Text style={styles.confirmPickerText}>Confirm Time</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.listHeader}>
        <View style={styles.sectionTitleRow}>
          <MaterialCommunityIcons name="pill" size={24} color="#f07e4d" />
          <Text style={styles.sectionTitle}>Your Vitamins</Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.historyLink}>View History</Text>
        </TouchableOpacity>
      </View>

      {supplements.map((item) => (
        <View key={item.id} style={styles.vitaminCard}>
          <View style={styles.vitaminTopRow}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name="pill" size={36} color="#f29c36" />
            </View>

            <View style={styles.vitaminMain}>
              <View style={styles.nameRow}>
                <Text style={styles.vitaminName}>{item.name}</Text>

                <View style={styles.badge}>
                  <Ionicons
                    name={item.takenToday ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={item.takenToday ? '#228b4e' : '#6f8677'}
                  />
                  <Text
                    style={[
                      styles.badgeText,
                      { color: item.takenToday ? '#228b4e' : '#6f8677' },
                    ]}
                  >
                    {item.takenToday ? 'Active' : 'Pending'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={18} color="#6a786f" />
                <Text style={styles.infoText}>
                  {item.times.length > 0 ? item.times.join(', ') : 'Anytime'}
                </Text>

                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={16}
                  color="#6a786f"
                  style={{ marginLeft: 10 }}
                />
                <Text style={styles.infoText}>
                  {item.withFood ? 'With Food' : 'No Food'}
                </Text>
              </View>

              <Text style={styles.daysText}>
                Days:{' '}
                {item.days.length > 0
                  ? item.days.map((d) => d.slice(0, 3)).join(', ')
                  : 'None'}
              </Text>

              <View
                style={[
                  styles.statusPill,
                  item.takenToday ? styles.statusTaken : styles.statusPending,
                ]}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    item.takenToday
                      ? styles.statusTakenText
                      : styles.statusPendingText,
                  ]}
                >
                  {item.takenToday ? 'Taken today' : 'Not taken yet today'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.markButton}
              onPress={() => handleToggleTaken(item.id)}
            >
              <Ionicons name="checkmark" size={20} color="#177f45" />
              <Text style={styles.markButtonText}>
                {item.takenToday ? 'Undo' : 'Mark Taken'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditVitamin(item)}
            >
              <Ionicons name="create-outline" size={20} color="#8b6a08" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteVitamin(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4c43" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {supplements.length > 0 && todaysCount === 0 && (
        <View style={styles.emptyDoneCard}>
          <View style={styles.emptyDoneIcon}>
            <Ionicons name="calendar-outline" size={32} color="#1f7b46" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emptyDoneTitle}>No more vitamins today!</Text>
            <Text style={styles.emptyDoneText}>
              You're all set. Great job staying consistent.
            </Text>
          </View>
        </View>
      )}

      {supplements.length === 0 && (
        <View style={styles.emptyDoneCard}>
          <View style={styles.emptyDoneIcon}>
            <Ionicons name="medkit-outline" size={32} color="#1f7b46" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emptyDoneTitle}>No vitamins yet</Text>
            <Text style={styles.emptyDoneText}>
              Add your first vitamin to start tracking.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6fff8',
  },
  content: {
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: '#ccebc7',
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#113222',
  },
  heroIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#b9e1b3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#17251f',
  },
  inputWrap: {
    marginTop: 18,
    borderWidth: 2,
    borderColor: '#abd6af',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fcf7',
  },
  input: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    color: '#1d2f25',
  },
  smallLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#17251f',
    marginTop: 18,
    marginBottom: 10,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#edf5ed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleActive: {
    backgroundColor: '#4fc264',
  },
  dayCircleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e2f26',
  },
  dayCircleTextActive: {
    color: '#fff',
  },
  twoColumnRow: {
    flexDirection: 'row',
    marginTop: 14,
    justifyContent: 'space-between',
    gap: 16,
  },
  column: {
    flex: 1,
  },
  timeButton: {
    backgroundColor: '#e7f2e6',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeButtonText: {
    color: '#17854a',
    fontSize: 16,
    fontWeight: '700',
  },
  foodToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  foodChoice: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#edf5ed',
  },
  foodChoiceYes: {
    backgroundColor: '#22a04b',
  },
  foodChoiceNo: {
    backgroundColor: '#22a04b',
  },
  foodChoiceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4e6255',
  },
  foodChoiceTextActive: {
    color: '#fff',
  },
  timeChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eef5ed',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  timeChipText: {
    color: '#33493d',
    fontWeight: '600',
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#169c4e',
    borderRadius: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  listHeader: {
    marginTop: 22,
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLink: {
    color: '#169c4e',
    fontSize: 16,
    fontWeight: '700',
  },
  vitaminCard: {
    backgroundColor: '#f9fcf7',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2ede0',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  vitaminTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 86,
    height: 86,
    borderRadius: 20,
    backgroundColor: '#dcefdc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  vitaminMain: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  vitaminName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#17311f',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e6f2e7',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 5,
    color: '#52655a',
    fontSize: 15,
  },
  daysText: {
    fontSize: 15,
    color: '#3f5648',
    marginBottom: 10,
  },
  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusPending: {
    backgroundColor: '#f9edd7',
  },
  statusTaken: {
    backgroundColor: '#ddefdc',
  },
  statusPillText: {
    fontSize: 15,
    fontWeight: '700',
  },
  statusPendingText: {
    color: '#bf7b1b',
  },
  statusTakenText: {
    color: '#1d8b49',
  },
  markButton: {
    flex: 1,
    backgroundColor: '#dcefdc',
    borderRadius: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  markButtonText: {
    color: '#177f45',
    fontWeight: '800',
    fontSize: 16,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#f9e1df',
    borderRadius: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  deleteButtonText: {
    color: '#ef4c43',
    fontWeight: '800',
    fontSize: 16,
  },
  emptyDoneCard: {
    marginHorizontal: 16,
    marginTop: 6,
    backgroundColor: '#e4f0e3',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyDoneIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#d4e9cf',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  emptyDoneTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e3a28',
    marginBottom: 4,
  },
  emptyDoneText: {
    fontSize: 15,
    color: '#445c4e',
    lineHeight: 22,
  },
  pickerCard: {
    marginTop: 16,
    backgroundColor: '#135f2a',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d9e8d8',
  },
  picker: {
    alignSelf: 'center',
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  cancelPickerButton: {
    flex: 1,
    backgroundColor: '#edf2ed',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmPickerButton: {
    flex: 1,
    backgroundColor: '#169c4e',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelPickerText: {
    color: '#53685b',
    fontWeight: '700',
    fontSize: 15,
  },
  confirmPickerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  cancelEditButton: {
    marginTop: 10,
    backgroundColor: '#edf2ed',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelEditButtonText: {
    color: '#53685b',
    fontWeight: '700',
    fontSize: 16,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#f8efcf',
    borderRadius: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  editButtonText: {
    color: '#8b6a08',
    fontWeight: '800',
    fontSize: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
});