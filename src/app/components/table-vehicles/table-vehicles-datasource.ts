import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import {Observable, merge} from 'rxjs';
import {VehicleInterface} from '../../interfaces/vehicle.interface';
import {VehicleReportDataService} from '../../services/vehicle-report-data.service';

/**
 * Data source for the Home view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TableVehiclesDataSource extends DataSource<VehicleInterface> {
  data: VehicleInterface[] = [];


  constructor(private paginator: MatPaginator,
              private sort: MatSort,
              private vehicleReportDataService:VehicleReportDataService
              ) {
    super();
    /*
    this.vehicleReportDataService.dataBehaviorSubject.asObservable().subscribe(resp=>{
      console.log(`[TableVehiclesDataSource/constructor] Set Data`, resp);
      this.data = resp.data;
    });*/
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<VehicleInterface[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      this.vehicleReportDataService.dataBehaviorSubject.asObservable(),
      this.paginator.page,
      this.sort.sortChange
    ];

    // Set the paginator's length
    this.paginator.length = this.data.length;

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: VehicleInterface[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: VehicleInterface[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'economic_number': return compare(+a.economic_number, +b.economic_number, isAsc);
        case 'year': return compare(+a.year, +b.year, isAsc);
        case 'amount': return compare(+a.amount, +b.amount, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}