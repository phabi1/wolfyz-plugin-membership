<?php

namespace Wolf\Memberships\UseCase;

use GuzzleHttp\Client;
use Wolf\Core\UseCase\UseCaseInterface;

class RegisterToCampaignUseCase implements UseCaseInterface
{
    private Client $client;

    

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function execute(array $params = []): array
    {
        $campaignId = $params['campaign_id'] ?? null;
        if (!$campaignId) {
            throw new \InvalidArgumentException('Campaign ID is required.');
        }

        $body = [];
        if (!empty($params['contact'])) {
            $body['contact'] = $params['contact'];
        }
        if (!empty($params['data'])) {
            $body['data'] = $params['data'];
        }

        $res = $this->client->post('/membership/campaigns/' . $campaignId . '/register', [
            'json' => $body
        ]);

        $response = json_decode($res->getBody()->getContents(), true);

        return $response;
    }
}