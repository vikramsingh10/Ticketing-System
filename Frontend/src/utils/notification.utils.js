import { notification } from "antd";

export const Notification = (type, message, description) => {
  try {
    const messageTypes = ["success", "info", "warning", "error"];
    if (messageTypes.includes(type)) {
      if (message) {
        const config = {
          message,
          duration: 0,
        };
        if (description) {
          config.description = description;
        }

        notification[type](config);
      } else {
        throw new Error("Message cannot be a falsy value.");
      }
    } else {
      throw new Error(
        "Wrong message type. Message type should be any of the below types - 'success', 'info', 'warning', 'error'"
      );
    }
  } catch (err) {
    console.log("Error - Error on creating notification", err);
  }
};
