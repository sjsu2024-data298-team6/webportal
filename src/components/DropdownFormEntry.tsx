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
    <span className="flex w-full flex-row items-start gap-8">
      <label htmlFor={formkey} className="w-1/5 font-semibold">
        {heading}
      </label>
      <select
        className="w-4/5 grow appearance-none rounded border border-black bg-white px-1"
        id={formkey}
        name={formkey}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          Please select an option
        </option>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </span>
  );
};

export default DropdownFormEntry;
