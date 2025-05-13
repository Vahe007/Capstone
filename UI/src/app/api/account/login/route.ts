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

    console.log("body", body);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.status === 200) {
      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json(
      { error: "Login failed", details: data },
      { status: response.status },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 },
    );
  }
};
