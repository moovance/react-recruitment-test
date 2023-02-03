import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CodeInput from "./CodeInput";

it("displays inputs on screen, with the first one focused", async () => {
  render(
    <CodeInput
      length={4}
      onCodeFull={(code: string) => {
        console.log({ code });
      }}
    />
  );

  const inputs: HTMLInputElement[] = await screen.findAllByRole("spinbutton", {
    name: "",
  });
  expect(inputs).toHaveLength(4);
  expect(inputs[0]).toHaveFocus();
});

it("calls onCodeFull when all inputs are filled", async () => {
  const onCodeFullHandler = (code: string) => {
    console.log(code);
  };
  const testingCode = "1285";
  const consoleSpy = jest.spyOn(console, "log");

  render(<CodeInput length={4} onCodeFull={onCodeFullHandler} />);

  userEvent.keyboard(testingCode);

  expect(consoleSpy).toHaveBeenCalledWith(testingCode);
});

it("takes only numbers", async () => {
  const testingCode = "sdT'(85cv,74p";

  render(
    <CodeInput
      length={4}
      onCodeFull={(code: string) => {
        console.log(code);
      }}
    />
  );

  const consoleSpy = jest.spyOn(console, "log");
  userEvent.keyboard(testingCode);

  expect(consoleSpy).toHaveBeenCalledWith("8574");
});

it("stays focus on the first empty input while entering numbers", async () => {
  render(
    <CodeInput
      length={4}
      onCodeFull={(code: string) => {
        console.log(code);
      }}
    />
  );

  const inputs: HTMLInputElement[] = await screen.findAllByRole("spinbutton", {
    name: "",
  });

  expect(inputs).toHaveLength(4);

  expect(inputs[0]).toHaveFocus();

  userEvent.keyboard("4");
  expect(inputs[1]).toHaveFocus();

  userEvent.keyboard("4");
  expect(inputs[2]).toHaveFocus();

  userEvent.keyboard("4");
  expect(inputs[3]).toHaveFocus();
});

it("delete numbers when clicking on backspace and still focus the first empty input", async () => {
  render(
    <CodeInput
      length={4}
      onCodeFull={(code: string) => {
        console.log(code);
      }}
    />
  );

  const inputs: HTMLInputElement[] = await screen.findAllByRole("spinbutton", {
    name: "",
  });

  expect(inputs).toHaveLength(4);

  userEvent.keyboard("4786");
  expect(inputs[3]).toHaveFocus();

  userEvent.type(inputs[3], "{backspace}{backspace}");
  expect(inputs[2]).toHaveFocus();

  userEvent.type(inputs[2], "{backspace}");
  expect(inputs[1]).toHaveFocus();

  userEvent.type(inputs[1], "{backspace}");
  expect(inputs[0]).toHaveFocus();
});
