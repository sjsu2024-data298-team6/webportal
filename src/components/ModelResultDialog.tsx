import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  faArrowUpRightFromSquare,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "@/components/ui/badge";

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
  modelType: { name: string };
}

interface modelResultDialogProps {
  data: modelResultType;
}

const ModelResultDialog: React.FC<modelResultDialogProps> = ({ data }) => {
  const renderS3LinkIcon = (link: string) => {
    if (link === "" || !link) {
      return (
        <FontAwesomeIcon
          icon={faDownload}
          size="xs"
          className="text-gray-400"
        />
      );
    } else {
      return (
        <a href={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${link}`}>
          <FontAwesomeIcon icon={faDownload} size="xs" />
        </a>
      );
    }
  };

  const renderExtraInfoValue = (value: string | object) => {
    if (/(https?:\/\/[^\s]+)/.test(value as string)) {
      return (
        <a href={`${value}`} target="_blank">
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" />
        </a>
      );
    }

    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }

    return value;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="sm" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-md">
        <DialogHeader>
          <DialogTitle>{data.modelType.name}</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-wrap gap-1">
              {data.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="my-2">
          <span className="w-full font-bold">Metrics</span>
          <div className="flex w-full flex-row">
            <div className="w-1/2 justify-start">Inference Time (ms)</div>
            <div className="w-1/2 justify-end text-right">
              {data.inferenceTime.toFixed(3)}
            </div>
          </div>
          <div className="flex w-full flex-row">
            <div className="w-1/2 justify-start">IoU Score</div>
            <div className="w-1/2 justify-end text-right">
              {data.iouScore.toFixed(3)}
            </div>
          </div>
          <div className="flex w-full flex-row">
            <div className="w-1/2 justify-start">mAP 50 Score</div>
            <div className="w-1/2 justify-end text-right">
              {data.map50Score.toFixed(3)}
            </div>
          </div>
          <div className="flex w-full flex-row">
            <div className="w-1/2 justify-start">mAP 50-95 Score</div>
            <div className="w-1/2 justify-end text-right">
              {data.map5095Score.toFixed(3)}
            </div>
          </div>
        </div>
        <div className="my-2">
          <span className="w-full font-bold">Model Links</span>
          <div className="flex w-full flex-row">
            <div className="w-1/2 justify-start">Training run (zip folder)</div>
            <div className="w-1/2 justify-end text-right">
              {renderS3LinkIcon(data.resultsS3Key)}
            </div>
          </div>
          <div className="flex w-full flex-row">
            <div className="w-1/2 justify-start">
              Trained model weights (.pt)
            </div>
            <div className="w-1/2 justify-end text-right">
              {renderS3LinkIcon(data.modelS3Key)}
            </div>
          </div>
          <div className="flex w-full flex-row">
            <div className="w-1/2 justify-start">
              Trained model weights (tfjs format)
            </div>
            <div className="w-1/2 justify-end text-right">
              {renderS3LinkIcon(data.tfjsS3Key)}
            </div>
          </div>
        </div>
        <div className="my-2">
          <span className="w-full font-bold">Model training params</span>
          <div className="flex w-full flex-row">
            {`${JSON.stringify(data.params)}`}
          </div>
        </div>
        <div className="my-2">
          <span className="w-full font-bold">Extra information</span>
          {Object.entries(data.extras).map(([key, value]) => (
            <div className="flex w-full flex-row" key={key}>
              <div className="w-1/2 justify-start">{key}</div>
              <div className="w-1/2 justify-end text-right">
                {renderExtraInfoValue(value)}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant={"destructive"}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModelResultDialog;
