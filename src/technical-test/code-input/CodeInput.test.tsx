import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CodeInput from "./CodeInput";

it("works", () => {
  expect(true).toBe(true);
});

it("displays inputs on screen, with first one focused", async () => {
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

it("calls onCodeFull when all inputs filled", async () => {
  const onCodeFullHandler = (code: string) => {
    console.log(code);
  };
  const testingCode = "1285";
  const consoleSpy = jest.spyOn(console, "log");

  render(<CodeInput length={4} onCodeFull={onCodeFullHandler} />);

  userEvent.keyboard(testingCode);

  expect(consoleSpy).toHaveBeenCalledWith(testingCode);
});
