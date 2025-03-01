import DatasetForm from "@/components/DatasetForm";
import ModelForm from "@/components/ModelForm";
import { useState } from "react";

export default function Home() {
  const options: { value: string; title: string }[] = [
    { value: "model", title: "Train Model" },
    { value: "dataset", title: "Upload dataset" },
  ];
  const [selectedForm, setSelectedForm] = useState(options[0].value);
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <header className="row-start-1 flex flex-col items-center gap-8 sm:items-start">
        <span className="text-3xl font-bold">
          Obstacle Detection for Drone Flight Path
        </span>
      </header>
      <main className="row-start-2 flex w-full flex-col items-center gap-8 sm:items-start 2xl:w-2/3">
        <span className="flex w-full flex-row items-start gap-8">
          <label className="w-1/5 font-semibold">Select Task</label>
          <select
            className="w-4/5 grow appearance-none rounded border border-black bg-white px-1"
            onChange={(e) => setSelectedForm(e.target.value)}
          >
            <option value="" disabled>
              Please select an option
            </option>
            {options.map((option) => (
              <option value={option.value} key={option.value}>
                {option.title}
              </option>
            ))}
          </select>
        </span>
        {selectedForm == "model" ? <ModelForm /> : null}
        {selectedForm == "dataset" ? <DatasetForm /> : null}
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
