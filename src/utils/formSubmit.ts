import React from "react";
import { z } from "zod";

const handleSubmitHelper = <T>(
  e: React.FormEvent,
  task: string,
  Schema: z.Schema,
  data: T,
  setErrors: (errors: Partial<Record<keyof T, string>>) => void,
  resetForm: () => void,
) => {
  e.preventDefault();

  try {
    Schema.parse(data);
    const endpoint = `/api/proxy?data=${encodeURIComponent(
      JSON.stringify(data),
    )}&task=${task}`;

    fetch(endpoint, {
      method: "POST",
      mode: "cors",
    })
      .then((response) => {
        if (response.status !== 200) {
          console.error("Error response:", response);
          response.json().then((text) => {
            console.error("Error text:", text);
            alert(text);
            setErrors({ model: "Submission failed" } as Partial<
              Record<keyof T, string>
            >);
          });
        } else {
          console.log("Form data submitted:", data);
          resetForm();
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert("Failed to submit form. Please try again.");
        setErrors({ model: "Submission failed" } as Partial<
          Record<keyof T, string>
        >);
      });
  } catch (e) {
    if (e instanceof z.ZodError) {
      const fieldErrors: Partial<Record<keyof T, string>> = {};
      e.errors.forEach((err) => {
        if (err.path.length > 0) {
          const field = err.path[0] as keyof T;
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
    }
  }
};

export default handleSubmitHelper;
