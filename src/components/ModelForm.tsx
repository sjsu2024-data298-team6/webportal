import DropdownFormEntry from "@/components/DropdownFormEntry";
import TextFormEntry from "@/components/TextFormEntry";
import { useState } from "react";
import { z } from "zod";
import FormPart from "./FormPart";

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
});

interface FormData {
  params: string;
  model: string;
}

export default function ModelForm() {
  const [formData, setFormData] = useState<FormData>({
    params: "",
    model: "",
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

      const endpoint = `${process.env.NEXT_PUBLIC_LAMBDA_URL}?data=${encodeURI(JSON.stringify(formData))}&task=model`;

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
      params: "",
      model: "",
    });
    setErrors({});
  };

  const loadDevInputs = () => {
    setFormData({
      params: '{"epochs": 10, "imgsz": 640, "batch": 8}',
      model: "yolo",
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
        options={[
          { name: "YOLOv11", value: "yolo" },
          { name: "RT-DETR", value: "rtdetr" },
        ]}
        value={formData.model}
        onChange={(value) => handleChange("model", value)}
      />
      {errors.model && <span className="text-red-500">{errors.model}</span>}

      <TextFormEntry
        heading="Parameters"
        formkey="params"
        placeholder="{...}"
        type="textarea"
        value={formData.params}
        onChange={(value) => handleChange("params", value)}
      />
      {errors.params && <span className="text-red-500">{errors.params}</span>}
    </FormPart>
  );
}
