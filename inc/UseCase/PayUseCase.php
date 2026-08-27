<?php

namespace Wolf\Memberships\UseCase;

use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Core\UseCase\UseCaseBus;

class PayUseCase implements UseCaseInterface
{
    private UseCaseBus $useCaseBus;

    public function __construct(UseCaseBus $useCaseBus)
    {
        $this->useCaseBus = $useCaseBus;
    }

    public function execute(array $params = [])
    {
        $paymentMethod = $params['payment_method'] ?? null;

        $externalId = 'membership:' . $params['campaign']->id . ':' . $params['request']->id;

        if ($paymentMethod === 'credit_card') {
            return $this->processCreditCardPayment((int) $params['pay']['total_amount'], $params['campaign'], $params['request'], $externalId);
        } elseif ($paymentMethod === 'credit_card_x3') {
            return $this->processCreditCardX3Payment($params['pay'], $params['campaign'], $params['request'], $externalId);
        } elseif ($paymentMethod === 'bank_transfer') {
            return $this->processBankTransferPayment((int) $params['pay']['total_amount'], $params['campaign'], $params['request'], $externalId);
        } elseif ($paymentMethod === 'check') {
            return $this->processCheckPayment((int) $params['pay']['total_amount'], $params['campaign'], $params['request'], $externalId);
        } else {
            throw new \InvalidArgumentException('Invalid payment method.');
        }
    }

    /**
     * Process credit card payment
     *
     * @param int $amount
     * @param \stdClass $campaign
     * @param \stdClass $request
     * @param string $externalId
     * @return array
     */
    private function processCreditCardPayment(int $amount, \stdClass $campaign, \stdClass $request, string $externalId)
    {
        return $this->useCaseBus->execute('wolf-billing.create_payment', [
            'amount' => $amount,
            'currency' => 'EUR',
            'payment_method' => 'multiplehelloasso',
            'name' => $this->buildTitle($campaign),
            'payer' => $this->buildPayer($request),
            'metadata' => ['external_id' => $externalId],
            'return_url' => $this->buildResultUrl()
        ]);
    }

    /**
     * Process credit card x3 payment
     *
     * @param array $pay
     * @param \stdClass $campaign
     * @param \stdClass $request
     * @param string $externalId
     * @return array
     */
    private function processCreditCardX3Payment(array $pay, \stdClass $campaign, \stdClass $request, string $externalId)
    {
        $amount = (int) $pay['total_amount'];
        $periods = 3;

        $fees = 0;
        $amount = 0;
        foreach ($pay['items'] as $item) {
            if ($item['type'] === 'fee') {
                $fees += (int) $item['amount'];
            } else {
                $amount += (int) $item['amount'];
            }
        }

        $baseAmount = floor($amount / $periods);

        $terms = [];
        $terms[] = [
            'amount' => $baseAmount + $fees,
            'date' => strtotime('+0 month'),
        ];
        $amount -= $baseAmount;

        for ($i = 1; $i < $periods; $i++) {
            $terms[] = [
                'amount' => $baseAmount,
                'date' => strtotime('+' . $i . ' month'),
            ];

            $amount -= $baseAmount;
        }

        // Regularize the last term to account for any rounding differences
        if ($amount > 0) {
            $terms[count($terms) - 1]['amount'] += $amount;
        }

        return $this->useCaseBus->execute('wolf-billing.create_payment', [
            'amount' => $pay['total_amount'],
            'currency' => 'EUR',
            'payment_method' => 'multiplehelloasso',
            'name' => $this->buildTitle($campaign),
            'payer' => $this->buildPayer($request),
            'items' => $terms,
            'metadata' => ['external_id' => $externalId],
            'return_url' => $this->buildResultUrl()
        ]);
    }

    /**
     * Process bank transfer payment
     *
     * @param int $amount
     * @param \stdClass $campaign
     * @param \stdClass $request
     * @param string $externalId
     * @return array
     */
    private function processBankTransferPayment(int $amount, \stdClass $campaign, \stdClass $request, string $externalId)
    {
        return $this->useCaseBus->execute('wolf-billing.create_payment', [
            'amount' => $amount,
            'currency' => 'EUR',
            'payment_method' => 'bank_transfer',
            'name' => $this->buildTitle($campaign),
            'payer' => $this->buildPayer($request),
            'metadata' => ['external_id' => $externalId],
            'return_url' => $this->buildResultUrl()
        ]);
    }

    /**
     * Process check payment
     *
     * @param int $amount
     * @param \stdClass $campaign
     * @param \stdClass $request
     * @param string $externalId
     * @return array
     */
    private function processCheckPayment(int $amount, \stdClass $campaign, \stdClass $request, string $externalId)
    {
        return $this->useCaseBus->execute('wolf-billing.create_payment', [
            'amount' => $amount,
            'currency' => 'EUR',
            'payment_method' => 'check',
            'name' => $this->buildTitle($campaign),
            'payer' => $this->buildPayer($request),
            'metadata' => ['external_id' => $externalId],
            'return_url' => $this->buildResultUrl()
        ]);
    }

    /**
     * Build payer
     * @param \stdClass $request
     * @return array{email: mixed, first_name: mixed, last_name: mixed}
     */
    private function buildPayer(\stdClass $request): array
    {
        return [
            'first_name' => $request->firstname,
            'last_name' => $request->lastname,
            'email' => $request->email
        ];
    }

    /**
     * Build title for the payment
     * @param \stdClass $campaign
     * @return string
     */
    private function buildTitle(\stdClass $campaign): string
    {
        return 'Inscription à la campagne "' . $campaign->title . '"';
    }

    /**
     * Build the result URL for the payment
     * @return string Return URL for the payment result
     */
    private function buildResultUrl(): string
    {
        $pageId = (int) get_option('wolf_membership_result_page', 0);
        return get_permalink($pageId);
    }
}