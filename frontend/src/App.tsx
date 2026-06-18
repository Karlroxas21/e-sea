import { AppProvider } from "@/providers/app";
import { AppRouter } from "@/routes";

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
