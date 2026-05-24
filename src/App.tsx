import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes"
// import { Toaster } from "react-hot-toast";

function App() {

  /**
   * App Component
   *
   * Root component of the entire React application.
   * All routing and global providers will be mounted here.
   */

  return <>
    <ToastContainer position="top-right" autoClose={3000} />
    <AppRoutes />
  </>
}

export default App