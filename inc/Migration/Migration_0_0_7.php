<?php

namespace Wolf\Memberships\Migration;

use Wolf\Core\Migration\MigrationInterface;

class Migration_0_0_7 implements MigrationInterface
{

    public function up()
    {
        $this->addWeightToWheelTable();
        $this->addWheels();
    }

    public function down()
    {
    }

    private function addWeightToWheelTable()
    {
        global $wpdb;

        $tableName = $wpdb->prefix . 'wolf_memberships_wheel';

        if ($wpdb->get_var("SHOW COLUMNS FROM `$tableName` LIKE 'weight'") === null) {
            $wpdb->query("ALTER TABLE `$tableName` ADD `weight` INT NOT NULL DEFAULT 0");
        }
    }

    private function addWheels()
    {
        global $wpdb;

        $tableName = $wpdb->prefix . 'wolf_memberships_wheel';

        $wheels = [
            [
                'title' => 'Jaune', 'color' => '#FFFF00', 'weight' => 1
            ],
            [
                'title' => 'Rouge', 'color' => '#FF0000', 'weight' => 4
            ],
            [
                'title' => 'Verte', 'color' => '#00FF00', 'weight' => 2
            ],
            [
                'title' => 'Bleue', 'color' => '#0000FF', 'weight' => 3
            ],
            [
                'title' => 'Noire', 'color' => '#000000', 'weight' => 5
            ],
        ];

        foreach ($wheels as $wheel) {
            $wpdb->insert($tableName, $wheel);
        }
    }
}