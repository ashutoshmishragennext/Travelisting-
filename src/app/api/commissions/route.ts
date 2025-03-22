import { and, between, count, eq, sum } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  SalesCommissionTable,
  VendorPaymentTable,
  PlanTable,
} from "@/drizzle/schema";

export interface CommissionSummary {
  totalRevenue: number;
  totalCommission: number;
  netRevenue: number;
  transactionCount: number;
}

export interface CreateCommissionRequest {
  salesPersonId: string;
  vendorId: string;
  paymentId: string;
  planId: string;
}

export async function GET(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const salesPersonId = searchParams.get('salesPersonId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const conditions = [];
    
    if (salesPersonId) {
      conditions.push(eq(SalesCommissionTable.salesPersonId, salesPersonId));
    }

    if (startDate && endDate) {
      conditions.push(
        between(
          SalesCommissionTable.createdAt,
          new Date(startDate),
          new Date(endDate)
        )
      );
    }

    const query = db
      .select({
        totalRevenue: sum(VendorPaymentTable.amount),
        totalCommission: sum(SalesCommissionTable.commissionAmount),
        transactionCount: count(SalesCommissionTable.id),
      })
      .from(SalesCommissionTable)
      .leftJoin(
        VendorPaymentTable,
        eq(SalesCommissionTable.paymentId, VendorPaymentTable.id)
      )
      .where(and(...conditions));
      // console.log("Qu",query);
      

    const result = await query;
    
    const summary: CommissionSummary = {
      totalRevenue: Number(result[0]?.totalRevenue || 0),
      totalCommission: Number(result[0]?.totalCommission || 0),
      netRevenue: Number(result[0]?.totalRevenue || 0) - Number(result[0]?.totalCommission || 0),
      transactionCount: Number(result[0]?.transactionCount || 0),
    };

    return Response.json(summary);
  } catch (error) {
    console.error('Error in commission API:', error);
    return Response.json(
      { error: 'Failed to fetch commission data' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: CreateCommissionRequest = await req.json();
    const { salesPersonId, vendorId, paymentId, planId } = body;

    
    

    const paymentDetails = await db.query.VendorPaymentTable.findFirst({
      where: eq(VendorPaymentTable.id, paymentId),
    });
  
    if (!paymentDetails) {
      return Response.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    const planDetails = await db.query.PlanTable.findFirst({
      where: eq(PlanTable.id, planId),
    });
  
    if (!planDetails) {
      return Response.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }
    
    if(salesPersonId){
      const commission = await db.insert(SalesCommissionTable)
      .values({
        salesPersonId,
        vendorId,
        paymentId,
        planId,
        commissionAmount: planDetails.commission,
      })
      .returning();
      return Response.json(commission[0]);
    }
    else{
    const commission = await db.insert(SalesCommissionTable)
    .values({
      salesPersonId : null,
      vendorId,
      paymentId,
      planId,
      commissionAmount: null,
    })
    .returning();
  
    return Response.json(commission[0]);
  }

   
  } catch (error) {
    console.error('Error creating commission:', error);
    return Response.json(
      { error: 'Failed to create commission record' },
      { status: 500 }
    );
  }
}