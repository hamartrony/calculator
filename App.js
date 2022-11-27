import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Button from "./src/components/button/Button";
import Display from "./src/components/display/Display";

export default function App() {
  const [myValue, setValue] = useState("0"); //exibido no display
  const [display, setDisplay] = useState(false); //limpa display
  const [operator, setOperator] = useState(""); //operadores
  const [values, setValues] = useState([0, 0]); //numeros para calculo
  const [current, setCurrent] = useState(0); //indice no array de numeros para calculo

  useEffect(() => {
    const valueFloat = parseFloat(myValue); //converte valor da tela em float
    const newvalue = [...values]; // novo array com os valores
    newvalue[current] = valueFloat; // novo array na posicao current insere novo valor no indice apontado
    setValues(newvalue);
  }, [myValue, operator]);

  const addDigit = (n) => {
    //verifica em value se existe ponto.
    if (n === "." && myValue.includes(".")) {
      return;
    }
    const clearDisplay = display || myValue === "0"; //variavel para limpar o display, caso 2 situações sejam satisfeitas (display(true) ou value(!=0))
    const currentValue = clearDisplay ? "" : myValue; //variavel assume "" se limpar display for true. Ou assume valor.
    const dispValue = currentValue + n; //variavel concatena valores em value e novo digito

    setValue(dispValue);
    setDisplay(false);
  };

  const clearMemo = () => {
    setValue("0");
    setDisplay(false);
    setValues([0, 0]);
    setCurrent(0);
  };

  const setOperation = (op) => {
    if (current === 0) {
      setOperator(op);
      setCurrent(1);
      setDisplay(true);
      // setValue("");
      return;
    } //se ja tiver algum valor no array
    else {
      const equals = op === "=";
      const value = [...values];

      //tenta modificar a posição 0 de values, caso a operação seja bem sucedida
      try {
        console.log(value[0], value[1]);
        value[0] = eval(`${value[0]} ${operator} ${value[1]}`); //eval verifica se e possivel realizar a operação e insere na posicao 0
      } catch (e) {
        value[0] = values[0]; //se nao for possivel realizer operarção, value[0] retoma o valor do array no state
      }

      value[1] = 0; //posiçao 1 fica pronto para receber novos valores (dentro desta funcção)
      setValue(value[0]);
      setOperator(equals ? "" : op);
      setCurrent(equals ? 0 : 1);
      setValues(value);
      setDisplay(true);
    }
  };

  useEffect(() => {});

  return (
    <SafeAreaView style={styles.container}>
      <Display value={myValue} />
      <View style={styles.buttons}>
        <Button label="AC" onClick={clearMemo} />
        <Button label="+/-" />
        <Button label="%" />
        <Button label="/" operator onClick={() => setOperation("/")} />
        <Button label="7" onClick={() => addDigit("7")} />
        <Button label="8" onClick={() => addDigit("8")} />
        <Button label="9" onClick={() => addDigit("9")} />
        <Button label="X" operator onClick={() => setOperation("*")} />
        <Button label="4" onClick={() => addDigit("4")} />
        <Button label="5" onClick={() => addDigit("5")} />
        <Button label="6" onClick={() => addDigit("6")} />
        <Button label="-" operator onClick={() => setOperation("-")} />
        <Button label="1" onClick={() => addDigit("1")} />
        <Button label="2" onClick={() => addDigit("2")} />
        <Button label="3" onClick={() => addDigit("3")} />
        <Button label="+" operator onClick={() => setOperation("+")} />
        <Button label="0" double onClick={() => addDigit(0)} />
        <Button label="." onClick={() => addDigit(".")} />
        <Button label="=" operator onClick={() => setOperation("=")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
