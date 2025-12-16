import { notification } from "antd";
import classNames from "classnames";
import React, { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Icon } from "@/components";
import { removeNotificationData } from "@/redux/slices/Notifications/slice";
import { RootState } from "@/redux/store";
import { Icons } from "@/shared/constants";

type Props = {
  children?: ReactNode;
};

const AntNotificationLayout: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const { antNotificationsList } = useSelector(
    (state: RootState) => state.notifications,
  );

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    antNotificationsList.forEach((item) => {
      api.open({
        message: item.title ? (
          <div>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>
              {item.title}
            </div>
            <span className="text--toast">{item.message}</span>
          </div>
        ) : (
          <span className="text--toast">{item.message}</span>
        ),
        closeIcon: <Icon name={Icons.CLOSE} />,
        className: classNames("toast", {
          toastSuccess: item.type === "success",
          toastWarning: item.type === "warning",
          toastInformation: item.type === "information",
        }),
        placement: "bottomRight",
      });
      dispatch(removeNotificationData(item.id));
    });
  }, [antNotificationsList.length]);

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export default AntNotificationLayout;
