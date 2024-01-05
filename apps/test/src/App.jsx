import {
  createBrowserClient,
  performancePlugin,
  monitorResourceErrorPlugin,
  promiseErrorPlugin,
  pageCrashPlugin,
} from "@timotte-sdk/browser";
import { useEffect } from "react";

const client = createBrowserClient(
  {
    app: {
      name: "test",
      leader: "test",
    },
    dsn: {
      host: "http://localhost:4000",
      init: "/init",
      upload: "/upload",
      fallbackUrl: "http://localhost:4000/fallback",
    },
    reportType: "post",
    reportDeployment: "tick",
  },
  [
    performancePlugin(),
    monitorResourceErrorPlugin(),
    promiseErrorPlugin(),
    pageCrashPlugin({
      heartbeatInterval: 800,
      crashDetectWorkerUrl: "http://localhost:5173/index.umd.js",
    }),
  ]
);

function App() {
  const onClick = () => {
    // use infinite loop to block the main thread
    // while (true) {}
  };

  return (
    <div>
      <button onClick={onClick}>12345</button>
      <h2>test</h2>
    </div>
  );
}

export default App;
