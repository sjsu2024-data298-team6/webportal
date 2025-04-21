import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextFormEntryProps {
  heading: string;
  formkey: string;
  placeholder?: string;
  type?: "text" | "textarea";
  value: string;
  onChange: (value: string) => void;
}

const TextFormEntry: React.FC<TextFormEntryProps> = ({
  heading,
  formkey,
  placeholder,
  type = "text",
  value,
  onChange,
}) => {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor={formkey}>{heading}</Label>
      {type === "textarea" ? (
        <Textarea
          id={formkey}
          name={formkey}
          placeholder={placeholder ?? ""}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          type={type}
          id={formkey}
          name={formkey}
          placeholder={placeholder ?? ""}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
};

export default TextFormEntry;
