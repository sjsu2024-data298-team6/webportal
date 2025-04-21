import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareFromSquare } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";

interface Dataset {
  id: number;
  tags: string[];
  links: string[];
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
      <div className="grid w-full gap-1.5">
        <Label>Datasets</Label>
        <div className="text-center">Loading datasets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid w-full gap-1.5">
        <Label>Datasets</Label>
        <div className="text-center text-destructive">{error}</div>
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="grid w-full gap-1.5">
        <Label>Datasets</Label>
        <div className="text-center">No datasets available for this model type</div>
      </div>
    );
  }

  return (
    <div className="grid w-full gap-1.5">
      <Label>Datasets</Label>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Original Source datasets</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datasets.map((dataset) => (
              <TableRow key={dataset.id}>
                <TableCell>
                  <input
                    type="radio"
                    name="dataset"
                    value={dataset.id}
                    checked={selectedId === dataset.id}
                    onChange={() => onSelect(dataset)}
                    className="h-3 w-3"
                  />
                </TableCell>
                <TableCell>{dataset.id}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {dataset.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {dataset.links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <FontAwesomeIcon icon={faShareFromSquare} className="h-4 w-4" />
                        Source {index + 1}
                      </a>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 