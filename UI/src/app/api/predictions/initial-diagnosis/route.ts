import { getCookie } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

const { API_URL } = process.env;

export const POST = async (req: NextRequest) => {
  try {
    const accessToken = await getCookie("accessToken");
    const body = await req.json();

    console.log("request body is", body);

    if (!API_URL) {
      return NextResponse.json(
        { error: "API_URL not defined" },
        { status: 500 },
      );
    }

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }

    const response = await fetch(`${API_URL}/initialDiagnosis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    console.log("response from the api request", response);

    const data = await response.json();

    console.log("data from the api request", data);

    if (response.status === 200) {
      return NextResponse.json(
        {
          diagnosis: data.initial_diagnosis_text,
          similar_cases: data.similar_cases,
          error: "",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        diagnosis: "",
        similar_cases: [],
        error: "No cases found",
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
