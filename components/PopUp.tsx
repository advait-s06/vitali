import { StyleSheet, Text, View } from 'react-native';

type Props = {
    header: string;
    body: string;
}

export default function PopUp({ header, body }: Props) {
    return (
        <View style={styles.popUpContainer}>
                <Text style={styles.headerText}>
                    {header}
                </Text>
                <Text style={styles.text}>
                    {body}
                </Text>
        </View>
    )
}

const styles = StyleSheet.create({
  popUpContainer: {
    width: 350,
    height: 350,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 10,
    borderRadius: 45
  },
  headerText: {
    marginTop: 30,
    fontSize: 24,
    color: '#000000',
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: '#0000'
  }
});