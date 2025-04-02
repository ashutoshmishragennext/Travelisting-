// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// // import { CertificationTable } from "@/drizzle/schema";

// interface CertificationInput {
//   vendorId: string;
//   name: string;
//   issuer: string;
//   issueDate: string;
//   expiryDate: string;
//   certificationNumber?: string;
//   verificationUrl?: string;
// }

// export async function POST(request: Request) {
//   try {
//     const body = (await request.json()) as CertificationInput;

//     // Validate required fields
//     const requiredFields = [
//       "vendorId",
//       "name",
//       "issuer",
//       "issueDate",
//       "expiryDate",
//     ];
//     const missingFields = requiredFields.filter((field) => !(field in body));

//     if (missingFields.length > 0) {
//       return NextResponse.json(
//         { error: "Missing required fields", fields: missingFields },
//         { status: 400 }
//       );
//     }

//     // Format dates to YYYY-MM-DD string format for PostgreSQL date type
//     const formatDate = (dateString: string) => {
//       const date = new Date(dateString);
//       return date.toISOString().split("T")[0];
//     };

//     // Create new certification with properly formatted dates
//     const newCertification = {
//       vendorId: body.vendorId,
//       name: body.name,
//       issuer: body.issuer,
//       issueDate: formatDate(body.issueDate),
//       expiryDate: formatDate(body.expiryDate),
//       ...(body.certificationNumber && {
//         certificationNumber: body.certificationNumber,
//       }),
//       ...(body.verificationUrl && { verificationUrl: body.verificationUrl }),
//     } satisfies typeof CertificationTable.$inferInsert;

//     // Insert the certification
//     const certification = await db
//       .insert(CertificationTable)
//       .values(newCertification)
//       .returning();

//     return NextResponse.json(certification[0]);
//   } catch (error) {
//     console.error("Error creating certification:", error);

//     if (error instanceof Error) {
//       if (error.message.includes("duplicate key")) {
//         return NextResponse.json(
//           { error: "Certification already exists", details: error.message },
//           { status: 409 }
//         );
//       }

//       if (error.message.includes("foreign key")) {
//         return NextResponse.json(
//           { error: "Invalid vendor ID", details: error.message },
//           { status: 400 }
//         );
//       }

//       if (error.message.includes("invalid input syntax for type uuid")) {
//         return NextResponse.json(
//           {
//             error: "Invalid UUID format for vendor ID",
//             details: error.message,
//           },
//           { status: 400 }
//         );
//       }

//       if (error.message.includes("invalid input syntax for type date")) {
//         return NextResponse.json(
//           { error: "Invalid date format", details: error.message },
//           { status: 400 }
//         );
//       }
//     }

//     return NextResponse.json(
//       {
//         error: "Error creating certification",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }


export async  function GET(){
    return new Response("Hello World", { status: 200 });
  }