import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxFormEntryProps {
  label: string;
  formkey: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const CheckboxFormEntry: React.FC<CheckboxFormEntryProps> = ({
  label,
  formkey,
  value,
  onChange,
}) => {
  return (
    <div className="grid w-full gap-1.5">
      <div className="flex items-center space-x-2">
        <Checkbox id={formkey} checked={value} onCheckedChange={onChange} />
        <Label htmlFor={formkey}>{label}</Label>
      </div>
    </div>
  );
};

export default CheckboxFormEntry;
