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

export default function CodeInput({ length, onCodeFull }: CodeInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const [elementToFocus, setElementToFocus] = useState<HTMLInputElement>();
  const [isDeleting, setIsDeleting] = useState(false);

  const keyDownHandler = (e: KeyboardEvent) => {
    const keyCode = e.code;
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

  useEffect(() => {
    const containerElement = document.getElementById(
      "code-container"
    ) as HTMLDivElement;
    containerElement.addEventListener("keydown", keyDownHandler);

    return () => {
      containerElement.removeEventListener("keydown", keyDownHandler);
    };
  }, [values]);

  useEffect(() => {
    if (values.every((el) => el!!)) {
      const code = values.join("");
      onCodeFull(code);
    }

    elementToFocus?.focus();
  }, [values, elementToFocus, onCodeFull]);

  const focusHandler = (_: React.FocusEvent<HTMLInputElement>) => {
    if (isDeleting) return;
    //Get the index of the first empty input
    const firstEmptyInputIndex = values.findIndex((el) => !el);

    if (firstEmptyInputIndex === -1) {
      //focus the last input if all full
      const lastInput = getInputElementByIndex(values.length - 1);
      lastInput?.focus();
    } else {
      //focus the first empty input
      const firstEmptyInput = getInputElementByIndex(firstEmptyInputIndex)!;
      firstEmptyInput.focus();
    }
  };

  const changeHandler = (
    event: React.FormEvent<HTMLInputElement>,
    index: number
  ) => {
    // if (values[index]) return;

    const inputElement = event.nativeEvent.target as HTMLInputElement;
    const value = inputElement.value;
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

  return (
    <div id="code-container">
      {[...Array(length)].map((_, index) => (
        <Input
          id={BASE_CODE_INPUT_ID + index}
          key={index}
          type="number"
          autoFocus
          onFocus={focusHandler}
          onChange={(e) => changeHandler(e, index)}
          value={values[index]}
        />
      ))}
    </div>
  );
}
