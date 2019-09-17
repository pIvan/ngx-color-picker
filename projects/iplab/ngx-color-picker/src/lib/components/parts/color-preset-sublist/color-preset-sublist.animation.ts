import {
    trigger, stagger, query,
    transition, animate, style, state
} from '@angular/animations';


export const OpacityAnimation = trigger('opacityAnimation', [
    state('true', style({ opacity: 1 })),
    transition('void => *', [
        style({ opacity: 0 }),
        animate('.08s ease-in')
    ])
])


export const ListAnimation = trigger('listAnimation', [
    transition('* => up', [
        query(':enter', [
            style({ opacity: 0, height: 0 }),
            stagger(-10, [
                animate('.08s', style({ opacity: 1, height: '*' }))
            ])
        ], { optional: true })
    ]),
    transition('* => right', [
        query(':enter', [
            style({ opacity: 0, height: 0 }),
            stagger(-10, [
                animate('.08s', style({ opacity: 1, height: '*' }))
            ])
        ], { optional: true })
    ]),
    transition('* => down', [
        query(':enter', [
            style({ opacity: 0, height: 0 }),
            stagger(10, [
                animate('.08s', style({ opacity: 1, height: '*' }))
            ])
        ], { optional: true })
    ]),
    transition('* => left', [
        query(':enter', [
            style({ opacity: 0, height: 0 }),
            stagger(10, [
                animate('.08s', style({ opacity: 1, height: '*' }))
            ])
        ], { optional: true })
    ])
])