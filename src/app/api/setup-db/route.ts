import { setupDatabase } from "@/lib/subscription";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await setupDatabase();
        return NextResponse.json({ message: "Database setup successful" });
    } catch (error) {
        return NextResponse.json({ error: "Database setup failed" }, { status: 500 });
    }
}
