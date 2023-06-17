import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaygroundPage } from './playground.page';
import { UserService } from './services';
import { userResolver } from './services/resolvers';
import { Test3ChildComponent } from './test3/test3-child/test3-child.component';

// const CHILD_ROUTES: Routes = [
//     {
//         path: 'test3-child',
//         loadChildren: () =>
//             import('./test3/test3-child/test3-child.component').then(
//                 (m) => m.Test3ChildComponent
//             ),
//     },
// ];

export const CHILD_ROUTES = [
    {
        path: '',
        component: Test3ChildComponent,
    },
] as Routes;

const routes: Routes = [
    {
        path: '',
        component: PlaygroundPage,
    },
    {
        path: 'test3-child',
        loadComponent: async () => {
            const comp = await import(
                './test3/test3-child/test3-child.component'
            );

            return comp.Test3ChildComponent;
        },
        resolve: {
            user: userResolver,
        },
        providers: [UserService],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomePageRoutingModule {}
