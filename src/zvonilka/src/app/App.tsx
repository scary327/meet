import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { Suspense, useEffect } from "react";
import { Loader } from "@shared/ui/Loader/Loader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useIsLoggedIn } from "@shared/utils/isLoggedIn";
import { authUrl } from "@shared/api/authUrl";
import { ToastProvider } from "@shared/contexts/ToastContext";

const queryClient = new QueryClient();

function App() {
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.assign(authUrl());
    }
  }, [isLoggedIn]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} />
        </Suspense>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
