import { Request } from "../../models/request";
import { Card, CardBody, CardHeader } from "@wordpress/components";
export function PayerCard({ request }: { request: Request }) {
    return (
        <Card>
            <CardHeader>
                {request.firstname} {request.lastname}
            </CardHeader>
            <CardBody>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                    <div>
                        <strong>Email:</strong> {request.email}
                    </div>
                    <div>
                        <strong>Phone:</strong> {request.phone}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}