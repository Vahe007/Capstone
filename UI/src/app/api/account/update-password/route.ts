import { getCookie } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';

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

    const response = await fetch(`${API_URL}/auth/updatePassword`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.status === 200) {
      return NextResponse.json(
        { message: 'Password successfully changed' },
        { status: 200 },
      );
    }

    if (response.status === 404 || response.status === 400) {
      return NextResponse.json(
        { message: data.message },
        { status: response.status },
      );
    }

    return NextResponse.json({ message: 'Unexpected error' }, { status: 400 });
  } catch {
    return NextResponse.json({ message: 'Unexpected error' }, { status: 400 });
  }
};
