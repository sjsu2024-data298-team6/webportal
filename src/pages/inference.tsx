import InferenceForm from "@/components/InferenceForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InferencePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Run Inference</CardTitle>
        </CardHeader>
        <CardContent>
          <InferenceForm />
        </CardContent>
      </Card>
    </div>
  );
} 