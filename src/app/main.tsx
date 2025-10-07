import { store } from "@/store/store"
import "@/styles/global.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import AuthProvider from "./providers/AuthProvider"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { BrowserRouter } from "react-router"

createRoot(document.getElementById("root")!).render(
  <StrictMode >
    <Provider store={store}>
      <AuthProvider>
        <App />
        <ToastContainer />
      </AuthProvider>
    </Provider>
  </StrictMode>
)
