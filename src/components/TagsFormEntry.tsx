import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";

interface TagInputProps {
  placeholder?: string;
  maxTags?: number;
  onTagsChange: (tags: string[]) => void;
  heading: string;
  formkey: string;
  reset?: number;
  initialTags?: string[];
}

export default function TagsFormEntry({
  placeholder = "Type and press Enter...",
  maxTags = Number.POSITIVE_INFINITY,
  onTagsChange,
  heading,
  formkey,
  reset = 0,
  initialTags = [],
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags, reset]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (tags.length < maxTags) {
        const newTags = [...tags, inputValue.trim()];
        setTags(newTags);
        onTagsChange(newTags);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      e.preventDefault();
      const newTags = tags.slice(0, -1);
      setTags(newTags);
      onTagsChange(newTags);
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onTagsChange(newTags);
  };

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor={formkey}>{heading}</Label>
      <div className="flex w-full flex-wrap gap-2 rounded-md border p-2">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 hover:text-destructive"
                aria-label={`Remove ${tag} tag`}
              >
                <FontAwesomeIcon icon={faXmarkCircle} size="sm" />
              </button>
            </Badge>
          ))}
        </div>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="border-0 p-0 focus-visible:ring-0"
          id={formkey}
          name={formkey}
        />
      </div>
    </div>
  );
}
