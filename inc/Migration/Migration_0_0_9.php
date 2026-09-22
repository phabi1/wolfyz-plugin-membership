<?php

namespace Wolf\Memberships\Migration;

use Wolf\Core\Migration\MigrationInterface;

class Migration_0_0_9 implements MigrationInterface
{

    public function up()
    {
        $this->addSettingsColumn();
    }

    public function down()
    {
        global $wpdb;

        $tableName = $wpdb->prefix . 'wolf_memberships_request';

        $wpdb->query("ALTER TABLE $tableName DROP COLUMN settings");
    }

    private function addSettingsColumn()
    {
        global $wpdb;

        $tableName = $wpdb->prefix . 'wolf_memberships_request';

        $wpdb->query("ALTER TABLE $tableName ADD COLUMN settings JSON NOT NULL"); 
    }
}