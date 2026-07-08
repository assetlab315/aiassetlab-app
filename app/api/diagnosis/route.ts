import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("diagnosis_results")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ data: null });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { score, type, comment, answers } = body;

    if (typeof score !== "number" || !type || !comment || !answers) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("diagnosis_results")
      .insert([{ score, type, comment, answers }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}