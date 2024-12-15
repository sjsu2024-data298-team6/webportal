interface TextFormEntryProps {
  heading: string;
  formkey: string;
  placeholder?: string;
  type?: "text" | "textarea";
}

const TextFormEntry: React.FC<TextFormEntryProps> = ({
  heading,
  formkey,
  placeholder,
  type = "text",
}) => {
  return (
    <span className="flex w-full flex-row items-start gap-8">
      <label htmlFor={formkey} className="w-1/5 font-semibold">
        {heading}
      </label>
      {type === "textarea" ? (
        <textarea
          className="w-4/5 grow rounded border border-black px-1"
          id={formkey}
          name={formkey}
          placeholder={placeholder ?? ""}
          rows={5}
        ></textarea>
      ) : (
        <input
          className="w-4/5 grow rounded border border-black px-1"
          type={type}
          id={formkey}
          name={formkey}
          placeholder={placeholder ?? ""}
        ></input>
      )}
    </span>
  );
};

export default TextFormEntry;
