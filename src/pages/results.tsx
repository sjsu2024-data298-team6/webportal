import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import ModelResultGraphs from "@/components/ModelResultGraphs";
import ModelResultDialog from "@/components/ModelResultDialog";
import DropdownFormEntry from "@/components/DropdownFormEntry";

interface datasetWithResults {
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
  const [datasets, setDatasets] = useState<datasetWithResults[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<
    datasetWithResults | undefined
  >(undefined);
  const [results, setResults] = useState<modelResultType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingResults, setLoadingResults] = useState<boolean>(true);
  const [showGraphs, setShowGraphs] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(true);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const [sortColumn, setSortColumn] = useState<{ col: string; asc: boolean }>({
    col: "id",
    asc: true,
  });

  useEffect(() => {
    const loadDatasets = async () => {
      const response = await fetch("/api/datasets-with-results");
      const data = (await response.json()) as datasetWithResults[];
      console.log(data);
      setDatasets(data);
      setLoading(false);
    };

    loadDatasets();
  }, []);

  useEffect(() => {
    const loadModelResults = async () => {
      if (selectedDataset) {
        const response = await fetch(`/api/results/${selectedDataset.value}`);
        const data = (await response.json()) as modelResultType[];
        console.log(data);
        setResults(data);
        setLoadingResults(false);
      }
    };
    if (selectedDataset) {
      setShowGraphs(false);
      setLoadingResults(true);
      loadModelResults();
    }
  }, [selectedDataset]);

  const sortResultsBy = (key: string) => {
    setSortColumn((prev) => ({
      col: key,
      asc: key === prev.col ? !prev.asc : true,
    }));
    setShowGraphs(false);
  };

  const sortedResults = useMemo(() => {
    return [...results].sort((a: modelResultType, b: modelResultType) => {
      const aValue = a[sortColumn.col as keyof modelResultType] as number;
      const bValue = b[sortColumn.col as keyof modelResultType] as number;
      return sortColumn.asc ? aValue - bValue : bValue - aValue;
    });
  }, [results, sortColumn]);

  const renderTableHeadSortable = (key: string, title: string) => {
    let icon;
    if (key === sortColumn.col) {
      icon = sortColumn.asc ? faSortUp : faSortDown;
    } else {
      icon = faSort;
    }
    return (
      <TableHead
        className="hover:cursor-pointer"
        onClick={() => sortResultsBy(key)}
      >
        {title} <FontAwesomeIcon icon={icon} size="sm" />
      </TableHead>
    );
  };

  function handleIsActiveCheckbox(id: number) {
    let countChecked = 0;
    const updatedResults = results.map((r) => {
      if (r.id === id) {
        return { ...r, isActive: !r.isActive };
      }
      return r;
    });
    updatedResults.forEach((r) => {
      if (r.isActive) {
        countChecked += 1;
      }
    });
    if (countChecked === 0) {
      setSelectAll(false);
      if (selectAllRef && selectAllRef.current) {
        selectAllRef.current.indeterminate = false;
      }
    } else if (countChecked === updatedResults.length) {
      setSelectAll(true);
      if (selectAllRef && selectAllRef.current) {
        selectAllRef.current.indeterminate = false;
      }
    } else {
      setSelectAll(false);
      if (selectAllRef && selectAllRef.current) {
        selectAllRef.current.indeterminate = true;
      }
    }
    setResults(updatedResults);
    setShowGraphs(false);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle> Select Dataset </CardTitle>
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
            <CardTitle>View results</CardTitle>
          </CardHeader>
          <CardContent>Loading results...</CardContent>
        </Card>
      )}
      {!loadingResults && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>View results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {renderTableHeadSortable("id", "ID")}
                  <TableHead>Name</TableHead>
                  <TableHead>Tags</TableHead>
                  {renderTableHeadSortable(
                    "inferenceTime",
                    "Inference Time (ms)",
                  )}
                  {renderTableHeadSortable("iouScore", "IoU Score")}
                  {renderTableHeadSortable("map50Score", "mAP 50")}
                  {renderTableHeadSortable("map5095Score", "mAP 50-95")}
                  <TableHead className="w-8">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      className="h-3 w-3"
                      checked={selectAll}
                      onChange={() => {
                        setSelectAll(!selectAll);
                        sortedResults.forEach((r) => (r.isActive = !selectAll));
                      }}
                    />
                  </TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedResults.map((r) => (
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
                      <div className="flex flex-wrap justify-end gap-1">
                        {r.inferenceTime.toFixed(3)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-end gap-1">
                        {r.iouScore.toFixed(3)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-end gap-1">
                        {r.map50Score.toFixed(3)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-end gap-1">
                        {r.map5095Score.toFixed(3)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <input
                        type="checkbox"
                        name={`result-${r.id}`}
                        className="h-3 w-3"
                        checked={r.isActive}
                        onChange={() => handleIsActiveCheckbox(r.id)}
                      />
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
            {showGraphs ? (
              <Button
                variant={"destructive"}
                className="my-2"
                onClick={() => {
                  setShowGraphs(false);
                }}
              >
                Hide Graphs
              </Button>
            ) : (
              <Button
                variant={"default"}
                className="my-2"
                onClick={() => {
                  setShowGraphs(true);
                }}
                disabled={!sortedResults.some((r) => r.isActive)}
              >
                View Graphs
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      {showGraphs && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Result Graphs</CardTitle>
          </CardHeader>
          <CardContent>
            <ModelResultGraphs
              modelData={sortedResults.filter((r) => r.isActive)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
