import type { Project } from "@/types/db";
import Image from "next/image";
import type { FC, ReactNode } from "react";

type props = {
  alt: string;
  width: number;
  height: number;
  className: string;
  media: Project["media"];
  image?: (src: string, alt: string) => ReactNode;
};

const ProjectMedia: FC<props> = ({
  media,
  className,
  height,
  width,
  alt,
  image,
}) => {
  if (!media) return null;
  switch (media.type) {
    case "image":
      return image ? (
        image(media.url, alt)
      ) : (
        <Image
          src={media.url}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />
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
    case "external":
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
