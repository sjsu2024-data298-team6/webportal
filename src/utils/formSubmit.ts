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
    const endpoint = `${process.env.NEXT_PUBLIC_LAMBDA_URL}?data=${encodeURIComponent(
      JSON.stringify(data),
    )}&task=${task}`;

    fetch(endpoint, {
      method: "POST",
      mode: "cors",
    })
      .then((response) => {
        if (response.status !== 200) {
          console.error("Error:", response);
          response.json().then((text) => alert(text));
        } else {
          console.log("Form data submitted:", data);
          resetForm();
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
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
