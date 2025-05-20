import { getCookie } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

const { API_URL } = process.env;

export const POST = async (req: NextRequest) => {
  try {
    const accessToken = await getCookie("accessToken");
    const body = await req.json();
    const { model_type, features } = body;

    if (!API_URL) {
      return NextResponse.json(
        { error: "API_URL not defined" },
        { status: 500 },
      );
    }

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }

    const response = await fetch(`${API_URL}/modelPrediction/${model_type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ features }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return NextResponse.json(
        {
          ...data,
          error: null,
        },
        { status: 200 },
      );
    }

    const error = Array.isArray(data.message)
      ? data.message.join(",")
      : data.message;

    return NextResponse.json(
      {
        error,
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
