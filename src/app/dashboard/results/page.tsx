import { Header } from "@/components/layout/Header";
import { ResultsView } from "@/components/ResultsView";

export default function ResultsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <ResultsView />
            </main>
        </div>
    );
}
