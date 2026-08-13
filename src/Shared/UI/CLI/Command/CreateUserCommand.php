<?php

declare(strict_types=1);

namespace App\Shared\UI\CLI\Command;

use App\Shared\Infrastructure\Doctrine\Repository\UserRepository;
use App\Shared\Infrastructure\Symfony\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-user',
    description: 'Create a user (email + hashed password) without going through registration.',
)]
final class CreateUserCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('email', InputArgument::REQUIRED, 'The user email address')
            ->addArgument('password', InputArgument::REQUIRED, 'The plain password (will be hashed)')
            ->addArgument('name', InputArgument::REQUIRED, 'The user first name')
            ->addArgument('surname', InputArgument::REQUIRED, 'The user surname')
            ->addOption('admin', null, InputOption::VALUE_NONE, 'Grant ROLE_ADMIN to the user');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $email = (string) $input->getArgument('email');
        $plainPassword = (string) $input->getArgument('password');
        $name = trim((string) $input->getArgument('name'));
        $surname = trim((string) $input->getArgument('surname'));

        if (false === filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $io->error(sprintf('"%s" is not a valid email address.', $email));

            return Command::INVALID;
        }

        if ('' === $plainPassword) {
            $io->error('The password cannot be empty.');

            return Command::INVALID;
        }

        if ('' === $name || '' === $surname) {
            $io->error('Name and surname cannot be empty.');

            return Command::INVALID;
        }

        if (null !== $this->userRepository->findOneBy(['email' => $email])) {
            $io->error(sprintf('A user with email "%s" already exists.', $email));

            return Command::FAILURE;
        }

        $user = new User();
        $user->setEmail($email);
        $user->setName($name);
        $user->setSurname($surname);
        $user->setRoles($input->getOption('admin') ? ['ROLE_ADMIN'] : []);
        $user->setPassword($this->passwordHasher->hashPassword($user, $plainPassword));

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $io->success(sprintf(
            'User "%s %s" <%s> created with roles: %s',
            $name,
            $surname,
            $email,
            implode(', ', $user->getRoles()),
        ));

        return Command::SUCCESS;
    }
}