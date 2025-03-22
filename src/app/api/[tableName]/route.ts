import { eq, and, inArray, desc, asc, SQL, AnyColumn } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { modelMap } from "@/lib/modelMap";
import { PgSelect } from "drizzle-orm/pg-core";

// Custom error types
interface APIError extends Error {
  code?: string;
  status: number;
  details?: string;
}

class ValidationError extends Error implements APIError {
  status: number;
  code?: string;
  details?: string;

  constructor(
    message: string,
    status: number = 400,
    code?: string,
    details?: string
  ) {
    super(message);
    this.name = "ValidationError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

class DatabaseError extends Error implements APIError {
  status: number;
  code?: string;
  details?: string;

  constructor(
    message: string,
    status: number = 500,
    code?: string,
    details?: string
  ) {
    super(message);
    this.name = "DatabaseError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
type OrderDirection = typeof asc | typeof desc;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const tableName = request.nextUrl.pathname.split("/").pop();

    if (!tableName || !modelMap[tableName]) {
      throw new ValidationError("Invalid table name", 400);
    }

    const whereConditions: SQL[] = [];
    let orderByColumns: { column: AnyColumn; direction: OrderDirection }[] = [];
    const validAttributes = modelMap[tableName].attributes;

    // ... [keep all the parameter processing logic the same]

    // Initialize the base query with proper typing
    let query: PgSelect = db
      .select()
      .from(modelMap[tableName].table) as unknown as PgSelect;

    // Apply where conditions
    if (whereConditions.length > 0) {
      query = db
        .select()
        .from(modelMap[tableName].table)
        .where(and(...whereConditions)) as unknown as PgSelect;
    }

    // Apply order by
    if (orderByColumns.length > 0) {
      const orderedQuery = orderByColumns.reduce(
        (acc, { column, direction }) => {
          return acc.orderBy(direction(column));
        },
        query
      );
      query = orderedQuery as PgSelect;
    }

    // Apply relations
    if (modelMap[tableName].relations) {
      const joinedQuery = modelMap[tableName].relations.reduce(
        (
          acc: { leftJoin: (arg0: any, arg1: any) => any },
          relation: { table: any; on: any }
        ) => {
          return acc.leftJoin(relation.table, relation.on);
        },
        query
      );
      query = joinedQuery as PgSelect;
    }

    const records = await query;

    if (whereConditions.length > 0 && records.length === 0) {
      throw new ValidationError(
        `No ${tableName} found matching the criteria`,
        404
      );
    }

    return NextResponse.json(records);
  } catch (error: unknown) {
    console.error("Error:", error);

    if (error instanceof ValidationError || error instanceof DatabaseError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          code: error.code,
        },
        { status: error.status }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : "An unexpected error occurred",
        stack:
          process.env.NODE_ENV === "development"
            ? (error as Error).stack
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const tableName = pathname.split("/").pop();

    if (!tableName || !modelMap[tableName]) {
      throw new ValidationError("Invalid table name", 400);
    }

    const formData = await request.json();

    const insertResult = await db
      .insert(modelMap[tableName].table)
      .values(Array.isArray(formData) ? formData : [formData])
      .returning();

    return NextResponse.json(insertResult, { status: 200 });
  } catch (error: unknown) {
    console.error("Error:", error);

    if (error instanceof ValidationError || error instanceof DatabaseError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          code: error.code,
        },
        { status: error.status }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : "An unexpected error occurred",
        stack:
          process.env.NODE_ENV === "development"
            ? (error as Error).stack
            : undefined,
      },
      { status: 500 }
    );
  }
}
