import { useState } from "react";
import { Button } from "./MySendButton";

export const Textarea = () => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false); 

  const handleInputChange = (event: { target: { value: string; }; }) => {
    setInputValue(event.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        placeholder="Ask your document"
        className="flex-auto px-4 py-4 text-gray-700 bg-transparent border border-black rounded-full focus:outline-none focus:ring-1 focus:ring-black placeholder:italic pl-8"
        onChange={handleInputChange}
        onFocus={handleInputFocus} 
        onBlur={handleInputBlur} 
        value={inputValue}
      />
      <Button disabled={!inputValue} focus={isFocused} />
    </div>
  );
};