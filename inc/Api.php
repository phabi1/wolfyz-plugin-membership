<?php

namespace Wolf\Memberships;

use Wolf\Core\Di\ContainerAwareInterface;
use Wolf\Core\Di\ContainerAwareTrait;
use Wolf\Core\Plugin;
use Wolf\Core\Rest\Routes;

class Api implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    /**
     * Rest routes helper
     * @var Routes
     */
    private $restRoutesHelper;

    public function setup()
    {
        add_action('rest_api_init', function () {
            $this->registerRegistrationRoutes();
        });
    }

    protected function getContainer()
    {
        if ($this->container === null) {
            $this->setContainer(Plugin::getContainer());
        }
        return $this->container;
    }

    protected function getController($controllerName)
    {
        return $this->getContainer()->get($controllerName);
    }

    protected function registerRegistrationRoutes()
    {
        $controller = $this->getController('wolf-memberships.controller.registration');
        register_rest_route('wolf-memberships/v1', 'campaigns/(?P<campaign_id>[\d]+)/registration', [
            'methods' => 'GET',
            'callback' => [$controller, 'registrationAction'],
            'permission_callback' => '__return_true'
        ]);
        register_rest_route('wolf-memberships/v1', 'campaigns/(?P<campaign_id>[\d]+)/registration/calculate-total', [
            'methods' => 'POST',
            'callback' => [$controller, 'calculateTotalAction'],
            'permission_callback' => '__return_true'
        ]);
        register_rest_route('wolf-memberships/v1', 'campaigns/(?P<campaign_id>[\d]+)/register', [
            'methods' => 'POST',
            'callback' => [$controller, 'registerAction'],
            'permission_callback' => '__return_true'
        ]);
        register_rest_route('wolf-memberships/v1', 'campaigns/(?P<campaign_id>[\d]+)/upload-file', [
            'methods' => 'POST',
            'callback' => [$controller, 'uploadFileAction'],
            'permission_callback' => '__return_true'
        ]);
        register_rest_route('wolf-memberships/v1', 'campaigns/(?P<campaign_id>[\d]+)/upload-file', [
            'methods' => 'DELETE',
            'callback' => [$controller, 'removeFileAction'],
            'permission_callback' => '__return_true'
        ]);
        register_rest_route('wolf-memberships/v1', 'campaigns/(?P<campaign_id>[\d]+)/upload-file', [
            'methods' => 'GET',
            'callback' => [$controller, 'previewFileAction'],
            'permission_callback' => '__return_true'
        ]);
        
    }
}