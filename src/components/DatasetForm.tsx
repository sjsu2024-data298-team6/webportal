import DropdownFormEntry from "@/components/DropdownFormEntry";
import TextFormEntry from "@/components/TextFormEntry";
import { useEffect, useState } from "react";
import { z } from "zod";
import { FormPart } from "@/components/FormPart";
import handleSubmitHelper from "@/utils/formSubmit";
import { Button } from "@/components/ui/button";
import CheckboxFormEntry from "@/components/CheckboxFormEntry";
import DatasetTable from "@/components/DatasetTable";
import TagsFormEntry from "@/components/TagsFormEntry";

const FormSchema = z
  .object({
    name: z.string().nonempty("Name is required"),
    url: z.string().url("Invalid URL format"),
    datasetType: z.string().nonempty("Dataset type is required"),
    shouldCombine: z.boolean(),
    combineID: z.number().optional(),
    tags: z
      .string()
      .regex(
        /^[\w-]+$/,
        "Can only contain alphanumeric, underscore, and dashes",
      )
      .array()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.shouldCombine && data.combineID === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Combine ID is required when combining datasets",
        path: ["combineID"],
      });
    }
  });

interface FormData {
  name: string;
  url: string;
  datasetType: string;
  names?: string;
  shouldCombine: boolean;
  combineID?: number;
  tags: string[];
}

interface DatasetLink {
  value: string;
  name: string;
  extras: string[];
}

export default function DatasetForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    url: "",
    datasetType: "",
    names: "",
    shouldCombine: false,
    combineID: undefined,
    tags: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const [tagsReset, setTagsReset] = useState<number>(0);

  const [dslinks, setDslinks] = useState<DatasetLink[]>([]);

  useEffect(() => {
    const fetchDatasetLinks = async () => {
      const response = await fetch("/api/datasets");
      const data = await response.json();
      console.log(data);
      setDslinks(data);
    };

    fetchDatasetLinks();
  }, []);

  const handleChange = (
    key: keyof FormData,
    value: string | string[] | number | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "datasetType") {
      const dslinkData = dslinks.filter((m) => m.value === value).at(0);

      //TODO: Incorporate this into the backend in the future.
      //      This assumes that visdrone will always have the same class names, which is very likely.
      if (dslinkData?.value === "visdrone") {
        setFormData((prev) => ({
          ...prev,
          ["names"]:
            "pedestrian,people,bicycle,car,van,truck,tricycle,awning-tricycle,bus,motor",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          ["names"]: "",
        }));
      }
    }

    try {
      const schema = FormSchema;
      const result = schema.safeParse({ ...formData, [key]: value });
      if (!result.success) {
        const error = result.error.errors.find((e) => e.path[0] === key);
        setErrors((prev) => ({ ...prev, [key]: error?.message }));
      } else {
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      }
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
      name: "",
      url: "",
      datasetType: "",
      names: "",
      shouldCombine: false,
      combineID: undefined,
      tags: [],
    });
    setErrors({});
    setTagsReset(tagsReset + 1);
  };

  const loadDevInputs = () => {
    setFormData({
      name: "VisDrone Dataset",
      url: "https://github.com/ultralytics/assets/releases/download/v0.0.0/VisDrone2019-DET-test-dev.zip",
      names:
        "pedestrian,people,bicycle,car,van,truck,tricycle,awning-tricycle,bus,motor",
      datasetType: "visdrone",
      shouldCombine: true,
      combineID: 1,
      tags: ["visdrone"],
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
          heading="Name"
          formkey="name"
          placeholder="..."
          value={formData.name}
          onChange={(value) => handleChange("name", value)}
        />
        {errors.name && <span className="text-red-500">{errors.name}</span>}

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
          formkey="datasetType"
          options={dslinks}
          value={formData.datasetType}
          onChange={(value) => handleChange("datasetType", value)}
        />
        {errors.datasetType && (
          <span className="text-red-500">{errors.datasetType}</span>
        )}

        <CheckboxFormEntry
          label="Check to combine with an existing dataset"
          formkey="shouldCombine"
          value={formData.shouldCombine}
          onChange={(value) => {
            handleChange("shouldCombine", value);
          }}
        />
        {errors.shouldCombine && (
          <span className="text-red-500">{errors.shouldCombine}</span>
        )}

        {formData.shouldCombine && (
          <DatasetTable
            model="yolo"
            onSelect={(value) => handleChange("combineID", value.id)}
            selectedId={formData.combineID}
          />
        )}
        {errors.combineID && (
          <span className="text-red-500">{errors.combineID}</span>
        )}

        <TagsFormEntry
          placeholder=""
          heading="Tags"
          formkey="tags"
          onTagsChange={(value) => handleChange("tags", value)}
          reset={tagsReset}
          initialTags={formData.tags}
        />
        {errors.tags && <span className="text-red-500">{errors.tags}</span>}
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
