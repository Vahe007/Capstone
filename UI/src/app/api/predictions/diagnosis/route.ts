import { getCookie } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

const { API_URL } = process.env;

export const GET = async (req: NextRequest) => {
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

    const response = await fetch(`${API_URL}/modelPrediction/diagnosis`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    console.log("data inside the route is", data);

    if (response.status === 200) {
      return NextResponse.json(
        {
          diagnosis: data,
          error: null,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        error: "Error",
      },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 },
    );
  }
};
