import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export abstract class BaseService {
  constructor(protected http: HttpClient, @Inject(String)protected baseUrl: string) {
    
  }

  //retrieve an api result including the relevant info like page. size, etc
  //as well as replaces any component specific implementation of getData....ie more DRY
  abstract getData<ApiResult>(pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<ApiResult>;

  //Get based on an id
  //replaces any component specific loading of data
  abstract get<T>(id: number): Observable<T>;

  //put based on an item
  //replaces component specific form submit
  abstract put<T>(item: T): Observable<T>;

  //post based on an item
  //replaces component specific form submit
  abstract post<T>(item: T): Observable<T>;

  /**
   * Generates random letter string with specified length
   * @param length: number
   */
   public generateId(length: number): string {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}

//The Api result item containing our relevant data
export interface ApiResult<T> {
  data: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  sortColumn: string;
  sortOrder: string;
  filterColumn: string;
  filterQuery: string;
}
