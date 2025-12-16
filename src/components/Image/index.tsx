import React, { useState } from "react";

import { ConditionalRender, Icon, Loader } from "@/components";
import { Icons } from "@/shared/constants";

import { ImageProps } from "./types";

const Image: React.FC<ImageProps> = ({
  name,
  alt,
  outLink = false,
  type = "png",
  app,
  srcSet = undefined,
  clickable = false,
  onImageClick,
  isLoading: externalLoading = false,
  width,
  height,
  ...props
}) => {
  const base = `/images/${name}`;
  const query = app ? `?app=${app}` : "";
  const link =
    typeof outLink === "string" ? outLink : `${base}.${type}${query}`;

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const defaultSrcSet = [
    `${base}.${type}${query} 1x`,
    `${base}@2x.${type}${query} 2x`,
  ].join(", ");
  const resolvedSrcSet =
    typeof srcSet === "string" ? srcSet : srcSet ? defaultSrcSet : undefined;

  const handleClick = () => {
    if (clickable && onImageClick) onImageClick();
  };
  const handleLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };
  const handleError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const isLoading = externalLoading || imageLoading;

  if (!link || link === "/images/undefined.png") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: width || "100%",
          height: height || "120px",
          background: "#f5f5f5",
          color: "#999",
        }}
      >
        <span style={{ fontSize: 12 }}>Görsel bulunamadı</span>
      </div>
    );
  }

  const boxW = width || height || "100%";
  const boxH = height || width || "100%";
  const boxR = `${props.radius}px`;

  return (
    <div
      style={{
        position: "relative",
        width: isLoading ? boxW : width,
        height: isLoading ? boxH : height,
        borderRadius: boxR,
        overflow: "hidden",
      }}
    >
      <ConditionalRender value={isLoading && !imageError}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f5f5",
            zIndex: 1,
          }}
        >
          <Loader theme="light" />
        </div>
      </ConditionalRender>

      <ConditionalRender value={imageError}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f5f5",
            color: "#999",
            zIndex: 1,
          }}
        >
          <Icon name={Icons.WARNING} />
          <span style={{ fontSize: 12 }}>Görsel yüklenemedi</span>
        </div>
      </ConditionalRender>

      <img
        src={link}
        alt={alt}
        srcSet={resolvedSrcSet}
        onClick={handleClick}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          cursor: clickable ? "pointer" : "default",
          opacity: isLoading || imageError ? 0 : 1,
          transition: "opacity 200ms ease",
          display: "block",
          ...props.style,
        }}
        {...props}
      />
    </div>
  );
};

export default Image;
