import {
  createBrowserClient,
  performancePlugin,
  monitorResourceErrorPlugin,
  promiseErrorPlugin,
  pageCrashPlugin,
} from "@timotte-sdk/browser";
import { userBehaviorPlugin } from "@timotte-sdk/user-behavior";

import { sum } from "./helper";
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
      heartbeatInterval: 15000,
      crashDetectWorkerUrl: "http://localhost:5173/index.umd.js",
    }),
    userBehaviorPlugin({
      targetBehaviors: [{ name: "test", position: "localStorage" }],
    }),
  ]
);

function App() {
  const onClick = () => {
    // use infinite loop to block the main thread
    // while (true) {}
    console.log(sum(3, 5));
  };

  useEffect(() => {
    console.log("sum ", sum(2, 5));
  }, []);

  return (
    <div>
      <button onClick={onClick}>12345</button>
      <h2>test</h2>
    </div>
  );
}

export default App;
