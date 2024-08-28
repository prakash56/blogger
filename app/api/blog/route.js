import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
const fs = require('fs')
// import multer from "multer";
// import { v4 as uuidv4 } from "uuid";


async function connectToDB() {
    await ConnectDB();
  }

  connectToDB();

  export async function GET(request) {
    try {
      await connectToDB();
      const blogId = request.nextUrl.searchParams.get("id");
      if (blogId) {
        const blog = await BlogModel.findById(blogId);
        return NextResponse.json(blog);
      } else {
        const blogs = await BlogModel.find({});
        return NextResponse.json({ blogs });
      }
    } catch (error) {
      console.error(error);
      return NextResponse.status(500).json({ error: "Internal Server Error" });
    }
  }


  export async function POST(request) {
    try {
      await connectToDB();
      const formData = await request.formData();
      const timestamp = Date.now();
      const file = formData.get("image");
  
      if (!file) {
        console.error("File not found in formData");
        return NextResponse.json({ error: "File not found" }, { status: 400 });
      }
  
      console.log("File:", file);
      const buffer = file.arrayBuffer ? Buffer.from(await file.arrayBuffer()) : undefined;
  
      if (!buffer) {
        console.error("Failed to create buffer from file");
        return NextResponse.json({ error: "Failed to process file" }, { status: 500 });
      }
  
      const originalname = file.name; // Assuming file has a name property
      const filename = `${timestamp}_${originalname}`;
      const path = `./public/${filename}`;
      
      await writeFile(path, buffer);
      const imgUrl = `/${filename}`;
  
      const blogData = {
        title: `${formData.get("title")}`,
        description: `${formData.get("description")}`,
        category: `${formData.get("category")}`,
        author: `${formData.get("author")}`,
        image: `${imgUrl}`,
        authorImg: `${formData.get("authorImg")}`,
      };
  
      await BlogModel.create(blogData);
      console.log("Blog Saved");
  
      return NextResponse.json({ success: true, msg: "Blog Added" });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  export async function DELETE(request) {
    try {
      await connectToDB();
      const id = request.nextUrl.searchParams.get("id");
      const blog = await BlogModel.findById(id);
      if (!blog) {
        return NextResponse.status(404).json({ error: "Blog not found" });
      }
      const imagePath = `./public${blog.image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
      await BlogModel.findByIdAndDelete(id);
      return NextResponse.json({ msg: "Blog Deleted" });
    } catch (error) {
      console.error(error);
      return NextResponse.status(500).json({ error: "Internal Server Error" });
    }
  }
  