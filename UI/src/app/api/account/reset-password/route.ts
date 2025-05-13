import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    // make the request here and return the response
  } catch (error) {
    return new Response(null, { status: 400 });
  }
};
