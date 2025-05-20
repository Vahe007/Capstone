import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "@/utils";
import { cookies } from "next/headers";

const { API_URL } = process.env;

export const GET = async (req: NextRequest) => {
  try {
    const token = req.nextUrl.searchParams.get("token");
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

    const response = await fetch(`${API_URL}/auth/verifyEmail?token=${token}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      const cookieStore = await cookies();
      cookieStore.set("accessToken", data.access_token);
      return NextResponse.json(
        { error: null, user: data.userInfo },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { error: "Verification link has expired", success: false },
      { status: 400 },
    );
  } catch (error) {
    console.log("error inside the route is", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 },
    );
  }
};
