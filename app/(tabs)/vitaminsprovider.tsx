import type { Supplement } from '@/app/VitaminContext';
import { useVitamins } from '@/app/VitaminContext';
import Button from '@/components/Button';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Vitamins() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [text, setText] = useState('');
  const { supplements, setSupplements } = useVitamins();
  const daysOfWeek = [
    { id: 0, label: 'S', full: 'Sunday' },
    { id: 1, label: 'M', full: 'Monday' },
    { id: 2, label: 'T', full: 'Tuesday' },
    { id: 3, label: 'W', full: 'Wednesday' },
    { id: 4, label: 'T', full: 'Thursday' },
    { id: 5, label: 'F', full: 'Friday' },
    { id: 6, label: 'S', full: 'Saturday' },
  ];
  const [selectedTimes, setSelectedTimes] = useState<Date[]>([]);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [withFood, setWithFood] = useState<boolean>(false);

  const onTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowPicker(false);
    if (event.type === 'set' && date) {
      setSelectedTimes([...selectedTimes, date]);
    }
  };

  const removeTime = (indexToRemove: number) => {
    setSelectedTimes(selectedTimes.filter((_: Date, index: number) => index !== indexToRemove));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleDay = (dayName: string) => {
    if (selectedDays.includes(dayName)) {
      setSelectedDays(selectedDays.filter((d: string) => d !== dayName));
    } else {
      setSelectedDays([...selectedDays, dayName]);
    }
  };

  const addVitamin = () => {
    if (text.trim() === '') return;
    const newSupplement = {
      id: Date.now().toString(),
      name: text,
      days: selectedDays,
      times: selectedTimes.map(formatTime),
      withFood: withFood,
    };
    setSupplements((prev: Supplement[]) => [...prev, newSupplement]);
    setText('');
    setSelectedDays([]);
    setSelectedTimes([]);
    setWithFood(false);
  };

  const showVitaminDetails = (item: Supplement) => {
    Alert.alert(
      item.name,
      'Days: ' + (item.days.join(', ') || 'None') + '\nTimes: ' + (item.times.join(', ') || 'None') + '\nWith Food: ' + (item.withFood ? 'Yes' : 'No')
    );
  };

  const deleteVitamin = (id: string) => {
    setSupplements((prev: Supplement[]) => prev.filter((s: Supplement) => s.id !== id));
  };

  const EmptyState = () => (
    <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
      <Text>No Vitamins Yet</Text>
    </View>
  );

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>
            Add Vitamins
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input}
          onChangeText = {newText => setText(newText)}
          defaultValue={text}
          placeholder="Enter Vitamin here..."/>
        </View>
        <View style = {styles.daysContainer}>
          {daysOfWeek.map((day, index) => {
          const isSelected = selectedDays.includes(day.full);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayButton,
                  isSelected && styles.selectedDayButton
                ]}
                onPress={() => toggleDay(day.full)}
              >
                <Text style={[
                  styles.dayText, 
                  isSelected && styles.selectedDayText
                ]}>
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
              <Text style={[styles.choiceText, withFood && styles.selectedChoiceText]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.choiceButton, !withFood && styles.selectedChoice]} 
              onPress={() => setWithFood(false)}
            >
              <Text style={[styles.choiceText, !withFood && styles.selectedChoiceText]}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Button label="Add Vitamin" onPress={addVitamin}/>
        <View style ={styles.headerContainer}>
          <Text style={styles.header}>Your Vitamins</Text>
        </View>
        <View style={styles.vitaminList}>
          {supplements.length === 0 ? (
            <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
              <Text>No Vitamins Yet</Text>
            </View>
          ) : (
            <FlatList
              horizontal
              data={supplements}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.vitaminItem}>
                  <TouchableOpacity style={styles.vitaminIconContainer} onPress={() => showVitaminDetails(item)}>
                    <Text style={styles.vitaminIcon}>💊</Text>
                    <Text style={styles.vitaminName}>{item.name}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteVitamin(item.id)} style={styles.deleteVitaminButton}>
                    <Text style={styles.deleteVitaminIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f9ff',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    flex: 1/12,
    alignItems: 'center',
    marginTop: 25,
  },
  headerContainer: {
    flex: 1/8,
    alignItems: 'flex-start',
    marginTop: 25,
  },
  header: {
    fontSize: 42,
    color: '#028146'
  },
  daysContainer: {
    flex: 1/12,
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
    flex: 1/12,
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
  scrollView: {
    backgroundColor: '#e9f9ff',
  },
  foodContainer: {
    flex: 1/12,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
  },
  subHeader: {
    fontSize: 16
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
    justifyContent: 'space-between',    minHeight: 100,
    marginTop: 20,  },
  vitaminItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    flexDirection: 'row',
  },
  vitaminIconContainer: {
    alignItems: 'center',
  },
  vitaminIcon: {
    fontSize: 30,
  },
  vitaminName: {
    fontSize: 14,
    textAlign: 'center',
  },
  deleteVitaminButton: {
    marginLeft: 5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteVitaminIcon: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
