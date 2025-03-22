import { SalesCommissionTable, VendorPaymentTable, PlanTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { and, between, eq, sql } from "drizzle-orm";

interface CommissionSummary {
  totalAmount: number;
  totalCommission: number;
  transactionCount: number;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

export const commissionQueries = {
  // Calculate commission based on plan's commission rate
  async calculateCommission(planId: string, amount: number): Promise<number> {
    const plan = await db.query.PlanTable.findFirst({
      where: eq(PlanTable.id, planId),
    });
    
    if (!plan) {
      throw new Error('Plan not found');
    }

    // Commission is stored in the plan table
    return Number((amount * Number(plan.commission)).toFixed(2));
  },

  // Get commission summary for a specific sales person
  async getSalesPersonSummary(
    salesPersonId: string,
    dateRange?: DateRange
  ): Promise<CommissionSummary> {
    const whereConditions = [eq(SalesCommissionTable.salesPersonId, salesPersonId)];
    
    if (dateRange) {
      whereConditions.push(
        between(
          SalesCommissionTable.createdAt,
          dateRange.startDate,
          dateRange.endDate
        )
      );
    }
  
    const query = db
      .select({
        totalAmount: sql<number>`sum(${VendorPaymentTable.amount})`,
        totalCommission: sql<number>`sum(${SalesCommissionTable.commissionAmount})`,
        transactionCount: sql<number>`count(*)`,
      })
      .from(SalesCommissionTable)
      .innerJoin(
        VendorPaymentTable,
        eq(SalesCommissionTable.paymentId, VendorPaymentTable.id)
      )
      .where(and(...whereConditions));
  
    const result = await query;
    return {
      totalAmount: Number(result[0].totalAmount || 0),
      totalCommission: Number(result[0].totalCommission || 0),
      transactionCount: Number(result[0].transactionCount || 0),
    };
  },
  
  // Get overall commission summary for all sales persons
  async getOverallSummary(dateRange?: DateRange) {
    const whereConditions: any[] = [];
    
    if (dateRange) {
      whereConditions.push(
        between(
          SalesCommissionTable.createdAt,
          dateRange.startDate,
          dateRange.endDate
        )
      );
    }
  
    const query = db
      .select({
        salesPersonId: SalesCommissionTable.salesPersonId,
        totalAmount: sql<number>`sum(${VendorPaymentTable.amount})`,
        totalCommission: sql<number>`sum(${SalesCommissionTable.commissionAmount})`,
        transactionCount: sql<number>`count(*)`,
      })
      .from(SalesCommissionTable)
      .innerJoin(
        VendorPaymentTable,
        eq(SalesCommissionTable.paymentId, VendorPaymentTable.id)
      )
      .groupBy(SalesCommissionTable.salesPersonId);
  
    if (whereConditions.length > 0) {
      query.where(and(...whereConditions));
    }
  
    const results = await query;
    return results.map(result => ({
      salesPersonId: result.salesPersonId,
      totalAmount: Number(result.totalAmount || 0),
      totalCommission: Number(result.totalCommission || 0),
      transactionCount: Number(result.transactionCount || 0),
    }));
  },

  // Get overall commission summary for all sales persons
  // async getOverallSummary(dateRange?: DateRange) {
  //   let query = db
  //     .select({
  //       salesPersonId: SalesCommissionTable.salesPersonId,
  //       totalAmount: sql<number>`sum(${VendorPaymentTable.amount})`,
  //       totalCommission: sql<number>`sum(${SalesCommissionTable.commissionAmount})`,
  //       transactionCount: sql<number>`count(*)`,
  //     })
  //     .from(SalesCommissionTable)
  //     .innerJoin(
  //       VendorPaymentTable,
  //       eq(SalesCommissionTable.paymentId, VendorPaymentTable.id)
  //     )
  //     .groupBy(SalesCommissionTable.salesPersonId);

  //   if (dateRange) {
  //     query = query.where(
  //       and(
  //         between(
  //           SalesCommissionTable.createdAt,
  //           dateRange.startDate,
  //           dateRange.endDate
  //         )
  //       )
  //     );
  //   }

  //   const results = await query;
  //   return results.map(result => ({
  //     salesPersonId: result.salesPersonId,
  //     totalAmount: Number(result.totalAmount || 0),
  //     totalCommission: Number(result.totalCommission || 0),
  //     transactionCount: Number(result.transactionCount || 0),
  //   }));
  // },

  // Record a new commission
  // async recordCommission({
  //   salesPersonId,
  //   vendorId,
  //   paymentId,
  //   planId,
  // }: {
  //   salesPersonId: string;
  //   vendorId: string;
  //   paymentId: string;
  //   planId: string;
  // }) {
  //   // Get the payment amount
  //   const payment = await db.query.VendorPaymentTable.findFirst({
  //     where: eq(VendorPaymentTable.id, paymentId),
  //   });

  //   if (!payment) {
  //     throw new Error('Payment not found');
  //   }

  //   const commissionAmount = await this.calculateCommission(planId, Number(payment.amount));

  //   return db.insert(SalesCommissionTable).values({
  //     salesPersonId,
  //     vendorId,
  //     paymentId,
  //     planId,
  //     commissionAmount,
  //   });
  // },
};

