import React from "react";

interface FormPartProps {
  handleSubmit: (event: React.FormEvent) => void;
  errors: any;
  resetForm: () => void;
  loadDevInputs: () => void;
}

const FormPart: React.FC<React.PropsWithChildren<FormPartProps>> = ({
  handleSubmit,
  errors,
  resetForm,
  loadDevInputs,
  children,
}) => {
  return (
    <form
      className="flex w-full flex-col items-start gap-4"
      onSubmit={handleSubmit}
    >
      {children}
      <div className="grid grid-cols-2 gap-4">
        {Object.values(errors).some((error) => error !== undefined) ? (
          <button
            type="submit"
            className="rounded-xl border border-black bg-gray-300 px-4 py-1 line-through"
            disabled
          >
            Submit
          </button>
        ) : (
          <button
            type="submit"
            className="rounded-xl border border-black bg-green-500 px-4 py-1 hover:bg-green-600"
          >
            Submit
          </button>
        )}
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
  );
};

export default FormPart;
