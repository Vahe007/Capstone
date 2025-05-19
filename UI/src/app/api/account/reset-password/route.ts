import { NextRequest, NextResponse } from "next/server";

const { API_URL } = process.env;

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    if (!API_URL) {
      return NextResponse.json(
        { error: "API_URL not defined" },
        { status: 500 },
      );
    }

    const response = await fetch(`${API_URL}/auth/changePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.status === 200) {
      return NextResponse.json(
        { message: "Password successfully changed" },
        { status: 200 },
      );
    }

    if (response.status === 404 || response.status === 400) {
      return NextResponse.json(
        { message: data.message },
        { status: response.status },
      );
    }

    return NextResponse.json({ message: "Unexpected error" }, { status: 400 });
  } catch {
    return NextResponse.json({ message: "Unexpected error" }, { status: 400 });
  }
};
