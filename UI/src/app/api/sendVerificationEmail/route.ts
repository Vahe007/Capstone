import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCookie } from "@/utils";

const { API_URL } = process.env;

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const accessToken = await getCookie("accessToken");

    if (!API_URL) {
      return NextResponse.json(
        { error: "API_URL not defined" },
        { status: 500 },
      );
    }

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }

    const response = await fetch(`${API_URL}/auth/sendVerificationEmail`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.status === 200) {
      return NextResponse.json(data, { status: 200 });
    }
    if (response.status === 404) {
      return NextResponse.json(
        { error: "User with provided email does not exist" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Error", details: data },
      { status: response.status },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 },
    );
  }
};
