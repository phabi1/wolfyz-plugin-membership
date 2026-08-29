<?php

namespace Wolf\Memberships\Controller;

use Wolf\Core\Mvc\Controller\EntityController;

class CampaignController extends EntityController
{
    protected $entityName = 'wolf-memberships.campaign';

    public function updateCampaignSettingsAction(\WP_REST_Request $request)
    {
        $useCaseBus = $this->getService('wolf.use_case_bus');
        $campaignId = $request->get_param('campaign_id');
        $settings = $request->get_json_params();

        $useCaseBus->execute('wolf-memberships.update_campaign_settings', [
            'campaign_id' => $campaignId,
            'settings' => $settings
        ]);

        return ['success' => true];
    }

    public function currentWheelsAction(\WP_REST_Request $request)
    {
        $useCaseBus = $this->getService('wolf.use_case_bus');

        $campaignId = $request->get_param('campaign_id');

        if ($campaignId === null) {
            return ['items' => []];
        }

        $wheelsStr = $request->get_query_params()['wheels'] ?? null;
        $wheels = $wheelsStr ? explode(',', $wheelsStr) : [];

        $items = $useCaseBus->execute('wolf-memberships.current_wheels', [
            'campaign_id' => $campaignId,
            'wheels' => $wheels
        ]);

        return ['items' => $items];
    }

    public function nextWheelsAction(\WP_REST_Request $request)
    {
        $useCaseBus = $this->getService('wolf.use_case_bus');

        $campaignId = $request->get_param('campaign_id');

        if ($campaignId === null) {
            return ['items' => []];
        }

        $wheelsStr = $request->get_query_params()['wheels'] ?? null;
        $wheels = $wheelsStr ? explode(',', $wheelsStr) : [];

        $items = $useCaseBus->execute('wolf-memberships.next_wheels', [
            'campaign_id' => $campaignId,
            'wheels' => $wheels
        ]);

        return ['items' => $items];
    }
}