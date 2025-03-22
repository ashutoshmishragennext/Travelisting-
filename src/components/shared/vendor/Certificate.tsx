// components/VendorCertifications.tsx
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink } from 'lucide-react';

export interface Certification {
    id: number;
    vendorId: number;
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate: Date;
    certificationNumber?: string;
    verificationUrl?: string;
}

interface VendorCertificationsProps {
    certifications: Certification[];
}

export const VendorCertifications: React.FC<VendorCertificationsProps> = ({ certifications }) => {
    const isExpired = (date: Date) => new Date(date) < new Date();

    return (
        <Card className="shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Certifications</h2>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certifications.map((cert) => (
                        <Card key={cert.id} className="p-4 transition-transform transform hover:scale-105 hover:shadow-xl">
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{cert.name}</h3>
                                    <p className="text-sm text-gray-600">Issued by {cert.issuer}</p>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <div className="text-sm">
                                            <div>Issued: {new Date(cert.issueDate).toLocaleDateString()}</div>
                                            <div>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</div>
                                        </div>
                                    </div>

                                    <Badge className={`text-sm ${isExpired(cert.expiryDate) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                        {isExpired(cert.expiryDate) ? "Expired" : "Active"}
                                    </Badge>
                                </div>

                                {cert.certificationNumber && (
                                    <div className="text-sm">
                                        <span className="font-medium">Certificate #:</span> {cert.certificationNumber}
                                    </div>
                                )}

                                {cert.verificationUrl && (
                                    <a
                                        href={cert.verificationUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Verify Certificate <ExternalLink className="h-4 w-4 ml-1" />
                                    </a>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
