import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/feedback/toaster"

function App() {
  return (
    <>
      <Pages />
      <Toaster />
    </>
  )
}

export default App 