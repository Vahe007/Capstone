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

    try {
      const response = await fetch(`${API_URL}/auth/sendResetPasswordEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      console.log("response inside the reset password", response);
      console.log("data inside the reset password", data);

      if (response.status === 200) {
        return NextResponse.json(
          { message: "Email for reseting your password is successfully sent" },
          { status: 200 },
        );
      }

      if (response.status === 404) {
        return NextResponse.json({ message: data.message }, { status: 404 });
      }

      return NextResponse.json(
        { message: "Unexpected error" },
        { status: 400 },
      );
    } catch {
      return NextResponse.json(
        { message: "Unexpected error" },
        { status: 500 },
      );
    }
  } catch (error) {
    return new Response(null, { status: 400 });
  }
};
