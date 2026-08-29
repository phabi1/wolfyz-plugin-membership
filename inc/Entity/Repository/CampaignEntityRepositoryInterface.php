<?php

namespace Wolf\Memberships\Entity\Repository;

use Wolf\Core\Entity\EntityRepositoryInterface;

interface CampaignEntityRepositoryInterface extends EntityRepositoryInterface
{

    function updateSettings(int $campaignId, array $settings);

}