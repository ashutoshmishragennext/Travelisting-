// lib/db/queries/vendor.ts
import { VendorProfileTable } from '@/drizzle/schema';
import { db } from '@/lib/db';

import { eq, and } from 'drizzle-orm';
// import {
//   VendorProfileTable,
//   VendorProductTable,
//   VendorServiceTable,
//   CertificationTable,
//   ReferenceTable,
//   ProductTable,
//   ServiceTable,
//   UserTable
// } from '../schema';


export async function getVendorProfile(vendorId: string) {
    console.log("vendor from ts file",vendorId);
  try {
    const vendor = await db.query.VendorProfileTable.findFirst({
      where: eq(VendorProfileTable.id, vendorId),
      with: {
        vendoruser: true,
        products: {
          with: {
            product: true
          }
        },
        services: {
          with: {
            service: true
          }
        },
        certifications: true,
        references: true
      }
    });

    return vendor;
  } catch (error) {
    console.error('Error fetching vendor profile:', error);
    throw new Error('Failed to fetch vendor profile');
  }
}
