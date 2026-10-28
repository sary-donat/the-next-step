
import { Outlet } from "react-router"
import Header from "./components/header"

function App() {


  return (
    <div className="flex min-h-svh flex-col">
    < Header></Header>
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
    <Outlet />
    </main>
    </div>
  )
}

export default App
