import Button from '@/components/Button';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Vitamins() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [text, setText] = useState('');
  const daysOfWeek = [
    { id: 0, label: 'S', full: 'Sun' },
    { id: 1, label: 'M', full: 'Mon' },
    { id: 2, label: 'T', full: 'Tue' },
    { id: 3, label: 'W', full: 'Wed' },
    { id: 4, label: 'T', full: 'Thu' },
    { id: 5, label: 'F', full: 'Fri' },
    { id: 6, label: 'S', full: 'Sat' },
  ];
  const [selectedTimes, setSelectedTimes] = useState<Date[]>([]);
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const onTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowPicker(false);
    
    if (event.type === 'set' && date) {
      setSelectedTimes([...selectedTimes, date]);
    }
  };

  const removeTime = (indexToRemove: number) => {
    setSelectedTimes(selectedTimes.filter((_, index) => index !== indexToRemove));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleDay = (dayName: string) => {
    if (selectedDays.includes(dayName)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayName));
    } else {
      setSelectedDays([...selectedDays, dayName]);
    }
  };

  const [withFood, setWithFood] = useState<boolean>(false);
  const toggleFood = () => setWithFood(previousState => !previousState)

  interface Supplement {
    id: string;
    name: string;
    days: string[];
    times: string[];
    withFood: boolean;
  }

  const EmptyState = () => (
   <Text style={{alignItems: 'center', justifyContent: 'center',}}>No Vitamins Yet</Text>
  );

  const Supplements: Supplement[] = []

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
                ))};

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
            <Text>
              {withFood ? "Taken with a meal" : "Meal not necessary"}
            </Text>
          </View>
          <Switch style={{marginTop: -15, marginBottom: 25}}trackColor={{ false: '#767577', true: '#81b0ff' }} thumbColor={withFood ? "#997AFF" : "#f4f3f4"} onValueChange={toggleFood} value={withFood} />
          <Button label="Add Vitamin"/>
          <View style ={styles.headerContainer}>
            <Text style={styles.header}>Your Vitamins</Text>
          </View>
          <View style={styles.vitaminList}>
            <FlatList horizontal data={Supplements} keyExtractor={(item) => item.id}
            renderItem = {({ item }) => (
              <View><Text>{item.name}</Text></View>
            )}
            ListEmptyComponent={EmptyState}
            />
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
    color: '#0281465d'
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
    backgroundColor: '#007AFF', 
    borderColor: '#007AFF',
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
    backgroundColor: '#E1E9FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  chipText: {
    color: '#007AFF',
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
  vitaminList: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});