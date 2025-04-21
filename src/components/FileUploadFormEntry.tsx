import { Label } from "@/components/ui/label";
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
    <div className="grid w-full gap-1.5">
      <Label htmlFor={formkey}>{heading}</Label>
      <UploadButton
        endpoint="yamlFileUploader"
        onClientUploadComplete={(res) => {
          onChange(res[0].ufsUrl);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
        appearance={{
          button: "ut-ready:bg-primary ut-uploading:cursor-not-allowed rounded-r-none ut-uploading:after:bg-primary",
          container: "w-max flex-row rounded-md border-foreground/20 border",
          allowedContent: "hidden",
        }}
      />
    </div>
  );
};

export default FileUploadFormEntry;
