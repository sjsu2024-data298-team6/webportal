import InferenceForm from "@/components/InferenceForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router";

export default function InferencePage() {
  const router = useRouter();

  const { model_id } = router.query;
  let modelIdNumber: number | undefined;

  if (typeof model_id === "string") {
    modelIdNumber = parseInt(model_id, 10);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Run Inference</CardTitle>
        </CardHeader>
        <CardContent>
          {modelIdNumber ? (
            <InferenceForm modelID={modelIdNumber} />
          ) : (
            <Button variant={"secondary"} disabled>
              Loading...
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
