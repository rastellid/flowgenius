<?php

declare(strict_types=1);

namespace App\Shared\UI\WEB\Controller;

use App\Shared\Infrastructure\Symfony\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{
    /**
     * Serve il guscio HTML della SPA React per /home e qualsiasi sotto-path
     * (/home/assessment, …): è React Router (basename '/home') a gestire il
     * routing lato client, quindi refresh e deep-link ricevono lo stesso guscio.
     * L'accesso è ristretto agli autenticati da security.yaml (^/home).
     */
    #[Route('/home{path}', name: 'app_home', requirements: ['path' => '(?:/.*)?'], defaults: ['path' => ''])]
    public function index(): Response
    {
        /** @var User $user */
        $user = $this->getUser();

        return $this->render('home/index.html.twig', [
            'user' => $user,
        ]);
    }
}
