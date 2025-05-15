import { getCookie } from "@/utils";
import { NextResponse } from "next/server";

const { API_URL } = process.env;

export const GET = async () => {
  try {
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

    const response = await fetch(`${API_URL}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      return NextResponse.json(
        {
          user: data,
        },
        { status: 200 },
      );
    }
    return NextResponse.json(null, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 },
    );
  }
};
