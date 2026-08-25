<?php

namespace Wolf\Memberships;

use Wolf\Core\Migration\Migrator;

class Plugin
{

    public function run()
    {
        register_activation_hook(__FILE__, [$this, 'activate']);
        register_deactivation_hook(__FILE__, [$this, 'deactivate']);

        add_action('plugins_loaded', [$this, 'setup']);
        add_action('init', [$this, 'init']);

    }

    public function setup()
    {
        Migrator::upgrade('wolf-membership', WOLF_MEMBERSHIP_PLUGIN_DIR, __NAMESPACE__, WOLF_MEMBERSHIP_PLUGIN_VERSION);
    }

    public function init()
    {
        $admin = new Admin();
        $admin->setup();

        $api = new Api();
        $api->setup();

        //$this->registerTextDomain();
        $this->registerBlocks();

        add_action('order_success', function ($data) {
            $container = \Wolf\Core\Plugin::getContainer();
            $stringHelper = $container->get('wolf.helper.string');
            $externalId = $data['external_id'] ?? '';
            if (!empty($externalId) && $stringHelper->startsWith($externalId, 'membership:')) {
                list(, $campaignId, $requestId) = explode(':', $externalId);
                $useCaseBus = $container->get('wolf.use_case_bus');
                $useCaseBus->execute('wolf-memberships.mark_as_paid_request', [
                    'campaign_id' => $campaignId,
                    'request_id' => $requestId,
                ]);
            }
        });

        add_action('wolf_memberships_request_approved', function ($data) {
            $useCaseBus = \Wolf\Core\Plugin::getContainer()->get('wolf.use_case_bus');
            $request = $data['request'] ?? null;
            if ($request) {
                $useCaseBus->execute('wolf-memberships.convert_request_to_subscriptions', [
                    'campaign_id' => $request->campaign_id,
                    'request_id' => $request->id,
                ]);
            }
        });
    }

    public function activate()
    {
        Migrator::upgrade('wolf-membership', WOLF_MEMBERSHIP_PLUGIN_DIR, __NAMESPACE__, WOLF_MEMBERSHIP_PLUGIN_VERSION);
    }

    public function deactivate()
    {
    }

    public function registerTextDomain()
    {
        load_plugin_textdomain('wolf-membership', false, 'wolf-membership/languages');
    }

    private function registerBlocks()
    {
        wp_register_block_types_from_metadata_collection(WOLF_MEMBERSHIP_PLUGIN_DIR . '/build', WOLF_MEMBERSHIP_PLUGIN_DIR . '/build/blocks-manifest.php');
    }
}