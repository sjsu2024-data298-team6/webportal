import React, { useState } from "react";

export interface CitationData {
  key: string;
  text: string;
  link: string;
}

const citationsData: CitationData[] = [
  {
    key: "an_et_al",
    text: "An, J., Hee Lee, D., Dwisnanto Putro, M., & Kim, B. W. (2024). Dce-yolov8: Lightweight and accurate object detection for drone vision",
    link: "http://dx.doi.org/10.1109/ACCESS.2024.3481410",
  },
  {
    key: "ye_et_al",
    text: "Ye, T., Qin, W., Zhao, Z., Gao, X., Deng, X., & Ouyang, Y. (2023). Real-Time Object Detection Network in UAV-Vision Based on CNN and Transformer",
    link: "https://doi.org/10.1109/TIM.2023.3241825",
  },
  {
    key: "zhang_et_al",
    text: "Zhang, Z., Lu, X., Cao, G., Yang, Y., Jiao, L., & Liu, F. (2021). ViT-YOLO:Transformer-Based YOLO for Object Detection",
    link: "https://openaccess.thecvf.com/content/ICCV2021W/VisDrone/papers/Zhang_ViT-YOLOTransformer-Based_YOLO_for_Object_Detection_ICCVW_2021_paper.pdf",
  },
  {
    key: "liu_et_al",
    text: "Liu, W., Qiang, J., Li, X., Guan, P., & Du, Y. (2022). Uav image small object detection based on composite backbone network",
    link: "https://doi.org/10.1155/2022/7319529",
  },
  {
    key: "li_et_al",
    text: "Li, N., Ye, T., Zhou, Z., Gao, C., & Zhang, P. (2024). Enhanced yolov8 with bifpn-simam for precise defect detection in miniature capacitors.",
    link: "https://doi.org/10.3390/app14010429",
  },
  {
    key: "pedoeem_huang",
    text: "Pedoeem, J., & Huang, R. (2018, November). YOLO-LITE: A Real-Time Object Detection Algorithm Optimized for Non-GPU Computers",
    link: "https://doi.org/10.1109/BigData.2018.8621865",
  },
  {
    key: "redmon_yolo",
    text: "Redmon, J., Divvala, S., Girshick, R., & Farhadi, A. (2016). You Only Look Once: Unified, Real-Time Object Detection",
    link: "https://arxiv.org/abs/1506.02640",
  },
  {
    key: "zhu_et_al",
    text: "Zhu, P., Wen, L., Bian, X., Ling, H., & Hu, Q. (2018, April). Vision Meets Drones: A Challenge",
    link: "https://arxiv.org/abs/1804.07437",
  },
];

type CitationKeys =
  | "an_et_al"
  | "liu_et_al"
  | "li_et_al"
  | "pedoeem_huang"
  | "redmon_yolo"
  | "ye_et_al"
  | "zhang_et_al"
  | "zhu_et_al";

interface CitationProps {
  citationKey: CitationKeys;
}

const Citation: React.FC<CitationProps> = ({ citationKey }) => {
  const citationIndex = citationsData.findIndex((c) => c.key === citationKey);
  const citationNumber = citationIndex !== -1 ? citationIndex + 1 : "?";

  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    const citationData = citationsData.find((c) => c.key === citationKey);
    if (citationData && citationData.link) {
      window.open(citationData.link, "_blank");
    }
  };

  // Mobile-friendly touch handlers
  const handleTouchStart = () => {
    setShowTooltip(true);
  };

  const handleTouchEnd = () => {
    setTimeout(() => setShowTooltip(false), 2000); // Hide after 2 seconds
  };

  const renderHoverContent = () => {
    const shouldShow = isHovered || showTooltip;
    if (!shouldShow) return null;

    const citationData = citationsData.find((c) => c.key === citationKey);
    if (!citationData) return null;

    return (
      <div className="absolute bottom-full left-1/2 z-50 mb-2 w-64 max-w-xs -translate-x-1/2 transform rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg sm:w-80 sm:max-w-sm">
        {/* Tooltip arrow */}
        <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-4 border-transparent border-t-gray-900"></div>

        {/* Citation text with proper wrapping */}
        <div className="break-words leading-relaxed">{citationData.text}</div>

        {/* Mobile hint */}
        <div className="mt-2 text-xs text-gray-300 sm:hidden">
          Tap to open link
        </div>
      </div>
    );
  };

  return (
    <span
      className="relative mx-0.5 inline-block cursor-pointer align-super text-xs text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Citation ${citationNumber}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      [{citationNumber}]{renderHoverContent()}
    </span>
  );
};

const CitationList: React.FC = () => {
  return (
    <div>
      <div className="mb-4 text-xl font-semibold text-gray-800">
        Key References
      </div>
      <ol className="space-y-3 text-sm">
        {citationsData.map((citation, index) => (
          <li key={citation.key} className="flex flex-col gap-1">
            <span className="leading-relaxed">
              <span className="font-medium text-blue-600">[{index + 1}]</span>{" "}
              {citation.text}
            </span>
            {citation.link && (
              <a
                href={citation.link}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-blue-500 underline transition-colors duration-200 hover:text-blue-700"
              >
                {citation.link}
              </a>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export { Citation, CitationList };
