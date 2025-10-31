import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { Suspense } from "react";
import { Loader } from "@shared/ui/Loader/Loader";

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
