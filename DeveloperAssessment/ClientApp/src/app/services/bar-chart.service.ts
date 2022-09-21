import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService, ApiResult } from '../base.service';
import { Observable } from 'rxjs';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class BarChartService extends BaseService  {

  public d3 = d3;
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) 
  {
    super(http, baseUrl);
  }

  //Pulls data using the api/Seed endpoint
  pullData(){
    console.log(this.baseUrl+'api/Seed');
    this.http.get(this.baseUrl+'api/Seed').subscribe(result => {
      
    }, error => console.error(error));;
    
    
  }
  
  //Calls get data API
  getData<ApiResult>(pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<ApiResult> {
    var url = this.baseUrl + 'api/Times';
    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder)
    if (filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }

    return this.http.get<ApiResult>(url, { params });
  }

  get<DataModel>(id): Observable<DataModel> {
    var url = this.baseUrl + "api/Times/" + id;
    return this.http.get<DataModel>(url);
  }
  put<DataModel>(item): Observable<DataModel> {
    var url = this.baseUrl + "api/Times/";
    return this.http.put<DataModel>(url, item);
  }
  post<DataModel>(item): Observable<DataModel> {
    var url = this.baseUrl + "api/Times/";
    return this.http.post<DataModel>(url, item);
  }

  isDupeField(countryId, fieldName, fieldValue): Observable<boolean> {
    var params = new HttpParams()
      .set("countryId", countryId)
      .set("fieldName", fieldName)
      .set("fieldValue", fieldValue);
    var url = this.baseUrl + "api/Times/IsDupeField";
    return this.http.post<boolean>(url, null, { params });
  }

  
}