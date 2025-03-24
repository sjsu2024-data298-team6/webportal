import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareFromSquare } from "@fortawesome/free-regular-svg-icons";

interface Dataset {
  id: number;
  s3Key: string;
  links: string[];
  tags: string[];
}

interface DatasetTableProps {
  model: string;
  onSelect: (dataset: Dataset) => void;
  selectedId?: number;
}

export default function DatasetTable({ model, onSelect, selectedId }: DatasetTableProps) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatasets = async () => {
      if (!model) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/datasets/${model}`);
        if (!response.ok) {
          throw new Error('Failed to fetch datasets');
        }
        const data = await response.json();
        setDatasets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, [model]);

  if (!model) return null;

  if (loading) {
    return (
      <span className="flex w-full flex-row items-start gap-8">
        <label className="w-1/5 font-semibold">Datasets</label>
        <div className="w-4/5 text-center">Loading datasets...</div>
      </span>
    );
  }

  if (error) {
    return (
      <span className="flex w-full flex-row items-start gap-8">
        <label className="w-1/5 font-semibold">Datasets</label>
        <div className="w-4/5 text-center text-red-500">{error}</div>
      </span>
    );
  }

  if (datasets.length === 0) {
    return (
      <span className="flex w-full flex-row items-start gap-8">
        <label className="w-1/5 font-semibold">Datasets</label>
        <div className="w-4/5 text-center">No datasets available for this model type</div>
      </span>
    );
  }

  return (
    <span className="flex w-full flex-row items-start gap-8">
      <label className="w-1/5 font-semibold">Datasets</label>
      <div className="w-4/5 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-1 text-left text-sm w-8"></th>
              <th className="border border-gray-300 px-2 py-1 text-left text-sm">ID</th>
              <th className="border border-gray-300 px-2 py-1 text-left text-sm">Tags</th>
              <th className="border border-gray-300 px-2 py-1 text-left text-sm">Original Source datasets</th>
            </tr>
          </thead>
          <tbody>
            {datasets.map((dataset) => (
              <tr key={dataset.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="radio"
                    name="dataset"
                    value={dataset.id}
                    checked={selectedId === dataset.id}
                    onChange={() => onSelect(dataset)}
                    className="h-3 w-3"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1 text-sm">{dataset.id}</td>
                <td className="border border-gray-300 px-2 py-1">
                  <div className="flex flex-wrap gap-1">
                    {dataset.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded bg-gray-100 px-1.5 py-0.5 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <div className="flex flex-wrap gap-2">
                    {dataset.links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-sm text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                      >
                        <FontAwesomeIcon icon={faShareFromSquare} className="h-4 w-4" />
                        Source {index + 1}
                      </a>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </span>
  );
} 