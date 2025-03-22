import { NextRequest, NextResponse } from "next/server";

//new GET
import { db } from "@/lib/db";
import { asc, desc, eq, inArray } from "drizzle-orm";

import { modelMap } from "@/lib/modelMap";
import { SQL } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";
const isDevelopment = process.env.NODE_ENV === "development";
// const isDevelopment = false;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const tableName = request.nextUrl.pathname.split("/").pop();
    if (!tableName || !modelMap[tableName]) {
      return NextResponse.json(
        { error: "Invalid table name" },
        { status: 400 }
      );
    }

    const mainTable = modelMap[tableName];
    const table = mainTable.model;
    const validAttributes = mainTable.attributes;

    // Build a map of valid attributes from related tables
    const relatedAttributesMap = new Map<
      string,
      {
        tableName: string;
        model: any;
        attribute: string;
      }
    >();

    // Get related tables and their attributes
    const relatedTables = mainTable.with || [];
    for (const relatedTableName of relatedTables) {
      const relatedTable = modelMap[relatedTableName];
      if (relatedTable) {
        relatedTable.attributes.forEach((attr: any) => {
          relatedAttributesMap.set(`${relatedTableName}.${attr}`, {
            tableName: relatedTableName,
            model: relatedTable.model,
            attribute: attr,
          });
        });
      }
    }

    // Initialize query with proper type
    let query = db.select().from(table) as unknown as PgSelect;
    const whereConditions: SQL[] = [];

    // Join related tables
    for (const relatedTable of relatedTables) {
      if (modelMap[relatedTable]) {
        const relatedModel = modelMap[relatedTable].model;

        // if (relatedTable === "user") {
        //   query = query.leftJoin(
        //     relatedModel,
        //     eq(table[`${relatedTable}Id`], relatedModel.id),
        //   );
        // } else {
        //   query = query.leftJoin(
        //     relatedModel,
        //     eq(table[`${relatedTable}Id`], relatedModel.id),
        //   );
        // }
        query = query.leftJoin(
          relatedModel,
          eq(table[`${relatedTable}Id`], relatedModel.id)
        );
      }
    }

    searchParams.forEach((value, key) => {
      if (key === "orderBy") {
        const orderByFields = value.split(";").filter(Boolean);

        orderByFields.forEach((orderByValue) => {
          const [fieldPath, orderByDirection] = orderByValue.split(",");
          const direction =
            orderByDirection?.toLowerCase() === "desc" ? "desc" : "asc";

          // Check if it's a related table attribute (contains a dot)
          if (fieldPath.includes(".")) {
            const [relatedTableName, attributeName] = fieldPath.split(".");
            const relatedAttrInfo = relatedAttributesMap.get(fieldPath);

            if (relatedAttrInfo) {
              query = query.orderBy(
                direction === "asc"
                  ? asc(relatedAttrInfo.model[attributeName])
                  : desc(relatedAttrInfo.model[attributeName])
              ) as PgSelect;
            }
          }
          // Check if it's a main table attribute
          else if (validAttributes.includes(fieldPath)) {
            query = query.orderBy(
              direction === "asc"
                ? asc(table[fieldPath as keyof typeof table])
                : desc(table[fieldPath as keyof typeof table])
            ) as PgSelect;
          }
        });
      } else if (validAttributes.includes(key)) {
        if (key === "id") {
          const ids = value.split(",");
          if (ids.length > 1) {
            whereConditions.push(inArray(table.id, ids));
          } else {
            whereConditions.push(eq(table.id, ids[0]));
          }
        } else if (key === "state_id") {
          const stateIds = value.split(",").map((id) => parseInt(id, 10));
          if (stateIds.length > 1) {
            whereConditions.push(inArray(table.state_id, stateIds));
          } else {
            whereConditions.push(eq(table.state_id, stateIds[0]));
          }
        } else {
          whereConditions.push(eq(table[key as keyof typeof table], value));
        }
      }
    });

    // Apply where conditions if any exist
    if (whereConditions.length > 0) {
      query = query.where(whereConditions[0]) as PgSelect;
      for (let i = 1; i < whereConditions.length; i++) {
        query = query.where(whereConditions[i]) as PgSelect;
      }
    }

    // if (relatedTables.includes("user")) {
    //   const userModel = modelMap["user"].model;
    //   query = query.select((fields) => ({
    //     ...fields,
    //     user: {
    //       id: userModel.id,
    //       name: userModel.name,
    //       email: userModel.email,
    //     },
    //   }));
    // }

    const records = await query;
    if (whereConditions.length > 0 && records.length === 0) {
      return NextResponse.json(
        { error: `No ${tableName} found matching the criteria` },
        { status: 404 }
      );
    }

    return NextResponse.json(records);
  } catch (error: unknown) {
    if (isDevelopment) console.error("Detailed error:", error);
    return NextResponse.json(
      { error: "Error fetching records", details: (error as Error).message },
      { status: 500 }
    );
  }
}
