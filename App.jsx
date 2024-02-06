import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HistoryItem from './components/HistoryItem';
import { useState, useEffect } from 'react';

export default function App() {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [CO2Level, setCO2Level] = useState(0);
  const [history, setHistory] = useState([]);

  const clearHistory = async () => {
    await AsyncStorage.setItem('history', JSON.stringify([]));
    setHistory([]);
  };

  const reload = () => {
    setLoaderVisible(true);
    fetch('http://192.168.0.148')
      .then((data) => data.text())
      .then((level) => {
        setCO2Level(level);
        setLoaderVisible(false);
        AsyncStorage.getItem('history').then((value) => {
          value = JSON.parse(value);
          if (value !== null) {
            const hours = new Date().getHours();
            const minutes = new Date().getMinutes();
            const seconds = new Date().getSeconds();
            value.unshift({
              id: `${Math.random() * 1000}`,
              time: `${hours}:${minutes}:${
                String(seconds).length === 1
                  ? String(0) + String(seconds)
                  : seconds
              }`,
              level: level,
            });
            AsyncStorage.setItem('history', JSON.stringify(value)).then(() => {
              setHistory(value);
            });
          } else {
            AsyncStorage.setItem('history', JSON.stringify([]));
            reload();
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    reload();
    setInterval(() => reload(), 60000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <Text style={styles.welcome}>Добрый день!</Text>
      <Text style={styles.header}>Уровень CO2:</Text>
      {/* здесь показывается уровень CO2 */}
      <Text style={styles.level}>
        {CO2Level} %
      </Text>
      <Pressable style={styles.button} onPress={() => reload()}>
        <Text style={styles.text}>Обновить</Text>
      </Pressable>
      <Pressable onPress={async () => await clearHistory()}>
        <Text style={styles.header}>История:</Text>
      </Pressable>
      <ScrollView style={styles.history}>
        {history.map((item) => (
          <HistoryItem key={item.id} time={item.time} level={item.level} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 75,
    paddingLeft: 35,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'start',
    justifyContent: 'left',
  },
  text: {
    color: '#ffffff',
    fontSize: 24,
  },
  welcome: {
    fontSize: 48,
  },
  level: {
    fontSize: 100,
  },
  header: {
    paddingTop: 20,
    fontSize: 28,
  },
  history: {
    marginBottom: 50,
  },
  button: {
    padding: 15,
    marginRight: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    backgroundColor: '#11235A',
    borderRadius: 15,
  },
  loader: {
    width: 30,
    height: 30,
  },
});
