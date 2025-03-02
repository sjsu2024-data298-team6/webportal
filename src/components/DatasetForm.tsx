import DropdownFormEntry from "@/components/DropdownFormEntry";
import TextFormEntry from "@/components/TextFormEntry";
import { useState } from "react";
import { z } from "zod";
import FormPart from "./FormPart";

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
    event.preventDefault();

    try {
      FormSchema.parse(formData);
      console.log("Validated form data:", formData);

      const endpoint = `${process.env.NEXT_PUBLIC_LAMBDA_URL}?data=${encodeURI(JSON.stringify(formData))}&task=dataset`;

      console.log(endpoint);

      fetch(endpoint, {
        method: "POST",
        mode: "cors",
      })
        .then((response) => {
          if (response.status !== 200) {
            console.error("Error:", response);
          } else {
            console.log("Form data submitted:", formData);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    } catch (e) {
      if (e instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof FormData, string>> = {};
        e.errors.forEach((err) => {
          if (err.path[0] in formData) {
            fieldErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
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
    <FormPart
      handleSubmit={handleSubmit}
      resetForm={resetForm}
      loadDevInputs={loadDevInputs}
      errors={errors}
    >
      <span className="text-xl font-semibold">Dataset details</span>

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
        options={[
          { name: "VisDrone Direct Zip", value: "visdrone" },
          { name: "Roboflow Link", value: "roboflow" },
        ]}
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
  );
}
