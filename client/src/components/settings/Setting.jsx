import React from "react";

import GetSession from "./session";
import Batch from "./Batch";

export const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Message Delay Settings */}
      <Batch />

      {/* Active Sessions */}

      <GetSession />
    </div>
  );
};
