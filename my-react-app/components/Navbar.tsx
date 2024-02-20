import { ModeToggle } from "./ModeToggle"
import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between m-4">
            <div className="text-white mr-6">
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
                    Immersio Ingestion
                    </h1>
                </div>
                <div className="flex lg:items-center lg:gap-4 md:items-center md:gap-2">
            <Link href="/question">
                Question
            </Link>
            <Link href="/videos">
                Video
            </Link>
            <ModeToggle />
            </div>
        </nav>
    )
}