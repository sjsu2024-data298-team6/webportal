import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import ModelResultDialog from "@/components/ModelResultDialog";
import DropdownFormEntry from "@/components/DropdownFormEntry";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface datasetWithTFJS {
  value: string;
  name: string;
}

interface ClassMetrics {
  name: string;
  precision: number;
  recall: number;
  map50: number;
  map5095: number;
  iou: number;
}

interface AllMetrics {
  precision: number;
  recall: number;
  map50: number;
  map5095: number;
  iou: number;
  inference_time: number;
  class_metrics: ClassMetrics[];
}

interface extraInfo {
  YAML_URL: string;
  wandb_logs: string;
  detailed_metrics: AllMetrics | undefined;
}

interface modelResultType {
  datasetId: number;
  extras: extraInfo;
  id: number;
  inferenceTime: number;
  iouScore: number;
  isActive: boolean;
  map5095Score: number;
  map50Score: number;
  params: object;
  resultsS3Key: string;
  modelS3Key: string;
  modelTypeId: number;
  tags: string[];
  tfjsS3Key: string;
  modelName: string;
}

export default function DatasetPage() {
  const [datasets, setDatasets] = useState<datasetWithTFJS[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<
    datasetWithTFJS | undefined
  >(undefined);
  const [results, setResults] = useState<modelResultType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingResults, setLoadingResults] = useState<boolean>(true);

  useEffect(() => {
    const loadDatasets = async () => {
      const response = await fetch("/api/datasets-with-tfjs");
      const data = (await response.json()) as datasetWithTFJS[];
      console.log(data);
      setDatasets(data);
      setLoading(false);
    };

    loadDatasets();
  }, []);

  useEffect(() => {
    const loadModelResults = async () => {
      if (selectedDataset) {
        const response = await fetch(
          `/api/results-with-tfjs/${selectedDataset.value}`,
        );
        const data = (await response.json()) as modelResultType[];
        console.log(data);
        setResults(data);
        setLoadingResults(false);
      }
    };
    if (selectedDataset) {
      setLoadingResults(true);
      loadModelResults();
    }
  }, [selectedDataset]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Select Dataset</CardTitle>
        </CardHeader>
        <CardContent>
          {!loading ? (
            <DropdownFormEntry
              heading="Select dataset"
              formkey="dataset"
              options={datasets}
              value={selectedDataset ? selectedDataset.value : ""}
              onChange={(value) => {
                const sds = datasets
                  .filter((ds) => {
                    return ds.value === value;
                  })
                  .at(0);
                setSelectedDataset(sds);
              }}
            />
          ) : (
            "loading datasets..."
          )}
        </CardContent>
      </Card>
      {loadingResults && selectedDataset && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Select Model</CardTitle>
          </CardHeader>
          <CardContent>Loading results...</CardContent>
        </Card>
      )}
      {!loadingResults && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Select Model</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="w-8"></TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.modelName}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {r.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant={"default"}>
                        <Link
                          href={`/inference/${results.filter((rr) => rr.id === r.id).at(0)?.id}`}
                        >
                          Run inference
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <ModelResultDialog
                        data={
                          results
                            .filter((rr) => rr.id === r.id)
                            .at(0) as modelResultType
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
