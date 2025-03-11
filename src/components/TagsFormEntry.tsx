import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useState,
  type KeyboardEvent,
  type ChangeEvent,
  useEffect,
} from "react";

interface TagInputProps {
  placeholder?: string;
  maxTags?: number;
  onTagsChange?: (tags: string[]) => void;
  heading: string;
  formkey: string;
  reset: number;
}

export default function TagsFormEntry({
  placeholder = "Type and press Enter...",
  maxTags = Number.POSITIVE_INFINITY,
  onTagsChange,
  heading,
  formkey,
  reset = 0,
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    if (reset) {
      resetInternal();
    }
  }, [reset]);

  const resetInternal = () => {
    setTags([]);
    setInputValue("");
  };

  let backCounter = 0;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();

      // Don't add if we've reached the maximum number of tags
      if (tags.length >= maxTags) return;

      // Don't add duplicate tags
      if (!tags.includes(inputValue.trim())) {
        const newTags = [...tags, inputValue.trim()];
        setTags(newTags);
        onTagsChange?.(newTags);
      }

      setInputValue("");
    } else if (e.key === "Backspace") {
      backCounter++;
      if (backCounter == 2) {
        backCounter = 0;
        removeTag(-1);
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    if (tags.length === 0) {
      return;
    }

    const newTags =
      indexToRemove === -1
        ? tags.slice(0, -1)
        : tags.filter((_, index) => index !== indexToRemove);

    setTags(newTags);
    onTagsChange?.(newTags);
  };

  return (
    <span className="flex w-full flex-row items-start gap-8">
      <label htmlFor={formkey} className="w-1/5 font-semibold">
        {heading}
      </label>
      <div className="flex w-4/5 flex-wrap gap-2 rounded border border-black">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="text-primary m-1 flex items-center gap-1 rounded bg-gray-100 px-1"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-primary/70 hover:text-primary focus:text-primary focus:outline-none"
                aria-label={`Remove ${tag} tag`}
              >
                <FontAwesomeIcon icon={faXmarkCircle} size="sm" />
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="w-4/5 grow rounded px-1 outline-none"
          id={formkey}
          name={formkey}
        />
      </div>
    </span>
  );
}
