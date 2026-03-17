import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function PlantPicker({ isVisible, children, onClose }: Props) {
  return (
    <View>
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose a Plant</Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" color="#0000" size={22} />
          </Pressable>
        </View>
        {children}
      </View>
    </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: '25%',
    width: '100%',
    backgroundColor: '#c2ecc7',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
  },
  titleContainer: {
    height: '16%',
    backgroundColor: '#93f79f',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#0000',
    fontSize: 16,
  },
});
