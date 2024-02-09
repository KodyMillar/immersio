import { ModeToggle } from "./ModeToggle"

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between p-4 mx-auto my-0">
            <div className="text-xl font-bold">Immersio Ingestion</div>
            <ModeToggle />
        </nav>
    )
}