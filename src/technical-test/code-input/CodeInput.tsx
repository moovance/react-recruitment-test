import { useState, useEffect } from "react";
import Input from "../Input";

interface CodeInputProps {
  length: number;
  onCodeFull: (code: string) => void;
}

const BASE_CODE_INPUT_ID = "code_input_";

const getInputElementByIndex = (index: number) => {
  if (index < 0) return;
  return document.getElementById(
    BASE_CODE_INPUT_ID + index
  ) as HTMLInputElement;
};

const getFirstEmptyInput = (values: string[]) => {
  const firstEmptyInputIndex = values.findIndex((el) => !el);
  const firstEmptyInput = getInputElementByIndex(firstEmptyInputIndex);
  return firstEmptyInput;
};

const getLastInput = (values: string[]) => {
  return getInputElementByIndex(values.length - 1);
};

export default function CodeInput({ length, onCodeFull }: CodeInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const [elementToFocus, setElementToFocus] = useState<HTMLInputElement>();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (values.every((el) => !!el)) {
      const code = values.join("");
      onCodeFull(code);
    }

    elementToFocus?.focus();
  }, [values, elementToFocus, onCodeFull, isDeleting]);

  const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keyCode = e.key;
    const currentInput = e.target as HTMLInputElement;
    const currentIndex = +currentInput.id.split("").pop()!;

    if (keyCode === "Backspace") {
      setIsDeleting(true);

      setValues((prevState) => {
        const nextState = [...prevState];
        nextState[currentIndex] = "";
        return nextState;
      });

      if (currentInput.value.length > 0) return;
      if (currentIndex <= 0) return;

      const previousInputElement = getInputElementByIndex(currentIndex - 1);
      setElementToFocus(previousInputElement);
    } else {
      setIsDeleting(false);
    }
  };

  const focusHandler = (_: React.FocusEvent<HTMLInputElement>) => {
    //Enable to change focus while deleting
    if (isDeleting) return;

    //Get the index of the first empty input
    const firstEmptyInputIndex = values.findIndex((el) => !el);

    //if no input is empty
    if (firstEmptyInputIndex === -1) {
      //focus the last input
      const lastInput = getLastInput(values);
      lastInput?.focus();
    } else {
      //focus the first empty input
      const firstEmptyInput = getFirstEmptyInput(values)!;
      firstEmptyInput.focus();
    }
  };

  const changeHandler = (
    event: React.FormEvent<HTMLInputElement>,
    index: number
  ) => {
    const inputElement = event.nativeEvent.target as HTMLInputElement;
    const value = inputElement.value;

    //if trying to have more than 1 number in the input -> return
    if (value.length > 1) return;

    setValues((prevState) => {
      const newState = [...prevState];
      newState[index] = value;
      return newState;
    });

    if (index !== length - 1) {
      //focus the next input
      const currentInput = event.target as HTMLInputElement;
      const nextInput = currentInput.nextElementSibling as HTMLInputElement;

      if (!isDeleting) {
        setElementToFocus(nextInput);
      }
    }
  };

  const clickHandler = (_: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    setIsDeleting(false);
  };

  return (
    <>
      {[...Array(length)].map((_, index) => (
        <Input
          id={BASE_CODE_INPUT_ID + index}
          key={index}
          type="number"
          min={0}
          max={9}
          step={1}
          autoFocus
          onClick={clickHandler}
          onKeyDown={keyDownHandler}
          onFocus={focusHandler}
          onChange={(e) => changeHandler(e, index)}
          value={values[index]}
        />
      ))}
    </>
  );
}
