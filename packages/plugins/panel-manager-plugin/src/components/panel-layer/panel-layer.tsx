/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { FloatPanel } from './float-panel';
import { panelLayer, leftArea, rightArea, mainArea, bottomArea } from './css';

export const PanelLayer: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="panel-layer" style={panelLayer}>
    <div className="left-area" style={leftArea}>
      <div className="main-area" style={mainArea}>
        {children}
      </div>
      <div className="bottom-area" style={bottomArea}>
        <FloatPanel area="bottom" />
      </div>
    </div>
    <div className="right-area" style={rightArea}>
      <FloatPanel area="right" />
    </div>
  </div>
);
