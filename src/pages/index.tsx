import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Citation, CitationList } from "@/components/ui/citation";

export default function Home() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <div className="mb-8 grid w-full place-items-center text-center">
          <h1 className="mb-4 text-4xl font-bold">
            Obstacle Detection for Drone Flight Path
          </h1>
          <p className="mx-auto max-w-3xl text-muted-foreground">
            A project completed as the culminating experience for a degree in
            Master&apos;s in Data Analytics from San Jose State University.
            Developed by Shrey Agarwal, Ibrahim Khalid, Sung Won Lee, and Justin
            Wang. Completed in Fall 2024 to Spring 2025 under the advisorship of
            Dr. Simon Shim and Mr. Venkat Iyer.
          </p>
        </div>
        <div className="grid w-full place-items-center">
          <Card className="w-full lg:col-span-1">
            <CardContent className="p-0">
              <div className="aspect-video h-full w-full">
                <iframe
                  src="https://www.youtube.com/embed/p0fMXcaPcE0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full rounded-lg"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="my-6 grid min-h-24 gap-6 md:grid-cols-4">
        <Link href="/model">
          <Card className="h-full transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle>Train Model</CardTitle>
              <CardDescription>
                Train a new model using your datasets
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/dataset">
          <Card className="h-full transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle>Upload Dataset</CardTitle>
              <CardDescription>Add new datasets for training</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/inference">
          <Card className="h-full transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle>Inference</CardTitle>
              <CardDescription>Run inference on your models</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/results">
          <Card className="h-full transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>View results and graphs</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <Card className="my-6 lg:col-span-1">
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="my-3">
            As the world begins to rely more on autonomous control, the need for
            better object detection and labeling arises. In the case of
            autonomous vehicles, there is still a large degree of false
            classifications and slow inference times, that lead to unnecessary
            accidents. Our goal in this project is to create a prototype model
            that is both <b>fast</b> and <b>accurate</b> for obstacle detection
            in drones, a domain that is not researched as much. By doing so, we
            can improve autonomous drone vehicle operation for use in
            warehousing, delivery, and more.
          </p>
          <p className="my-3">
            One of the primary benefits of drones is their relatively small
            footprint required to operate combined with their ability to be
            quick and nimble. It is for this reason that they must have robust
            obstacle detection capabilities, so they do not crash into a wall.
          </p>
        </CardContent>
      </Card>

      <Card className="my-6 lg:col-span-1">
        <CardHeader>
          <CardTitle>System Application</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="my-3">
            The overall system application is designed to give full control over
            the dataset definitions and model training to the end user in a
            friendly interface. The admin user can use the web interface, which
            in turn sets off a series of events that result in their selected
            model being trained on their selected dataset. Once the model is
            fully trained, the admin user can theoretically download the weights
            of the model onto a drone system. At the same time, since the AWS S3
            bucket is public, the models can be accessed for fine tuned
            development via Jupyter notebooks.
          </p>
          <p className="my-3">
            This system was primarily developed using the YOLO
            <Citation citationKey="redmon_yolo" /> framework and the VisDrone
            <Citation citationKey="zhu_et_al" /> dataset.
          </p>
        </CardContent>
      </Card>

      <Card className="my-6 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-2xl">Model Development</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="my-3">
            The goal of our research project is to test and train various
            models, including developing custom models from scratch. Our model
            changes come from various papers in our literature review. The main
            models we will develop and test are:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>YOLO DCE</li>
            <li>YOLO MHSA BiFPN</li>
            <li>YOLO BiFPN ResNet</li>
            <li>YOLO-LITE</li>
          </ul>
          <p className="my-3">
            <div className="font-semibold">YOLO DCE</div>
            An et al{<Citation citationKey={"an_et_al"} />}found that removing
            the last two Conv and C2f streamlined the model and improved
            performance. Ye et al
            {<Citation citationKey={"ye_et_al"} />}
            proposed a unique convolution-based transformer and multihead self
            attention module to better detect occluded objects. Based on these
            methods, we can try to improve occluded object performance and
            inference time in YOLOv8.
          </p>
          <p className="my-3">
            <div className="font-semibold">YOLO MHSA BiFPN</div>
            The model incorporates a Multi-Head Self-Attention layer at the
            final backbone stage of YOLOv8 to efficiently capture global context
            while preserving spatial details, and employs a Bidirectional
            Feature Pyramid Network to learn adaptive weights from multi-scale
            features. The original founding were proposed by Zhang et al
            {<Citation citationKey={"zhang_et_al"} />}.
          </p>
          <p className="my-3">
            <div className="font-semibold">YOLO BiFPN ResNet</div>
            This model uses ResNet50 layers as its backbone since Liu et al
            {<Citation citationKey={"liu_et_al"} />}
            suggests it is ideal for feature extraction of obstacles that are
            far away in distance as well as at lower levels and utilizes
            residual connections for better gradient flow. Then, BiFPN as well
            as YOLO detection heads are both used for neck and head as Li et al
            {<Citation citationKey={"li_et_al"} />} does due to the enhanced
            feature fusion capability as well as bidirectional flow for better
            detection performance.
          </p>
          <p className="my-3">
            <div className="font-semibold">YOLO-LITE</div>
            Pedoeem and Huang{<Citation citationKey={"pedoeem_huang"} />}{" "}
            developed a model using YOLOv2 which reduced the number of layers
            and widths of those layers in the hopes of developing a model for
            edge devices. They tested over 15 different configurations.
          </p>
        </CardContent>
      </Card>

      <Card className="my-6 lg:col-span-1">
        <CardHeader>
          <CardTitle>Conclusion</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="my-3">
            In summary, this research presented a comprehensive approach for
            developing an advanced lightweight, real-time obstacle detection and
            labeling application primarily for drone flight paths, followed by
            the growing usage of UAV for various situations and the need for
            safety and autonomy in its application. It focused on enhancing
            small obstacle detection by using advanced object detection models,
            custom model development, and an end-to-end deployment pipeline.
          </p>
          <p className="my-3">
            For the achievements and findings, our team was able to successfully
            build and test various custom YOLOv8 based models. Many other custom
            models also showed similar or better results compared to object
            detection models such as YOLOv11, Detectron2, and RT-DETR.
          </p>
          <p className="my-3">
            The implications of the project demonstrated the feasibility of
            deploying fast and accurate obstacle detection models, which allow
            the end point applications where the model implemented could be
            applied to warehouse automation, delivery drones, and disaster
            response.
          </p>
        </CardContent>
      </Card>

      <CitationList />
    </div>
  );
}
