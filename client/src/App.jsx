import AppRouter from "./appRouter";
import { WhatsAppProvider } from "./context/WatsappContext";

function App() {
  return (
    <>
      <WhatsAppProvider>
        <AppRouter />
      </WhatsAppProvider>
    </>
  );
}

export default App;
