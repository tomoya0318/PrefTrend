import { QueryClientProvider } from "@tanstack/react-query";

import { Dashboard } from "./components/pages/Dashboard";
import { queryClient } from "./utils/queryClient";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
