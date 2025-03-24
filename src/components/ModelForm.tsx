import DropdownFormEntry from "@/components/DropdownFormEntry";
import TextFormEntry from "@/components/TextFormEntry";
import FileUploadFormEntry from "@/components/FileUploadFormEntry";
import TagsFormEntry from "@/components/TagsFormEntry";
import DatasetTable from "@/components/DatasetTable";
import { useEffect, useState } from "react";
import { z } from "zod";
import FormPart from "@/components/FormPart";
import handleSubmitHelper from "@/utils/formSubmit";

const ParamsSchema = z
  .object({
    epochs: z
      .number({
        required_error: "Training epochs are required (epochs)",
        invalid_type_error: "Training epochs must be a number",
      })
      .min(10, "Epochs must be at least 10"),
    imgsz: z
      .number({
        required_error: "Image size is required (imgsz)",
        invalid_type_error: "Image size must be a number",
      })
      .multipleOf(32, "Image size should be a multiple of 32")
      .optional(),
    batch: z.number({
      required_error: "Batch size is required (batch)",
      invalid_type_error: "Batch size must be a number",
    }),
  })
  .strict();

const FormSchema = z.object({
  params: z
    .string()
    .refine((val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    }, "Invalid JSON format")
    .refine((val) => {
      try {
        const parsed = JSON.parse(val);
        ParamsSchema.parse(parsed);
        return true;
      } catch (e) {
        if (e instanceof z.ZodError) {
          throw e;
        }
        return false;
      }
    }, "Something went wrong during validation"),
  model: z.string().nonempty("Model type is required"),
  datasetId: z.number(),
  tags: z
    .string()
    .regex(/^[\w-]+$/, "Can only contain alphanumeric, underscore, and dashes")
    .array()
    .optional(),
  yaml_utkey: z.string().url().optional(),
});

interface FormData {
  params: string;
  model: string;
  datasetId?: number;
  yaml_utkey?: string;
  tags: string[];
}

export default function ModelForm() {
  const [formData, setFormData] = useState<FormData>({
    params: "",
    model: "",
    tags: [],
  });

  const [tagsReset, setTagsReset] = useState<number>(0);

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const [modelTypesList, setModelTypesList] = useState([]);

  useEffect(() => {
    const fetchDatasetLinks = async () => {
      const response = await fetch("/api/models");
      const data = await response.json();
      setModelTypesList(data);
    };

    fetchDatasetLinks();
  }, []);

  const handleChange = (
    key: keyof FormData,
    value: string | string[] | number,
  ) => {
    console.log(key, value);
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (value !== "custom_yolo" && key === "model") {
      setFormData((prev) => ({
        ...prev,
        ["yaml_utkey"]: undefined,
        ["tags"]: [],
        ["datasetId"]: undefined,
      }));
    }

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
      "model",
      FormSchema,
      formData,
      setErrors,
      resetForm,
    );
  };

  const resetForm = () => {
    setFormData({
      params: "",
      model: "",
      yaml_utkey: undefined,
      tags: [],
      datasetId: undefined,
    });
    setErrors({});
    setTagsReset(tagsReset + 1);
  };

  const loadDevInputs = () => {
    setFormData({
      params: '{"epochs": 10, "imgsz": 640, "batch": 8}',
      model: "yolo",
      yaml_utkey: undefined,
      datasetId: 1,
      tags: ["test"],
    });
    setErrors({});
  };

  return (
    <FormPart<FormData>
      handleSubmit={handleSubmit}
      resetForm={resetForm}
      loadDevInputs={loadDevInputs}
      errors={errors}
    >
      <span className="text-xl font-semibold">Model details</span>

      <DropdownFormEntry
        heading="Type"
        formkey="model"
        options={modelTypesList}
        value={formData.model}
        onChange={(value) => handleChange("model", value)}
      />
      {errors.model && <span className="text-red-500">{errors.model}</span>}

      {formData.model && (
        <DatasetTable
          model={formData.model}
          onSelect={(value) => handleChange("datasetId", value.id)}
          selectedId={formData.datasetId}
        />
      )}
      {errors.datasetId && (
        <span className="text-red-500">{errors.datasetId}</span>
      )}

      <TextFormEntry
        heading="Parameters"
        formkey="params"
        placeholder="{...}"
        type="textarea"
        value={formData.params}
        onChange={(value) => handleChange("params", value)}
      />
      {errors.params && <span className="text-red-500">{errors.params}</span>}

      <TagsFormEntry
        placeholder=""
        heading="Tags"
        formkey="tags"
        onTagsChange={(value) => handleChange("tags", value)}
        reset={tagsReset}
        initialTags={formData.tags}
      />
      {errors.tags && <span className="text-red-500">{errors.tags}</span>}

      {formData.model === "custom_yolo" && (
        <FileUploadFormEntry
          heading="YAML model config file"
          formkey="yamlfile"
          onChange={(value) => handleChange("yaml_utkey", value)}
        />
      )}
    </FormPart>
  );
}
