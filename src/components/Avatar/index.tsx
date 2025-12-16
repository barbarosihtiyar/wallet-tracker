import "./avatar.scss";

import classNames from "classnames";
import React from "react";

import { Icon } from "@/components";

interface AvatarProps {
  size?: "sm" | "md" | "lg";
  firstName?: string;
  lastName?: string;
  image?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  size = "md",
  firstName,
  lastName,
  image,
  onClick,
  ...props
}) => {
  const placeholder =
    (firstName?.[0]?.toUpperCase() || "") +
    (lastName?.[0]?.toUpperCase() || "");

  return (
    <div
      className={classNames("avatar", {
        "avatar--sm": size === "sm",
        "avatar--md": size === "md",
        "avatar--lg": size === "lg",
        "is-clickable": !!onClick,
      })}
      onClick={onClick}
      {...props}
    >
      {image ? (
        <figure className="avatar__image">
          <img src={image} alt="avatar" />
        </figure>
      ) : (
        <span className="avatar__placeholder">
          {placeholder || <Icon name="single-person" />}
        </span>
      )}
    </div>
  );
};

export default Avatar;
