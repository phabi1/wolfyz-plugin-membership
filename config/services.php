<?php
return [
    
    'wolf-memberships.controller.registration' => [
        'class' => \Wolf\Memberships\Controller\RegistrationController::class,
        'arguments' => [
            '@wolf.use_case_bus'
        ]
    ],
    
    
    'wolf-memberships.use_case.get_registration_for_campaign' => [
        'class' => \Wolf\Memberships\UseCase\GetRegistrationUseCase::class,
        'arguments' => [
            '@wolf-api.client'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.get_registration_for_campaign'
            ]
        ]
    ],
    'wolf-memberships.use_case.register_to_campaign' => [
        'class' => \Wolf\Memberships\UseCase\RegisterToCampaignUseCase::class,
        'arguments' => [
            '@wolf-api.client'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.register_to_campaign'
            ]
        ]
    ],
    'wolf-memberships.use_case.update_request' => [
        'class' => \Wolf\Memberships\UseCase\UpdateRequestUseCase::class,
        'arguments' => [
            '@wolf-api.client'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.update_request'
            ]
        ]
    ],
    'wolf-memberships.use_case.calculate_registration_total' => [
        'class' => \Wolf\Memberships\UseCase\CalculateRegistrationTotalUseCase::class,
        'arguments' => [
            '@wolf-api.client',
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.calculate_registration_total'
            ]
        ]
    ]
];