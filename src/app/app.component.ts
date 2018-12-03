import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {SidebarService} from './services/sidebar.service';
import {SettingsColumnsService} from './services/settings-columns.service';
import {FilterFormService} from './services/filter-form.service';
import {Convert2CSV} from './functions/convert2csv';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SettingsColumnsService, FilterFormService]
})
export class AppComponent implements OnInit {
  @ViewChild(MatSidenav) mainSideNav: MatSidenav;
  public actionFilter = 'Hide';

  constructor(public sidebarService: SidebarService,
              public  settingsColumnsService: SettingsColumnsService,
              public filterFormService: FilterFormService
              ) { }

  ngOnInit(): void {
    this.sidebarService.setSidebar(this.mainSideNav);
  }

  public toggleSidebar(){
    this.sidebarService.toggle();
  }

  toggleFilter(){
    this.actionFilter = (this.actionFilter == 'Hide')? 'Show': 'Hide';
    this.settingsColumnsService.showFilter  = !this.settingsColumnsService.showFilter;
    // this.settingsColumnsService.loadFilter();
  }

  download(){
    let csvData = Convert2CSV(this.filterFormService.allData);
    let a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    var blob = new Blob([csvData], { type: 'text/csv' });
    var url= window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'vehicles.csv';/* your file name*/
    a.click();
    return 'success';
  }
  
}
