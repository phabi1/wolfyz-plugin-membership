<?php


namespace Wolf\Memberships\Entity\Repository;

use Wolf\Core\Entity\EntityRepositoryInterface;

interface MemberEntityRepositoryInterface extends EntityRepositoryInterface
{
    public function existsHash(string $hash): int|null;

    public function findSuggestions(string $lastname, string $firstname, string $birthdate, int $minScore = 0): array;
}