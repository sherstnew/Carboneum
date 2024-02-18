import { StyleSheet, Text, View } from 'react-native';

export default function HistoryItem(props) {
  return (
    <View style={styles.item}>
      <Text style={styles.text}>{props.time} </Text>
      <Text style={styles.text}> {props.level}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingRight: 50,
    marginTop: 20,
    flexDirection: 'row',
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 24,
  }
});
