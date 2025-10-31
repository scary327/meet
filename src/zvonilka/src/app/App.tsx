import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { Suspense } from "react";
import { Loader } from "@shared/ui/Loader/Loader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
