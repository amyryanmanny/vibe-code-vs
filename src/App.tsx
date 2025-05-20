import React, { useEffect, useRef } from 'react';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

const App: React.FC = () => {
  const wsRef = useRef<WebSocket | null>(null);

  const [value, setValue] = React.useState("print('Hello World!')");

  const onChange = React.useCallback((val: string, viewUpdate?: ViewUpdate) => {
    setValue(val);
    wsRef.current?.send(val);
  }, []);

  useEffect(() => {
    // Initialize WebSocket
    const ws = new WebSocket('ws://localhost:8080');
    wsRef.current = ws;

    // Update editor when receiving updates
    ws.onmessage = (event) => {
      const text = event.data;
      onChange(text);
    };

    return () => {
      ws.close();
    };
  }, []);

  return <CodeMirror
    value={value}
    height="100vh"
    width="100vw"
    extensions={[python()]}
    onChange={onChange}
  />;
};

export default App;
