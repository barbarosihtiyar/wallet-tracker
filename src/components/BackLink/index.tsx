import "./back-link.scss";

import classNames from "classnames";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { Config } from "@/app/router/config";
import { Button, ConditionalRender, CustomModalV1, Icon } from "@/components";
import { resetAllState } from "@/redux/common";
import { Icons } from "@/shared/constants";
import { useAppDispatch } from "@/shared/hooks";

import { Props } from "./types";

const BackLink = ({
  text,
  className,
  backLinkUrl,
  onClick,
  isShowCloseIcon = false,
  ...props
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();

  const handleConfirmExit = () => {
    setShowModal(false);
    dispatch(resetAllState());
    navigate(Config.HOMEPAGE);
  };

  return (
    <>
      <ConditionalRender value={backLinkUrl}>
        <Link
          to={backLinkUrl || ""}
          className={classNames("back-link", className)}
          onClick={onClick}
          {...props}
        >
          <Icon width={18} height={18} name={Icons.ARROW_LEFT} />
          <ConditionalRender value={text}>
            <span>{text}</span>
          </ConditionalRender>
          <ConditionalRender value={isShowCloseIcon}>
            <Icon
              name={Icons.CLOSE}
              size={11}
              onClick={() => setShowModal(true)}
            />
          </ConditionalRender>
        </Link>
      </ConditionalRender>
      <ConditionalRender value={!backLinkUrl}>
        <div
          className={classNames("back-link", className)}
          onClick={onClick}
          {...props}
        >
          <Icon width={18} height={18} name={Icons.ARROW_LEFT} />
          <ConditionalRender value={text}>
            <span>{text}</span>
          </ConditionalRender>
          <ConditionalRender value={isShowCloseIcon}>
            <Icon
              name={Icons.CLOSE}
              size={11}
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
            />
          </ConditionalRender>
        </div>
      </ConditionalRender>
      <CustomModalV1
        showModal={showModal}
        onClose={() => setShowModal(false)}
        maskClosable={false}
        className="cancel-transaction-information-modal"
        text={t("ui.modal.exitConfirm.title")}
        customFooter={
          <div className="action-group">
            <Button type="lightRedBorder" onClick={() => setShowModal(false)}>
              {t("ui.button.no")}
            </Button>
            <Button onClick={handleConfirmExit}>{t("ui.button.yes")}</Button>
          </div>
        }
      />
    </>
  );
};

export default BackLink;
