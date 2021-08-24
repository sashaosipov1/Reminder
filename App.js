import 'react-native-gesture-handler';
import React, {Component, useState} from 'react';
import {Alert, BackHandler, Button, Platform, SafeAreaView, StyleSheet, Text, View, TextInput, FlatList} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from "@react-navigation/stack";
import NotifService from './NotifService';

const Stack = createStackNavigator();

let remind_data = [

]

const UselessTextInput = (props) => {
    return (
        <TextInput
            {...props}
            editable
            maxLength={100}
        />
    );
}

const HomeScreen = ({navigation}) => {
  return (<SafeAreaView style={styles.container}>
    <View>
      <Text style={styles.projectTitle}>
        Напоминалка
      </Text>
    </View>
    <View style={styles.button}>
      <Button
          title="Сделать напоминалку"
          onPress={() => navigation.navigate('Создать новое напоминание')
          }
      />
    </View>

    <View style={styles.button}>
      <Button
          title="Все напоминалки"
          onPress={() => navigation.navigate('Все напоминания')}
      />
    </View>

    <View style={styles.buttonExit}>
      <View style={styles.fixToText}>
        <Button
            title="Выход"
            onPress={() =>
                Alert.alert("Внимание!", "Вы действительно хотите выйти?", [
                  {
                    text: "Отмена",
                    onPress: () => null,
                    style: "cancel"
                  },
                  { text: "Выйти", onPress: () => BackHandler.exitApp() }
                ])
            }
        />
      </View>
    </View>
  </SafeAreaView>)
}

const NewRemind = () => {
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [value, onChangeText] = useState('');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (<SafeAreaView style={styles.container}><View>
    <View>
        <Text>Введите текст напоминания:</Text>
        <UselessTextInput
            style={{
                borderWidth: 1,
                borderColor: 'blue',
                borderRadius: 10
            }}
            multiline
            numberOfLines={4}
            onChangeText={remindMessage => onChangeText(remindMessage)}
            value={value}
        />
        <Text>{`Выбранная дата: ` + date.getDate() + `.` + date.getMonth() + `\n` + `Выбранное время: ` + date.getHours() + `:` + date.getMinutes()
        }</Text>

      <Separator/>

    </View>

    <View>
      <Button onPress={showDatepicker} title="Выберите дату" />
    </View>
    <Separator/>
    <View>
      <Button onPress={showTimepicker} title="Выберите время" />
    </View>
      <Separator/>
      <MyPush myDate={date} remindMessage={value}/>
    {show && (
        <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
        />
    )}
  </View></SafeAreaView>)
}

class Parser extends Component {
    constructor(props) {
        super(props);
        this.state = {};


        this.notif = new NotifService(
            this.onRegister.bind(this),
            this.onNotif.bind(this),
        );
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>

                <FlatList
                    refreshing='true'
                    data={remind_data}
                    renderItem={({item}) => <View style={styles.item}>
                        <View style={styles.fixToText}>
                        <Text style={styles.title} >{`Время: ` + item.hours + `:` + item.minutes + `\n Дата: ` + item.date + `.` + item.month}</Text>
                        <Button
                            title='Открыть'
                            onPress={() => {
                                Alert.alert(item.index.toString() + item.title)
                            }}
                        >

                        </Button>

                        <Button
                            title='Удалить'
                            onPress={() => {
                                Alert.alert("До удаления")
                                remind_data.splice(item.index, 1)
                                Alert.alert("После удаления")
                                this.forceUpdate()
                                Alert.alert("После апдейта")

                            }}
                        >
                        </Button></View><Separator/></View>}
                    keyExtractor={(item, index) => item + index}
                />

            </SafeAreaView>)

    }

    onRegister(token) {
        this.setState({registerToken: token.token, fcmRegistered: true});
    }

    onNotif(notif) {
        Alert.alert(notif.title, notif.message);
    }

    handlePerm(perms) {
        Alert.alert('Permissions', JSON.stringify(perms));
    }
}

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Главная" component={HomeScreen} />
          <Stack.Screen name="Создать новое напоминание" component={NewRemind} />
          <Stack.Screen name="Все напоминания" component={Parser} />
          <Stack.Screen name="MyPush" component={MyPush} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

let i = -1

class MyPush extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.notif = new NotifService(
            this.onRegister.bind(this),
            this.onNotif.bind(this),
        );
    }


    render() {
        return (
            <View>

                <Button
                    title='Создать напоминалку'
                    onPress={ () => {
                        i++
                        this.pushTest(this.myTime(), this.props.remindMessage)
                        let newObj = {date: this.props.myDate.getDate(), title: this.props.remindMessage, month: this.props.myDate.getMonth(),
                            hours: this.props.myDate.getHours(), minutes: this.props.myDate.getMinutes(), index:  i}
                        remind_data.push(newObj)
                        Alert.alert('Напоминалка успешно создана!')
                    }}>
                </Button>

                {/*<TouchableOpacity*/}
                {/*    style={styles.button}*/}
                {/*    onPress={() => {*/}
                {/*        this.notif.cancelAll();*/}
                {/*    }}>*/}
                {/*    <Text>Cancel all notifications</Text>*/}
                {/*</TouchableOpacity>*/}
            </View>
        );
    }

    onRegister(token) {
        this.setState({registerToken: token.token, fcmRegistered: true});
    }

    onNotif(notif) {
        Alert.alert(notif.title, notif.message);
    }

    handlePerm(perms) {
        Alert.alert('Permissions', JSON.stringify(perms));
    }

    pushTest(remindDate, remindMessage) {
        this.notif.scheduleNotif(remindDate, remindMessage)
    }

    myTime() {
        return this.props.myDate - Date.now();
    }
}


const Separator = () => (
    <View style={styles.separator} />
);

const styles = StyleSheet.create({
    item: {
        marginTop: 10,
    },
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
    container1: {
        flex: 1,
        justifyContent: 'center',
        width: '90%',
        marginHorizontal: 36,
    },
  textField: {
    borderWidth: 1,
    borderColor: "#AAAAAA",
    margin: 5,
    padding: 5,
    width: "70%",
  },
  title: {
    textAlign: 'center',
    fontSize: 15,
      width: `40%`,

  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  projectTitle: {
    textAlign: `center`,
    color: `#0b07f5`,
    fontSize: 35,
    marginBottom: 100,
  },
  button: {
    marginBottom: 25,
  },
  buttonExit: {

  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  spacer: {
    height: 10,
  },
  buttonTest: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 200,
    marginTop: 10
  },
  messageInput: {
      height: 40,
      borderWidth: 1,
      borderColor: 'blue',
      borderRadius: 15
  },
  hideItem: {
      display: `none`
  }
});

export default App;

