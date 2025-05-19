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

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.status === 201) {
      return NextResponse.json(data, { status: 201 });
    }

    if (response.status === 409) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Registration failed", details: data },
      { status: response.status },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 },
    );
  }
};
