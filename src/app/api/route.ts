import { modelMap } from "@/lib/modelMap";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Create a serializable version of the model map
    const serializableModelMap = Object.entries(modelMap).reduce(
      (acc, [key, value]) => {
        // Only include the attributes array and any other safe-to-serialize properties
        return {
          ...acc,
          [key]: {
            attributes: value.attributes,
            // You can add other safe properties here if needed
          },
        };
      },
      {}
    );

    return NextResponse.json({
      success: true,
      data: serializableModelMap,
      timestamp: new Date().toISOString(),
      count: Object.keys(serializableModelMap).length,
    });
  } catch (error: any) {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch model map",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
      }
    );
  }
}
