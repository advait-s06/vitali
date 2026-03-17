import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  onPress?: () => void;
};

export default function ModalButton({ label, onPress }: Props) {
  return (
    <View style={styles.iconContainer}>
      <Pressable style={[styles.button, { backgroundColor: '#c2ecc7'}]} onPress={onPress}>
        <Text style={[styles.buttonLabel, { color: '#25292e'}]}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 75,
    height: 75,
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#0000',
    fontSize: 16,
  },
});
