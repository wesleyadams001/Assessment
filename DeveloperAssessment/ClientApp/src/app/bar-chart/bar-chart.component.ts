import {
    AfterViewInit,
    Component,
    Input,
    OnInit,
    Inject,
    ViewChild
  } 
  from "@angular/core";
  import { DataModel, VisModel } from "../models/model";
  import { BarChartService } from "../services/bar-chart.service";
  import { MatTableDataSource } from '@angular/material/table';
  import { MatPaginator, PageEvent } from '@angular/material/paginator';
  import { MatSort } from '@angular/material/sort';
  import { DomSanitizer } from '@angular/platform-browser';
  import { MatIconRegistry } from '@angular/material/icon';
  import { MatIcon } from '@angular/material/icon';

  import { ApiResult } from '../base.service';
  import { Observable } from 'rxjs';
  import { MatOptionSelectionChange } from "@angular/material/core";
  import { MatSelectChange } from "@angular/material/select";
  
  //an icon from font awesome pro to display using icons
  const ICON =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"/></svg>`;

  @Component({
    selector: "app-bar-chart",
    templateUrl: "./bar-chart.component.html",
    styleUrls: ["./bar-chart.component.scss"]
  })
  export class BarChartComponent implements OnInit {
    
    
    //Data properties
    public whereFilter: string = "";

    //The set of displayed columns in mat-table
    public displayedColumns: string[] = ['id', 'title', 'section', 'link'];

    //the structure that holds the mat-tables' data
    public tableData: MatTableDataSource<DataModel>;

    //Setting some default for later use in the mat datagrid paging utility
    defaultPageIndex: number = 0;
    defaultPageSize: number = 20;
    public defaultSortColumn: string = "Name";
    public defaultSortOrder: string = "asc";
    public defaultFilterColumn: string = "Section";
    public defaultQueryColumn: string = "";

    filterQuery: string = null;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    id: Observable<number>;

    //Chart properties
    @Input("barData") public barData: VisModel[]=[];
    @Input("title") public title: string = "Articles per Category";

    private highestValue: string = "";
    private svg: any;
    private margin = 100;
    private width = 750 - this.margin * 2;
    private height = 600 - this.margin * 2;

    constructor(
      private serv: BarChartService,
      private iconRegistry: MatIconRegistry, 
      private sanitizer: DomSanitizer
      ) {

      //Leverage the material icon registry to display a link icon for asthetics
      iconRegistry.addSvgIconLiteral('link', sanitizer.bypassSecurityTrustHtml(ICON));

    }

    /**
     * Triggered by the Get the Lastest Data button to load the SQLite database with upserts of most recent content 
     */
    getAll(){
      this.serv.pullData();
    }

    /**
     * Handles the link click in the data grid
     * @param link a stored link that redirects to the associated NYT article
     */
    handlePageChange(link: string) {
        window.location.href=link;
    }
  
    /**
     * Loads the data and primes the get data method with a pageend containing our pageindex and pagesize
     * @param query a query term to filter our dataset and graph
     */
    loadData(query: string = null) {
      var pageEvent = new PageEvent();
      pageEvent.pageIndex = this.defaultPageIndex;
      pageEvent.pageSize = this.defaultPageSize;
      if (query!=null) {
        this.filterQuery = query;
      }
      this.getData(pageEvent);
    }
  
    /**
     * getData method that does the meat of our needs such as composing appropriate get requests
     * @param event A page event that contains our page index and size
     */
    getData(event: PageEvent) {
      var sortColumn = (this.sort)
        ? this.sort.active
        : this.defaultSortColumn;
      var sortOrder = (this.sort)
        ? this.sort.direction
        : this.defaultSortOrder;
      var filterColumn = (this.filterQuery)
        ? this.defaultFilterColumn
        : null;
      var filterQuery = (this.filterQuery)
        ? this.filterQuery
        : null;

      //issue get data command using the bar service
      this.serv.getData<ApiResult<DataModel>>(
        event.pageIndex,
        event.pageSize,
        sortColumn,
        sortOrder,
        filterColumn,
        filterQuery)
        .subscribe(result => {
          this.paginator.length = result.totalCount;
          this.paginator.pageIndex = result.pageIndex;
          this.paginator.pageSize = result.pageSize;
          this.tableData = new MatTableDataSource<DataModel>(result.data);
          
          //use a dictionary to keep track of counts per section
          let counts = new Map<string, number>();
            for (var indx of this.tableData.data){
              let curSection = indx.section;
              if(counts.has(curSection)){
                counts.set(curSection,counts.get(curSection)+1);
              }else{
                counts.set(curSection,1);
              }
            }

            //nuke bar data arr
            this.barData= [];

            //add new items
            for(let [key,value] of counts){

              //create a vismodel from each item in counts
              var item: VisModel = {name: key, value: value, color: 'blue'};
              
              //add to the barData array
              this.barData.push(item);

            }

            //determining highest value for the chart
            let highestCurrentValue = 0;
            let tableLength = this.barData.length;
            this.barData.forEach((data, i) => {
              const barValue = Number(data);
              if (barValue > highestCurrentValue) {
                highestCurrentValue = barValue;
              }
              if (tableLength == i + 1) {
                this.highestValue = highestCurrentValue.toString();
              }
              
            });

            //create our svg
            this.createSvg();

            //draw our bars
            this.drawBars(this.barData);
          
      }, error => console.error(error));
    }

    /**
     * angular lifecycle hook to run loaddata(null) on initilization of the angular application
     */
    ngOnInit(): void {
      //Load data on init
      this.loadData(null);

    }

    /**
     * method triggered to clear current filters in the portal
     */
    removeFilter(){
      this.filterQuery = null;
      this.loadData();
    }

    /**
     * method triggered on click of a radio button
     * @param val 
     */
    select(val: string){
      this.loadData(val);
    }
  
    /**
     * Creates an SVG for rendering a chart
     */
    private createSvg(): void {
      //clear old svg chart
      var svg = this.serv.d3.select("svg");
      svg.selectAll("*").remove();
      svg.remove();
      
      //Create new SVG chart
      this.svg = this.serv.d3
        .select("div#chart")
        .append("svg")
        .attr(
          "viewBox",
          `0 0 ${this.width + this.margin * 2} ${this.height + this.margin * 2}`
        )
        .append("g")
        .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
    }
  
    /**
     * Draws charts bars 
     * @param data 
     */
    private drawBars(data: any[]): void {
      // Creating X-axis band scale
      const x = this.serv.d3
        .scaleBand()
        .range([0, this.width])
        .domain(data.map(d => d.name))
        .padding(0.2);
  
      // Drawing X-axis on the DOM
      this.svg
        .append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.serv.d3.axisBottom(x))
        .selectAll("text")
        //angle our text for no overlap
        .attr('transform', 'translate(-10, 0)rotate(-45)')
        .style('text-anchor', 'end')
        .style("font-size", "14px");
  
      // Creaate Y-axis band scale
      const y = this.serv.d3
        .scaleLinear()
        .domain([0, Number(this.highestValue) + 50])
        .range([this.height, 0]);
  
      // Draw the Y-axis on the DOM
      this.svg
        .append("g")
        .call(this.serv.d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "14px");
  
      // Create and fills the bars
      this.svg
        .selectAll("bars")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d =>
          y(d.value) < this.height ? this.height - y(d.value) : this.height
        )
        .attr("fill", d => d.color);
  
      this.svg
        .selectAll("text.bar")
        .data(data)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("fill", "#70747a")
        .attr("x", d => x(d.name) + 18)
        .attr("y", d => y(d.value) - 5)
        .text(d => Math.round(d.value * 100) / 100);

        //title
      this.svg.append("text")
        .attr("x", (this.width / 2))             
        .attr("y", 0 - (this.margin / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text(this.title);
    }
  }