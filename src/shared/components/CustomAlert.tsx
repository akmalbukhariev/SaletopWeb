import { Alert } from "@mui/material";
import { createRoot } from "react-dom/client";

interface CustomAlertOptions {
  message: string;
  type: "success" | "warning" | "error" | "info";
  duration?: number; // Auto-close duration in milliseconds
}

function CustomAlert(options: CustomAlertOptions) {
  // Create a container div
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "20px";
  container.style.right = "20px";
  container.style.zIndex = "9999";
  
  // Add to body
  document.body.appendChild(container);
  
  // Create React root and render alert
  const root = createRoot(container);
  
  const AlertComponent = () => (

    <Alert
      variant="filled" 
      severity={options.type}
      onClose={() => {
        root.unmount();
        document.body.removeChild(container);
      }}
    >
      {options.message}
    </Alert>
  );
  
  root.render(<AlertComponent />);
  
  // Auto-close after duration (default 3 seconds)
  const duration = options.duration || 5000;
  setTimeout(() => {
    if (document.body.contains(container)) {
      root.unmount();
      document.body.removeChild(container);
    }
  }, duration);
}

export default CustomAlert;
