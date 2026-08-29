import { Button, Card, CardBody, CardFooter, CardHeader, Flex, FlexItem } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useCallback, useState } from "react";
import useToast from "../../hooks/use-toast";
import { Pay } from "../../models/pay";
import { formatPrice } from "../../pipes";
import RequestService from "../../services/requests";
import AmountField from "../forms/fields/AmountField";
import { useForm } from "react-hook-form";
import Form from "../forms/Form";

export function RequestPayCard({ campaignId, requestId, pay, onApplyDiscount }: { campaignId: number; requestId: number; pay: Pay, onApplyDiscount?: (discount: number) => void }) {
    const amount = pay.total_amount;
    const [sending, setSending] = useState(false);
    const showToast = useToast();

    const discountForm = useForm<{ discount: number }>({
        defaultValues: {
            discount: 0,
        },
    });

    const applyDiscount = useCallback(async ({ discount }: { discount: number }) => {
        try {
            await RequestService.update(campaignId, requestId, { discount_amount: discount });
            showToast(__('Discount applied successfully', 'wolf-membership'),'success' );
            onApplyDiscount?.(discount);
        } catch (error) {
            showToast(__('Failed to apply discount', 'wolf-membership'), 'error' );
        }
    }, [campaignId, requestId, discountForm.watch("discount"), showToast]);

    const handlePayClick = useCallback(async () => {
        setSending(true);
        try {
            await RequestService.resendPayment(campaignId, requestId);
            showToast(__('Resend payment request', 'wolf-membership'), 'success' );
        } catch (error) {
            showToast(__('Failed to resend payment request', 'wolf-membership'), 'error' );
        } finally {
            setSending(false);
        }
    }, [campaignId, requestId, showToast]);

    return (
        <Card title="Payment Details">
            <CardHeader>
                <Flex>
                    <FlexItem>
                        {__('Payment Details', 'wolf-membership')}
                    </FlexItem>
                    <FlexItem>
                        <Button type="button" isBusy={sending} onClick={handlePayClick}>
                            {__('Pay', 'wolf-membership')}
                        </Button>
                    </FlexItem>
                </Flex>
            </CardHeader >
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
                <Form form={discountForm} onSubmit={discountForm.handleSubmit(applyDiscount)}>
                    <Flex>
                        <AmountField
                            label={__('Discount', 'wolf-membership')}
                            name="discount"
                        />
                        <Button type="submit" variant="primary">
                            {__('Apply Discount', 'wolf-membership')}
                        </Button>
                    </Flex>
                </Form>
            </CardBody>
            <CardFooter>
                Total amount: {formatPrice(amount)}
            </CardFooter>
        </Card >
    );
}