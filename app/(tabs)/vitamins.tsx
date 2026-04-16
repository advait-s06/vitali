import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

 export type Supplement = {
    id: string;
    name: string;
    days: string[];
    times: string[];
    withFood: boolean;
    takenToday: boolean;
  }

export default function Vitamins() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<Date[]>([]);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [withFood, setWithFood] = useState<boolean>(false);

  type VitaminsContextType = {
  supplements: Supplement[];
  setSupplements: React.Dispatch<React.SetStateAction<Supplement[]>>;
  pickedPet: string | null;
  setPickedPet: React.Dispatch<React.SetStateAction<string | null>>;
  pickedPlant: string | null;
  setPickedPlant: React.Dispatch<React.SetStateAction<string | null>>;
};

  const daysOfWeek = [
    { id: 0, label: 'S', full: 'Sunday' },
    { id: 1, label: 'M', full: 'Monday' },
    { id: 2, label: 'T', full: 'Tuesday' },
    { id: 3, label: 'W', full: 'Wednesday' },
    { id: 4, label: 'T', full: 'Thursday' },
    { id: 5, label: 'F', full: 'Friday' },
    { id: 6, label: 'S', full: 'Saturday' },
  ];

  const onTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowPicker(false);
    if (event.type === 'set' && date) {
      setSelectedTimes((prev) => [...prev, date]);
    }
  };

  const removeTime = (indexToRemove: number) => {
    setSelectedTimes((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleDay = (dayName: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayName)
        ? prev.filter((d) => d !== dayName)
        : [...prev, dayName]
    );
  };

  const addVitamin = () => {
    if (text.trim() === '' || selectedTimes.length === 0) return;

    const newSupplement: Supplement = {
      id: Date.now().toString(),
      name: text,
      days: selectedDays,
      times: selectedTimes.map(formatTime),
      withFood,
      takenToday: false,
    };

    setSupplements((prev: Supplement[]) => [...prev, newSupplement]);
    setText('');
    setSelectedDays([]);
    setSelectedTimes([]);
    setWithFood(false);
  };

  const toggleTaken = (id: string) => {
    setSupplements((prev: Supplement[]) =>
      prev.map((item) =>
        item.id === id ? { ...item, takenToday: !item.takenToday } : item
      )
    );
  };

  const deleteVitamin = (id: string) => {
    setSupplements((prev: Supplement[]) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const showVitaminDetails = (item: Supplement) => {
    Alert.alert(
      item.name,
      'Days: ' +
        (item.days.join(', ') || 'None') +
        '\nTimes: ' +
        (item.times.join(', ') || 'None') +
        '\nWith Food: ' +
        (item.withFood ? 'Yes' : 'No') +
        '\nTaken Today: ' +
        (item.takenToday ? 'Yes' : 'No')
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text>No Vitamins Yet</Text>
    </View>
  );

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Add Vitamins</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setText}
            value={text}
            placeholder="Enter Vitamin here..."
          />
        </View>

        <View style={styles.daysContainer}>
          {daysOfWeek.map((day) => {
            const isSelected = selectedDays.includes(day.full);
            return (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayButton,
                  isSelected && styles.selectedDayButton,
                ]}
                onPress={() => toggleDay(day.full)}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelected && styles.selectedDayText,
                  ]}
                >
                  {day.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.timeContainer}>
          <Text>Scheduled Times:</Text>
          <View style={styles.chipsContainer}>
            {selectedTimes.map((time, index) => (
              <View key={index.toString()} style={styles.chip}>
                <Text style={styles.chipText}>{formatTime(time)}</Text>
                <TouchableOpacity onPress={() => removeTime(index)}>
                  <Text style={styles.deleteIcon}> ✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.addButtonText}>+ Add Time</Text>
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              is24Hour={false}
              onChange={onTimeChange}
            />
          )}
        </View>

        <View style={styles.foodContainer}>
          <Text style={styles.subHeader}>Take with food?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.choiceButton, withFood && styles.selectedChoice]}
              onPress={() => setWithFood(true)}
            >
              <Text
                style={[
                  styles.choiceText,
                  withFood && styles.selectedChoiceText,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.choiceButton, !withFood && styles.selectedChoice]}
              onPress={() => setWithFood(false)}
            >
              <Text
                style={[
                  styles.choiceText,
                  !withFood && styles.selectedChoiceText,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.toggleButton} onPress={addVitamin}>
          <Text style={styles.toggleButtonText}>Add Vitamin</Text>
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={styles.header}>Your Vitamins</Text>
        </View>

        <View style={styles.vitaminList}>
          {supplements.length === 0 ? (
            <EmptyState />
          ) : (
            <FlatList
              horizontal
              data={supplements}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
              <View style={styles.vitaminCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.iconText}>💊</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.vitaminName}>{item.name}</Text>
                    <Text style={styles.cardMeta}>
                      {item.times && item.times.length > 0 ? item.times.join(", ") : "No time set"}
                    </Text>
                    <Text style={styles.cardMeta}>
                      {item.withFood ? "With food" : "No food needed"}
                    </Text>
                    <Text style={styles.cardMeta}>
                      {item.takenToday ? "Taken today" : "Not taken yet"}
                    </Text>
                  </View>
                </View>

                {item.days && item.days.length > 0 && (
                  <Text style={styles.cardMeta}>Days: {item.days.join(", ")}</Text>
                )}

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => toggleTaken(item.id)}
                  >
                    <Text style={styles.toggleButtonText}>
                      {item.takenToday ? "Undo" : "Mark Taken"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteVitamin(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
                          showsHorizontalScrollIndicator={false}
                        />
                      )}
                    </View>
                  </View>
                </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f9ff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scrollView: {
    backgroundColor: '#e9f9ff',
  },
  input: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    backgroundColor: '#c2ecc7',
    padding: 10,
    borderRadius: 15,
  },
  inputContainer: {
    flex: 1 / 12,
    alignItems: 'center',
    marginTop: 25,
  },
  headerContainer: {
  alignItems: 'center',
  marginTop: 25,
},
  header: {
    fontSize: 42,
    color: '#028146',
  },
  daysContainer: {
    flex: 1 / 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c2ecc7',
  },
  selectedDayButton: {
    backgroundColor: '#028146',
    borderColor: '#028146',
  },
  dayText: {
    color: '#333',
    fontWeight: '600',
  },
  selectedDayText: {
    color: '#fff',
  },
  timeContainer: {
    flex: 1 / 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    backgroundColor: '#028146',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#028146',
  },
  chipText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteIcon: {
    color: '#FF3B30',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#666',
  },
  addButtonText: {
    color: '#666',
  },
  foodContainer: {
    flex: 1 / 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
  },
  subHeader: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  choiceButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#666',
  },
  selectedChoice: {
    borderStyle: 'solid',
    borderColor: '#028146',
    backgroundColor: '#028146',
  },
  choiceText: {
    color: '#666',
  },
  selectedChoiceText: {
    color: '#fff',
  },
  vitaminList: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 100,
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  actionButton: {
    marginTop: 10,
  },
  actionText: {
    color: '#028146',
    fontWeight: '600',
  },
  deleteText: {
    color: '#FF3B30',
    fontWeight: '600',
  },

  vitaminCard: {
  backgroundColor: "#f7fbf4",
  borderRadius: 18,
  padding: 16,
  marginRight: 12,
  minWidth: 230,
  borderWidth: 1,
  borderColor: "#dfeedd",
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 3,
},

cardHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
},

iconCircle: {
  width: 46,
  height: 46,
  borderRadius: 23,
  backgroundColor: "#dff3dd",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
},

iconText: {
  fontSize: 22,
},

vitaminName: {
  fontSize: 24,
  fontWeight: "700",
  color: "#1f4d33",
},

cardMeta: {
  fontSize: 15,
  color: "#556b5d",
  marginTop: 3,
},

cardActions: {
  flexDirection: "row",
  gap: 10,
  marginTop: 12,
},

toggleButton: {
  backgroundColor: "#dff3dd",
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 16,
},

toggleButtonText: {
  color: "#1f7a3f",
  fontWeight: "600",
},

deleteButton: {
  backgroundColor: "#ffe8e8",
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 16,
},

deleteButtonText: {
  color: "#d84a4a",
  fontWeight: "600",
},
});
