import { ConnectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import { NextResponse } from "next/server";

const connectToDB = async () => {
  await ConnectDB();
};

export async function POST(request) {
  try {
    await connectToDB();

    const formData = await request.formData();
    const email = formData.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, msg: "Email is required" },
        { status: 400 }
      );
    }

    const emailData = { email: `${email}` };
    await EmailModel.create(emailData);
    return NextResponse.json(
      { success: true, msg: "Email Subscribed" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectToDB();

    const emails = await EmailModel.find({});
    return NextResponse.json({ emails }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectToDB();

    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "ID is required" },
        { status: 400 }
      );
    }

    const email = await EmailModel.findById(id);

    if (!email) {
      return NextResponse.json(
        { success: false, msg: "Email not found" },
        { status: 404 }
      );
    }

    await EmailModel.findByIdAndDelete(id);
    return NextResponse.json(
      { success: true, msg: "Email Deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
}
