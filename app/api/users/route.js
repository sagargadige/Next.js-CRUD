import { NextResponse } from "next/server";
import { connectDatabase } from "@/app/configs/database.js";
import UserModel from "@/app/models/users.model.js";

export const GET = async () => {
  try {
    await connectDatabase();
    const users = await UserModel.find({});
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async req => {
  try {
    await connectDatabase();
    const body = await req.json();
    const data = await UserModel.create(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
