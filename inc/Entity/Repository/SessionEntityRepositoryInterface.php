<?php

namespace Wolf\Memberships\Entity\Repository;

use Wolf\Core\Entity\EntityRepositoryInterface;

interface SessionEntityRepositoryInterface extends EntityRepositoryInterface
{
    public function countByLessons(array $lessonIds): array;
}