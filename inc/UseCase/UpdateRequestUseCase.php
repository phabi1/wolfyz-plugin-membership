<?php

namespace Wolf\Memberships\UseCase;

use GuzzleHttp\Client;
use Wolf\Core\Entity\EntityRepositoryInterface;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Core\Entity\EntityManager;
use Wolf\Core\Mail\MailService;

class UpdateRequestUseCase implements UseCaseInterface
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

        $requestId = $params['request_id'] ?? null;
        if (!$requestId) {
            throw new \InvalidArgumentException('Request ID is required.');
        }

        $token = $params['token'] ?? null;
        if (!$token) {
            throw new \InvalidArgumentException('Token is required.');
        }

        $body = [];
        if (!empty($params['contact'])) {
            $body['contact'] = $params['contact'];
        }
        if (!empty($params['data'])) {
            $body['data'] = $params['data'];
        }

        $res = $this->client->put('/membership/campaigns/' . $campaignId . '/requests/' . $requestId, [
            'query' => ['token' => $token],
            'json' => $body
        ]);

        $response = json_decode($res->getBody()->getContents(), true);

        return $response;
    }

    private function buildEditUrl($campaign, $request): string
    {
        $pageId = get_option('wolf_membership_registration_page');

        return get_permalink($pageId) . "?campaign_id={$campaign->id}&request_id={$request->id}&token={$request->token}";
    }

    private function sendConfirmationEmail($campaign, $request): bool
    {
        $email = $request->email;
        $context = ['editUrl' => $this->buildEditUrl($campaign, $request)];
        return $this->mailService->sendMail($email, 'wolf-membership:request-confirmation', $context);

    }

    private function sendNewRequestEmail($campaign, $request): bool
    {
        $email = 'phabi1@hotmail.fr';
        $context = [
            'campaignName' => $campaign->name,
            'memberName' => $request->firstname . ' ' . $request->lastname,
            'memberEmail' => $request->email,
            'requestId' => $request->id,
            'adminUrl' => admin_url('admin.php?page=wolf-membership-requests'),
        ];
        return $this->mailService->sendMail($email, 'wolf-membership:new-request', $context);
    }
}