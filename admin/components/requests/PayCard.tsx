import { Pay } from "../../models/pay";
import { Card, CardHeader, CardBody, CardFooter } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { formatPrice } from "../../pipes";

export function RequestPayCard({ pay }: { pay: Pay }) {
    const amount = pay.total_amount;

    return (
        <Card title="Payment Details">
            <CardHeader>{__('Payment Details', 'wolf-membership')}</CardHeader>
            <CardBody>
                <p>Participants Count: {pay.participants_count}</p>
                <p>Pricing Breakdown:</p>
                <ul>
                    {pay.pricing_breakdown.map((item, index) => (
                        <li key={index}>
                            {item.name} - {formatPrice(item.amount)}
                        </li>
                    ))}
                </ul>
            </CardBody>
            <CardFooter>
                Total amount: {formatPrice(amount)}
            </CardFooter>
        </Card>
    );
}