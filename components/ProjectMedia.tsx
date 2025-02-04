import Image from "next/image";
import type { FC, ReactNode } from "react";

type props = {
  alt: string;
  width: number;
  height: number;
  className: string;
  media: Project["media"];
  image?: ReactNode;
};

const ProjectMedia: FC<props> = ({
  media,
  className,
  height,
  width,
  alt,
  image,
}) => {
  switch (media.type) {
    case "image":
      return (
        image ?? (
          <Image
            src={media.url}
            alt={alt}
            width={width}
            height={height}
            className={className}
          />
        )
      );
    case "video":
      return (
        <video
          width={width}
          height={height}
          src={media.url}
          className={className}
        />
      );
    case "link":
      return (
        <iframe
          width={width}
          height={height}
          src={media.url}
          className={className}
        />
      );
  }
};

export default ProjectMedia;
