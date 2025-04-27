import DropdownFormEntry from "@/components/DropdownFormEntry";
import TextFormEntry from "@/components/TextFormEntry";
import FileUploadFormEntry from "@/components/FileUploadFormEntry";
import TagsFormEntry from "@/components/TagsFormEntry";
import DatasetTable from "@/components/DatasetTable";
import { useEffect, useState } from "react";
import { z } from "zod";
import { FormPart } from "@/components/FormPart";
import handleSubmitHelper from "@/utils/formSubmit";
import { Button } from "@/components/ui/button";

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

interface ModelData {
  value: string;
  name: string;
  yamlFile: string;
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

  const [modelTypesList, setModelTypesList] = useState<ModelData[]>([]);
  const [model, setModel] = useState<ModelData | undefined>(undefined);

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

    if (key === "model") {
      const modelData = modelTypesList.filter((m) => m.value === value).at(0);
      setModel(modelData);
      setFormData((prev) => ({
        ...prev,
        ["yaml_utkey"]: modelData?.yamlFile,
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
    handleSubmitHelper(
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
      model: "yolov11_base",
      yaml_utkey:
        "https://raw.githubusercontent.com/sjsu2024-data298-team6/ultralytics/refs/heads/main/ultralytics/cfg/models/11/yolo11.yaml",
      datasetId: 1,
      tags: ["test"],
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormPart
        title="Model Information"
        description="Basic information about your model."
      >
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

        {model && !model?.yamlFile && (
          <FileUploadFormEntry
            heading="YAML model config file"
            formkey="yamlfile"
            onChange={(value) => handleChange("yaml_utkey", value)}
          />
        )}
      </FormPart>
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={Object.values(errors).some((error) => error !== undefined)}
          variant={"default"}
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
