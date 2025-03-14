import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import FormulaInput from './components/FormulaInput/FormulaInput'
import './App.css'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <h1>Formula Input Demo</h1>
                <div className="formula-container">
                    <FormulaInput />
                </div>
            </div>
        </QueryClientProvider>
    )
}

export default App
