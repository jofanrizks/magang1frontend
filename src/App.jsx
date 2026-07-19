import AppRoutes from "./routes/AppRoutes";
import SessionWatcher from "./components/auth/SessionWatcher";

function App() {
    return (
        <>
            <SessionWatcher />
            <AppRoutes />
        </>
    );
}

export default App;
