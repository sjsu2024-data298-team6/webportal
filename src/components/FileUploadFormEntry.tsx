import { UploadButton } from "@/utils/uploadthing";
interface FileUploadFormEntryProps {
  heading: string;
  formkey: string;
  onChange: (value: string) => void;
}

const FileUploadFormEntry: React.FC<FileUploadFormEntryProps> = ({
  heading,
  formkey,
  onChange,
}) => {
  return (
    <span className="flex w-full flex-row items-start gap-8">
      <label htmlFor={formkey} className="w-1/5 font-semibold">
        {heading}
      </label>
      <UploadButton
        endpoint="yamlFileUploader"
        onClientUploadComplete={(res) => {
          onChange(res[0].ufsUrl);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </span>
  );
};

export default FileUploadFormEntry;
