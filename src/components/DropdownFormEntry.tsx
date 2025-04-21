import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DropdownFormEntryProps {
  heading: string;
  formkey: string;
  options: { name: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

const DropdownFormEntry: React.FC<DropdownFormEntryProps> = ({
  heading,
  formkey,
  options,
  value,
  onChange,
}) => {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor={formkey}>{heading}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={formkey}>
          <SelectValue placeholder="Please select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DropdownFormEntry;
