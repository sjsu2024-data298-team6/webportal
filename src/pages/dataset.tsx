import DatasetForm from "@/components/DatasetForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DatasetPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Dataset</CardTitle>
        </CardHeader>
        <CardContent>
          <DatasetForm />
        </CardContent>
      </Card>
    </div>
  );
}
