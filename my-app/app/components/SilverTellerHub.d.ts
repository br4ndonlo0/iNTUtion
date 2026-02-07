import * as React from "react";

export interface SilverTellerHubProps {
  screenName?: string;
  onAiAction?: any;
  handleRegister?: any;
  handleLogin?: any;
  handleAgree?: any;
}

declare const SilverTellerHub: React.ComponentType<SilverTellerHubProps>;
export default SilverTellerHub;
