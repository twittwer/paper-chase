import { Component } from '@angular/core';
import { RoutesPage } from '../routes/routes';
import { CurrentPage } from '../current/current';
import { HistoryPage } from '../history/history';

@Component( {
  templateUrl: 'tabs.html'
} )
export class TabsPage {
  routesPage: any = RoutesPage;
  currentPage: any = CurrentPage;
  historyPage: any = HistoryPage;

  constructor () {
  }
}
