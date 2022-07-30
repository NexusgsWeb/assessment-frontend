import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlendedLearningComponent } from './blended-learning.component';
import { LearningPathComponent } from './learning-path/learning-path.component';
import { MyLearningPathComponent } from './my-learning-path/my-learning-path.component';
import { NewLearningPathComponent } from './new-learning-path/new-learning-path.component';

const blendedLearningRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/blended-learning/my-learning-path',
        pathMatch: 'full',
      },
      {
        path: 'new-learning-path',
        component: NewLearningPathComponent,
        data: { breadcrumb: 'New Learning Path' },
      },
      {
        path: 'my-learning-path',
        component: MyLearningPathComponent,
        data: { breadcrumb: 'My Learning Path' },
      },
      {
        path: 'my-learning-path/:id',
        component: LearningPathComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(blendedLearningRoutes)],
  exports: [RouterModule],
})
export class BlendedLearningRoutingModule {}
