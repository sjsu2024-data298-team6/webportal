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
import { useEffect, useState, useMemo } from "react";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

interface modelResultType {
  datasetId: number;
  extras: object;
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
}

export default function DatasetPage() {
  const [results, setResults] = useState<modelResultType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortColumn, setSortColumn] = useState<{ col: string; asc: boolean }>({
    col: "id",
    asc: true,
  });

  useEffect(() => {
    const loadModelResults = async () => {
      const response = await fetch("/api/model-results");
      const data = (await response.json()) as modelResultType[];
      console.log(data);
      setResults(data);
      setLoading(false);
    };

    loadModelResults();
  }, []);

  const sortResultsBy = (key: string) => {
    setSortColumn((prev) => ({
      col: key,
      asc: key === prev.col ? !prev.asc : true,
    }));
  };

  const sortedResults = useMemo(() => {
    return [...results].sort((a: modelResultType, b: modelResultType) => {
      const aValue = a[sortColumn.col as keyof modelResultType] as number;
      const bValue = b[sortColumn.col as keyof modelResultType] as number;
      return sortColumn.asc ? aValue - bValue : bValue - aValue;
    });
  }, [results, sortColumn]);

  const sortIcon = (key: string) => {
    let icon;
    if (key === sortColumn.col) {
      icon = sortColumn.asc ? faSortUp : faSortDown;
    } else {
      icon = faSort;
    }
    return (
      <FontAwesomeIcon
        className="hover:cursor-pointer"
        icon={icon}
        size="sm"
        onClick={() => sortResultsBy(key)}
      />
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>View results</CardTitle>
          </CardHeader>
          <CardContent> Loading results... </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>View results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID {sortIcon("id")}</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>
                  Inference Time {sortIcon("inferenceTime")}
                </TableHead>
                <TableHead>IoU Score {sortIcon("iouScore")}</TableHead>
                <TableHead>mAP 50 {sortIcon("map50Score")}</TableHead>
                <TableHead>mAP 50-95 {sortIcon("map5095Score")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedResults.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
