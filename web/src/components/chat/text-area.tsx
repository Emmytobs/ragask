import { FormEvent, useState } from "react";
import { Button } from "./button";
import TextareaAutosize from "react-textarea-autosize";

type TextareaProps = {
  onAddMessage: (message: string) => void;
  disable?: boolean;
};

export const Textarea = (props: TextareaProps) => {
  const { onAddMessage, disable } = props;

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

  const handleSubmit = () => {
    onAddMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); 
      handleSubmit(); 
    }
  };
  
  return (
    <form className="relative flex items-center" onSubmit={handleSubmit}>
      <TextareaAutosize
        disabled={disable}
        placeholder="Ask your document"
        className="flex-auto pl-4 pr-11 py-4 text-gray-700 bg-transparent border border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black placeholder:italic resize-none"
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown} 
        value={inputValue}
      />
      <Button disabled={!inputValue} focus={isFocused} />
    </form>
  );
}
