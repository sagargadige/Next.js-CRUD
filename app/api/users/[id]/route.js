import UserModel from "@/app/models/users.model.js";
import { NextResponse } from "next/server";
import { connectDatabase } from "@/app/configs/database.js";

export const GET = async (req, { params }) => {
  try {
    await connectDatabase();
    const { id } = await params;
    const data = await UserModel.findById(id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const PUT = async (req, { params }) => {
  try {
    await connectDatabase();
    const { id } = await params;
    const body = await req.json();
    const data = await UserModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  try {
    await connectDatabase();
    const { id } = await params;
    const body = await req.json();
    const data = await UserModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await connectDatabase();
    const { id } = await params;
    const data = await UserModel.findByIdAndDelete(id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
