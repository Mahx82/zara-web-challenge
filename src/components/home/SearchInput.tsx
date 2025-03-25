import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { MagnifierIcon } from '@/components/shared/icons/MagnifierIcon';

interface Props {
  initialValue?: string;
  onSearch: (characterName: string) => void;
}

export function SearchInput({ onSearch, initialValue }: Props) {
  const [inputValue, setInputValue] = useState(initialValue ?? '');
  const debouncedValue = useDebounce(inputValue);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  useEffect(() => {
    setInputValue(initialValue ?? '');
  }, [initialValue]);

  return (
    <div className="mx-4 mt-6 flex items-center border-b-1 border-b-black md:mx-12">
      <MagnifierIcon className="h-4 w-4 text-black" />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        placeholder="Search a character..."
        className="w-full p-2 text-base text-black uppercase placeholder:text-[#aaa] focus:outline-none"
      />
    </div>
  );
}
