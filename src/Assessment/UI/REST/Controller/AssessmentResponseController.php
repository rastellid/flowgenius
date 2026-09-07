<?php

declare(strict_types=1);

namespace App\Assessment\UI\REST\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class AssessmentResponseController
{
    /**
     * Endpoint MOCK: accetta le risposte del wizard e risponde ok, senza
     * validare né persistere. La logica reale (entità + salvataggio) arriverà
     * in una fase successiva. Risponde a POST /v1/assessment/responses
     * (prefisso /v1/assessment/ da config/routes.yaml).
     */
    #[Route('/responses', name: 'assessment_responses_create', methods: ['POST'])]
    public function __invoke(): JsonResponse
    {
        return new JsonResponse(['status' => 'ok']);
    }
}
