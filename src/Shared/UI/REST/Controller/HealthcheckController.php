<?php

declare(strict_types=1);

namespace App\Shared\UI\REST\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class HealthcheckController
{
    #[Route('/healthcheck', name: 'healthcheck', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        return new JsonResponse(['status' => 'ok']);
    }
}