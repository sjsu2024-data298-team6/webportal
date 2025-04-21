import ModelForm from "@/components/ModelForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ModelPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Train a New Model</CardTitle>
        </CardHeader>
        <CardContent>
          <ModelForm />
        </CardContent>
      </Card>
    </div>
  );
} 