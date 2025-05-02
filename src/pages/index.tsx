import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold">
          Obstacle Detection for Drone Flight Path
        </h1>
        <p className="text-muted-foreground">
          Train models, upload datasets, and run inference for drone obstacle
          detection
        </p>
      </div>

      {/* Feature Cards Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/model">
          <Card className="transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle>Train Model</CardTitle>
              <CardDescription>
                Train a new model using your datasets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Configure and train custom models for obstacle detection</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dataset">
          <Card className="transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle>Upload Dataset</CardTitle>
              <CardDescription>Add new datasets for training</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Upload and manage your training datasets</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/inference">
          <Card className="transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle>Inference</CardTitle>
              <CardDescription>Run inference on your models</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Test your trained models with new data</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/results">
          <Card className="transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>View results and graphs</CardDescription>
            </CardHeader>
            <CardContent>
              <p>View comparative graphs and detailed model runs</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
