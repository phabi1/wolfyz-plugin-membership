<?php

namespace Wolf\Memberships\UseCase;

use GuzzleHttp\Client;
use Wolf\Core\Entity\EntityRepositoryInterface;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Core\Entity\EntityManager;
use Wolf\Memberships\Entity\Repository\SessionEntityRepositoryInterface;

class GetRegistrationUseCase implements UseCaseInterface
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

        $query = [];
        if (!empty($params['request_id'])) {
            $query['request_id'] = $params['request_id'];
        }
        if (!empty($params['token'])) {
            $query['token'] = $params['token'];
        }

        $res = $this->client->get('/membership/campaigns/' . $campaignId . '/registration', [
            'query' => $query
        ]);

        $response = json_decode($res->getBody()->getContents(), true);

        return $response;
    }
}