import React, { useState } from "react";
import { Alert, StyleSheet, View, ScrollView,ImageBackground} from "react-native";
import {
  DatePicker,
  Button,
  Label,
  Form,
  Item,
  Picker,
  Input,
  Text,
  Content,
} from "native-base";
import Loading from "../components/Loading";

import UserSchema from "../schemas/User";
import UserService from "../services/User";

import LibDate from "../lib/date";
import ErrorMessages from "../lib/errors";
import Colors from "../assets/Colors/Colors";
import shadowCode from "../components/shadowCode";

export default function Register({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [childrenName, setChildrenName] = useState("");
  const [gender, setGender] = useState("masculino");
  const [childrenBirthday, setChildrenBirthday] = useState("");
  const [loading, setLoading] = useState(false);

  const values = {
    name,
    email,
    password,
    city,
    childrenBirthday,
    childrenName,
  };

  return (
    <ImageBackground source={require("../assets/cloud-background.png")} style={styles.imageBackground} imageStyle={styles.imageStyle} >
    <ScrollView>
        <Form style={styles.form}>
          <View style={styles.content}>
            <Text style={styles.title}>Perfil do Responsável</Text>
            <Text style={styles.subtitle}>
              Insira abaixo os dados da pessoa responsável pela criança.
            </Text>
            <Input
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor="#ccc"
              onChangeText={(value) => {
                setName(value);
              }}
            />
            <Input
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#ccc"
              keyboardType={"email-address"}
              onChangeText={(value) => {
                setEmail(value);
              }}
            />
            <Input
              style={styles.input}
              placeholder="Cidade"
              placeholderTextColor="#ccc"
              onChangeText={(value) => {
                setCity(value);
              }}
            />
            <Input
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#ccc"
              secureTextEntry={true}
              password={true}
              onChangeText={(value) => {
                setPassword(value);
              }}
            />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>Perfil do Dependente</Text>
            <Text style={styles.subtitle}>
              Insira abaixo os dados da criança.
            </Text>
            <Input
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor="#ccc"
              onChangeText={(value) => {
                setChildrenName(value);
              }}
            />
            <View style={{ marginTop: 20, marginLeft: 20}}>
              <Label style={{ color: "#575757" }}>Gênero</Label>
              <Picker
                note
                mode="dropdown"
                selectedValue={gender}
                style={{ width: "100%" }}
                onValueChange={setGender}
              >
                <Picker.Item label="Masculino" value="masculino" />
                <Picker.Item label="Feminino" value="feminino" />
                <Picker.Item label="Outro" value="outro" />
              </Picker>
            </View>
            <View style={[styles.datepicker, { marginTop: 20, color: "#ccc", marginLeft: 20 }]}>
              <Label style={{ color: "#575757" }}>Data de nascimento</Label>
              <DatePicker
                defaultDate={new Date(2000, 1, 1)}
                minimumDate={new Date(1900, 1, 1)}
                maximumDate={new Date()}
                androidMode={"spinner"}
                placeHolderText="Selecione uma data"
                textStyle={{ color: "green" }}
                placeHolderTextStyle={{ color: "#d3d3d3" }}
                onDateChange={setChildrenBirthday}
                disabled={false}
              />
            </View>
          </View>
          <Button
            style={styles.button}
            onPress={(_) => {
              doSubmit(values, setLoading, navigation);
            }}
            full
            rounded
          >
            <Text style={styles.buttonSubmitText}>Concluir</Text>
          </Button>
        </Form>

        <Loading loading={loading} />
    </ScrollView>
  </ImageBackground>
  );
}

const doSubmit = (values, setLoading, navigation) => {
  const { childrenBirthday } = values;
  values.childrenBirthday = LibDate.dmY2Ymd(
    LibDate.formatDate(childrenBirthday)
  );

  const userSchema = new UserSchema(values);
  const { password } = values;

  setLoading(true);

  UserService.create(userSchema, password)
    .then((_) => {
      Alert.alert(
        "Parabéns",
        "O seu cadastro foi realizado com sucesso. Por favor, entre no aplicativo com o seu e-mail e senha informados.",
        [
          {
            text: "OK",
            onPress: () => {
              setLoading(false);
              navigation.navigate("Login");
            },
          },
        ],
        { cancelable: false }
      );
    })
    .catch((errorCode) => {
      Alert.alert(
        "Erro",
        ErrorMessages[errorCode.toString()],
        [{ text: "OK", onPress: () => setLoading(false) }],
        { cancelable: false }
      );
    });
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: "center"
  },
  content: {
    margin: 20,
    marginBottom:1,
    backgroundColor:"#FAFAFA",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  title: {
    fontWeight:"bold",
    color: "#3F3232",
    fontSize: 22,
    marginTop: 10,
    marginLeft:20
  },
  subtitle: {
    color: Colors.shadowGray,
    fontSize: 14,
    marginBottom: 10,
    alignSelf: "center",
    width:"90%"
  },
  input: {
    alignSelf: "center",
    width:"90%",
    marginLeft: 0,
    marginVertical: 10,
    borderBottomWidth: 0,
    borderRadius: 10,
    backgroundColor: Colors.white,
    color: Colors.shadowGray,
    ...shadowCode,
  },
  datepicker: {
    marginVertical: 10,
  },
  button: {
    marginHorizontal: 60,
    marginBottom: 20,
    marginTop:20,
    width:"65%",
    alignSelf:"center"
  },
  buttonSubmitText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
