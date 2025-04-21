import DropdownFormEntry from "@/components/DropdownFormEntry";
import TextFormEntry from "@/components/TextFormEntry";
import { useEffect, useState } from "react";
import { z } from "zod";
import { FormPart } from "./FormPart";
import handleSubmitHelper from "@/utils/formSubmit";
import { Button } from "@/components/ui/button";

const FormSchema = z.object({
  url: z.string().url("Invalid URL format"),
  names: z
    .string()
    .nonempty("Class names cannot be empty")
    .refine((val) => /,/.test(val), "Classes must be comma separated"),
  datasetType: z.string().nonempty("Dataset type is required"),
});

interface FormData {
  url: string;
  datasetType: string;
  names: string;
}

export default function DatasetForm() {
  const [formData, setFormData] = useState<FormData>({
    url: "",
    datasetType: "",
    names: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const [dslinks, setDslinks] = useState([]);

  useEffect(() => {
    const fetchDatasetLinks = async () => {
      const response = await fetch("/api/datasets");
      const data = await response.json();
      setDslinks(data);
    };

    fetchDatasetLinks();
  }, []);

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    try {
      FormSchema.shape[key].parse(value);
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [key]: e.errors[0].message }));
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    handleSubmitHelper<FormData>(
      event,
      "dataset",
      FormSchema,
      formData,
      setErrors,
      resetForm,
    );
  };

  const resetForm = () => {
    setFormData({
      url: "",
      datasetType: "",
      names: "",
    });
    setErrors({});
  };

  const loadDevInputs = () => {
    setFormData({
      url: "https://github.com/ultralytics/assets/releases/download/v0.0.0/VisDrone2019-DET-test-dev.zip",
      names:
        "pedestrian,people,bicycle,car,van,truck,tricycle,awning-tricycle,bus,motor",
      datasetType: "visdrone",
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormPart
        title="Dataset Information"
        description="Basic information about your dataset."
      >
        <TextFormEntry
          heading="URL"
          formkey="url"
          placeholder="https://..."
          value={formData.url}
          onChange={(value) => handleChange("url", value)}
        />
        {errors.url && <span className="text-red-500">{errors.url}</span>}

        <DropdownFormEntry
          heading="Type"
          formkey="dataset_type"
          options={dslinks}
          value={formData.datasetType}
          onChange={(value) => handleChange("datasetType", value)}
        />
        {errors.datasetType && (
          <span className="text-red-500">{errors.datasetType}</span>
        )}

        <TextFormEntry
          heading="Class Names"
          formkey="names"
          placeholder="Enter the class names, comma separated, in the correct order"
          value={formData.names}
          onChange={(value) => handleChange("names", value)}
        />
        {errors.names && <span className="text-red-500">{errors.names}</span>}
      </FormPart>

      <div className="flex gap-4">
        <Button
          type="submit"
          variant={"default"}
          disabled={Object.values(errors).some((error) => error !== undefined)}
        >
          Submit
        </Button>
        <Button type="button" variant={"destructive"} onClick={resetForm}>
          Clear
        </Button>
        {process.env.NEXT_PUBLIC_DEPLOYMENT !== "prod" && (
          <Button type="button" variant={"outline"} onClick={loadDevInputs}>
            Dev Inputs
          </Button>
        )}
      </div>
    </form>
  );
}
