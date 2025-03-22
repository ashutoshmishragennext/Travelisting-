import { db } from "@/lib/db";
import { modelMap } from "@/lib/modelMap";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Define base types
type ModelRecord = Record<string, any>;

interface RouteParams {
  params: {
    tableName: string;
    id: string;
  };
}

// PUT function to update an existing record
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { tableName, id } = params;

    if (!tableName || !modelMap[tableName]) {
      return NextResponse.json(
        { error: "Invalid table name" },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "ID is required for updating a record" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const data: ModelRecord = Object.fromEntries(formData);
    const files: Record<string, File> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value instanceof File) {
        files[key] = value;
        delete data[key];
      }
    }

    // Validate incoming data against the model's attributes
    const validAttributes = modelMap[tableName].attributes;
    const invalidKeys = Object.keys(data).filter(
      (key) => !validAttributes.includes(key)
    );
    if (invalidKeys.length > 0) {
      return NextResponse.json(
        { error: `Invalid attributes in data: ${invalidKeys.join(", ")}` },
        { status: 400 }
      );
    }

    const updatedRecord = await db
      .update(modelMap[tableName].model)
      .set(data)
      .where(eq(modelMap[tableName].model.id, id))
      .returning() as ModelRecord[];

    if (!updatedRecord.length) {
      return NextResponse.json(
        { error: "Record not found or update failed" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRecord[0], { status: 200 });
  } catch (error: unknown) {
    console.error("Original error:", error);

    if (error instanceof Error) {
      // Handle unique constraint violations
      if (error.message.includes('unique constraint')) {
        return NextResponse.json(
          {
            error: "Duplicate entry",
            details: "A record with this value already exists. Please use a unique value.",
          },
          { status: 409 }
        );
      }

      // Handle foreign key constraint violations
      if (error.message.includes('foreign key constraint')) {
        return NextResponse.json(
          {
            error: "Invalid relationship",
            details: "The referenced record in the relationship does not exist",
          },
          { status: 422 }
        );
      }

      // Handle data type validation errors
      if (error.message.includes('invalid input syntax')) {
        return NextResponse.json(
          {
            error: "Invalid data format",
            details: "One or more field values are in an incorrect format. Please check your input.",
          },
          { status: 400 }
        );
      }

      // Handle not null constraint violations
      if (error.message.includes('null value in column')) {
        return NextResponse.json(
          {
            error: "Missing required fields",
            details: "One or more required fields are missing or null",
          },
          { status: 400 }
        );
      }

      // Development vs Production error handling
      return NextResponse.json(
        {
          error: "Update failed",
          details: process.env.NODE_ENV === "development" 
            ? error.message 
            : "An unexpected error occurred while processing your request",
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        { status: 500 }
      );
    }

    // Fallback error
    return NextResponse.json(
      {
        error: "Operation failed",
        details: "An unexpected error occurred while processing your request",
      },
      { status: 500 }
    );
  }
}

// DELETE function to delete a record
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { tableName, id } = params;

    if (!tableName || !modelMap[tableName]) {
      return NextResponse.json(
        { error: "Invalid table name" },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "ID is required for deleting a record" },
        { status: 400 }
      );
    }

    const deletedRecord = await db
      .delete(modelMap[tableName].model)
      .where(eq(modelMap[tableName].model.id, id))
      .returning() as ModelRecord[];

    if (!deletedRecord.length) {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `${tableName} deleted successfully` },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Original error:", error);

    if (error instanceof Error) {
      // Handle foreign key constraint violations
      if (error.message.includes('foreign key constraint')) {
        return NextResponse.json(
          {
            error: "Cannot delete record",
            details: "This record cannot be deleted because it is referenced by other records",
          },
          { status: 409 }
        );
      }

      // Handle invalid ID format
      if (error.message.includes('invalid input syntax')) {
        return NextResponse.json(
          {
            error: "Invalid ID format",
            details: "The provided ID is in an invalid format",
          },
          { status: 400 }
        );
      }

      // Development vs Production error handling
      return NextResponse.json(
        {
          error: "Delete failed",
          details: process.env.NODE_ENV === "development" 
            ? error.message 
            : "An unexpected error occurred while trying to delete the record",
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        { status: 500 }
      );
    }

    // Fallback error
    return NextResponse.json(
      {
        error: "Delete operation failed",
        details: "An unexpected error occurred while trying to delete the record",
      },
      { status: 500 }
    );
  }
}

// GET function to retrieve a record
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { tableName, id } = params;

    if (!tableName || !modelMap[tableName]) {
      return NextResponse.json(
        { error: "Invalid table name" },
        { status: 400 }
      );
    }

    const record = await db
      .select()
      .from(modelMap[tableName].model)
      .where(eq(modelMap[tableName].model.id, id))
      .limit(1) as ModelRecord[];

    if (!record.length) {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(record[0]);
  } catch (error: unknown) {
    console.error("Original error:", error);

    if (error instanceof Error) {
      // Handle invalid query parameters
      if (error.message.includes('invalid input syntax')) {
        return NextResponse.json(
          {
            error: "Invalid query parameters",
            details: "One or more query parameters are in an invalid format",
          },
          { status: 400 }
        );
      }

      // Development vs Production error handling
      return NextResponse.json(
        {
          error: "Query failed",
          details: process.env.NODE_ENV === "development" 
            ? error.message 
            : "An unexpected error occurred while fetching the record",
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        { status: 500 }
      );
    }

    // Fallback error
    return NextResponse.json(
      {
        error: "Query failed",
        details: "An unexpected error occurred while fetching the record",
      },
      { status: 500 }
    );
  }
}