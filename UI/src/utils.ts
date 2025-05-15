import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
};

export const getUserData = async () => {
  const accessTokenCookie = await getCookie("accessToken");
  const token = accessTokenCookie;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    return decoded;
  } catch {
    return null;
  }
};
