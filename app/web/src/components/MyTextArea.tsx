import { FormEvent, useState } from "react";
import { Button } from "./MySendButton";

type TextareaProps = {
  onAddMessage: (message: string) => void;
};

export const Textarea = (props: TextareaProps) => {
  const { onAddMessage } = props;

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (event: { target: { value: string } }) => {
    setInputValue(event.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddMessage(inputValue);
    setInputValue("");
  };

  return (
    <form className="relative flex items-center" onSubmit={handleSubmit}>
      <input
        placeholder="Ask your document"
        className="flex-auto px-4 py-4 text-gray-700 bg-transparent border border-black rounded-full focus:outline-none focus:ring-1 focus:ring-black placeholder:italic"
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        value={inputValue}
      />
      <Button disabled={!inputValue} focus={isFocused} />
    </form>
  );
};
