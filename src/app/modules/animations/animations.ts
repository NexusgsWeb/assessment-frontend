import {
  trigger,
  transition,
  style,
  animateChild,
  state,
  animate,
  query,
  group,
} from '@angular/animations';

export const slider = trigger('routeAnimations', [
  transition('login => forget', slideTo('right')),
  transition('forget => login', slideTo('left')),
  //
  transition('main => newOrganization', slideTo('right')),
  transition('newOrganization => main', slideTo('left')),
  //
  //

  transition('EmployeeApplication => EmployeeProfile', slideTo('right')),
  transition('EmployeeProfile => EmployeeApplication', slideTo('left')),
  //
  transition('StudentRegistration => StudentProfile', slideTo('right')),
  transition('StudentProfile => StudentRegistration', slideTo('left')),
  //
  transition('EmployeeApplication => NewEmployeeApplication', slideTo('right')),
  transition('NewEmployeeApplication => EmployeeApplication', slideTo('left')),
  //
  transition('StudentRegistration => NewStudentRegistration', slideTo('right')),
  transition('NewStudentRegistration => StudentRegistration', slideTo('left')),
  //
  transition('viewAssessments => createAssessment', slideTo('right')),
  transition('createAssessment => viewAssessments', slideTo('left')),
]);

function slideTo(direction) {
  const optional = { optional: true };
  return [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          [direction]: 0,
          width: '100%',
        }),
      ],
      optional
    ),
    style({ position: 'relative' }),

    query(':enter', [style({ [direction]: '-100%' })]),
    group([
      query(
        ':leave',
        [animate('600ms ease', style({ [direction]: '100%' }))],
        optional
      ),
      query(':enter', [animate('600ms ease', style({ [direction]: '0%' }))]),
    ]),
    // Normalize the page style... Might not be necessary

    // Required only if you have child animations on the page
    // query(':leave', animateChild()),
    // query(':enter', animateChild()),
  ];
}

/*
 * animation: sideNaveAnimation
 * trigger: 'openClose'
 *
 * comments: sets the width of an element to 200px when 'open' and to 60px
 *   when closed.  Animates in between these two states over '0.3s'
 */

export const sideNavAnimation = trigger('openCloseSidenav', [
  // ...
  state(
    'open',
    style({
      width: '250px',
    })
  ),
  state(
    'closed',
    style({
      width: '60px',
    })
  ),
  transition('open <=> closed', [animate('0.1s')]),
]);

/*
 * animation: sideNavContainerAnimation
 * trigger: 'openCloseSidenavContent'
 *
 * comments: Sets the margin-left to 201px when "open" and 61px when "closed".
 */

export const sideNavContainerAnimation = trigger('openCloseSidenavContent', [
  state(
    'open',
    style({
      'margin-left': '251px',
    })
  ),
  state(
    'closed',
    style({
      'margin-left': '61px',
    })
  ),
  transition('open <=> closed', [animate('0.1s')]),
]);
