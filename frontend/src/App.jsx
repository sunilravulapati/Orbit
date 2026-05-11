import './App.css';
import Body from './components/Body';
import { Toaster } from "react-hot-toast";
import axios from 'axios';
axios.defaults.withCredentials = true;

function App() {
    return (
        <div className="App">
            <Body />
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#0a1628',
                        color: '#e2e8f0',
                        border: '0.5px solid #1e3a5f',
                        borderRadius: '12px',
                        fontSize: '13px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#5de8c1',
                            secondary: '#0a1628',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#f87171',
                            secondary: '#0a1628',
                        },
                    },
                    duration: 3000,
                }}
            />
        </div>
    );
}

export default App;