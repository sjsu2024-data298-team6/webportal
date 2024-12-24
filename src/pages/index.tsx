import DropdownFormEntry from "@/components/DropdownFormEntry";
import TextFormEntry from "@/components/TextFormEntry";
import { useState } from "react";

interface FormData {
  url: string;
  names: string;
  params: string;
  datasetType: string;
  model: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    url: "",
    names: "",
    params: "",
    datasetType: "",
    model: "",
  });

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const endpoint = `${process.env.NEXT_PUBLIC_LAMBDA_URL}?url=${formData.url}&dataset_type=${formData.datasetType}&names=${formData.names}&model=${formData.model}&params=${JSON.stringify(formData.params)}`;

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
  };

  const resetForm = () => {
    setFormData({
      url: "",
      names: "",
      params: "",
      datasetType: "",
      model: "",
    });
  };

  const loadDevInputs = () => {
    setFormData({
      url: "https://github.com/ultralytics/assets/releases/download/v0.0.0/VisDrone2019-DET-train.zip",
      names:
        "pedestrian,people,bicycle,car,van,truck,tricycle,awning-tricycle,bus,motor",
      params: '{"epochs": 1}',
      datasetType: "visdrone",
      model: "yolo",
    });
  };

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <header className="row-start-1 flex flex-col items-center gap-8 sm:items-start">
        <span className="text-3xl font-bold">
          Obstacle Detection for Drone Flight Path
        </span>
      </header>
      <main className="row-start-2 flex w-full flex-col items-center gap-8 sm:items-start 2xl:w-2/3">
        <form
          className="flex w-full flex-col items-start gap-4"
          onSubmit={handleSubmit}
        >
          <span className="text-xl font-semibold">Dataset details</span>

          <TextFormEntry
            heading="URL"
            formkey="url"
            placeholder="https://..."
            value={formData.url}
            onChange={(value) => handleChange("url", value)}
          />

          <DropdownFormEntry
            heading="Type"
            formkey="dataset_type"
            options={[{ name: "VisDrone Direct Zip", value: "visdrone" }]}
            value={formData.datasetType}
            onChange={(value) => handleChange("datasetType", value)}
          />

          <TextFormEntry
            heading="Class Names"
            formkey="names"
            placeholder="Enter the class names, comma separated, no spaces, in the correct order"
            value={formData.names}
            onChange={(value) => handleChange("names", value)}
          />

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

          <TextFormEntry
            heading="Parameters"
            formkey="params"
            placeholder="{...}"
            type="textarea"
            value={formData.params}
            onChange={(value) => handleChange("params", value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <button
              type="submit"
              className="rounded-xl border border-black bg-green-500 px-4 py-1 hover:bg-green-600"
            >
              Submit
            </button>
            <button
              type="button"
              className="rounded-xl border border-black bg-red-500 px-4 py-1 hover:bg-red-600"
              onClick={resetForm}
            >
              Clear
            </button>

            {process.env.NEXT_PUBLIC_DEPLOYMENT !== "prod" && (
              <button
                type="button"
                className="rounded-xl border border-black px-4 py-1"
                onClick={loadDevInputs}
              >
                dev inputs
              </button>
            )}
          </div>
        </form>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6">
        {" < "}
        <span className="">SJSU Fall 2024</span>
        {" | "}
        <span className="">MSDA Capstone Project</span>
        {" | "}
        <a className="hover:underline" target="_blank">
          Shrey Agarwal
        </a>
        {" | "}
        <a
          className="hover:underline"
          href="https://github.com/ibrahimmkhalid"
          target="_blank"
        >
          Ibrahim Khalid
        </a>
        {" | "}
        <a className="hover:underline" target="_blank">
          Sung Won Lee
        </a>
        {" | "}
        <a className="hover:underline" target="_blank">
          Justin Wang
        </a>
        {" > "}
      </footer>
    </div>
  );
}
