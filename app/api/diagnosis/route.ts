import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing diagnosis result id" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("diagnosis_results")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { score, type, comment, answers } = body;

    if (typeof score !== "number" || !type || !comment || !answers) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
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
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}