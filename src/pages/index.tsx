import DropdownFormEntry from "@/components/DropdownFormEntry";
import TextFormEntry from "@/components/TextFormEntry";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [names, setNames] = useState("");
  const [params, setParams] = useState("");
  const [datasetType, setDatasetType] = useState("");
  const [model, setModel] = useState("");

  const handleSubmit = () => {
    console.log(url, names, params, datasetType, model);
  };

  const resetForm = () => {
    setUrl("");
    setNames("");
    setParams("");
    setDatasetType("");
    setModel("");
  };

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <header className="row-start-1 flex flex-col items-center gap-8 sm:items-start">
        <span className="text-3xl font-bold">
          Obstacle Detection for Drone Flight Path
        </span>
      </header>
      <main className="row-start-2 flex w-full flex-col items-center gap-8 sm:items-start 2xl:w-2/3">
        <div className="flex w-full flex-col items-start gap-4">
          <span className="text-xl font-semibold">Dataset details</span>

          <TextFormEntry
            heading="URL"
            formkey="url"
            placeholder="https://..."
            value={url}
            onChange={setUrl}
          />

          <DropdownFormEntry
            heading="Type"
            formkey="dataset_type"
            options={[{ name: "VisDrone Direct Zip", value: "visdrone" }]}
            value={datasetType}
            onChange={setDatasetType}
          />

          <TextFormEntry
            heading="Class Names"
            formkey="names"
            placeholder="Enter the class names, comma separated, no spaces, in the correct order"
            value={names}
            onChange={setNames}
          />

          <span className="text-xl font-semibold">Model details</span>

          <DropdownFormEntry
            heading="Type"
            formkey="model"
            options={[
              { name: "YOLOv11", value: "yolo" },
              { name: "RT-DETR", value: "rtdetr" },
            ]}
            value={model}
            onChange={setModel}
          />

          <TextFormEntry
            heading="Parameters"
            formkey="params"
            placeholder="{...}"
            type="textarea"
            value={params}
            onChange={setParams}
          />

          <div className="grid grid-cols-2 gap-4">
            <button
              className="rounded-xl border border-black bg-green-500 px-4 py-1 hover:bg-green-600"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="rounded-xl border border-black bg-red-500 px-4 py-1 hover:bg-red-600"
              onClick={resetForm}
            >
              Clear
            </button>
          </div>
        </div>
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
