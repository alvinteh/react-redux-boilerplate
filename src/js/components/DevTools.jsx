import React from 'react';
import { createDevTools } from 'redux-devtools';
import DockMonitor from 'redux-devtools-dock-monitor';
import Inspector from 'redux-devtools-inspector';
import LogMonitor from 'redux-devtools-log-monitor';

const DevTools = createDevTools(
  <DockMonitor
    defaultIsVisible={false}
    toggleVisibilityKey="ctrl-h"
    changeMonitorKey="ctrl-m"
    changePositionKey="ctrl-q"
  >
    <LogMonitor />
    <Inspector />
  </DockMonitor>
);

export default DevTools;
