Overall I liked the experience of running the exercise. If I were to expand it, I would probably break my bar-chart componet into two separate componets. One pertaining to the 
data grid and one pertaining to the chart then added together into the mat-drawer. I did not get around to enabling sorting but might be nice. I would probably add some additional endpoints for flexibility. Then I would start looking at
how best to make the code more extensible. In this case I would probably start with refactoring more for solid and add unit testing then an IRequester interface (via Autofac just my usual DI tool) to make REST api calls to endpoints in the case that we wanted to expand 
on our design and make dlls for more apis we might be interested in. If this started to expand further past a a couple records might start looking at a higher grade data store (IE sql server) I already
started moving in this direction adding SQLServer EF and Autofac from nuget and I will probably continue missing with the project after this interview for fun. 

screenshots:
![The Chart](https://github.com/wesleyadams001/Assessment/blob/master/images/chart.png?raw=true)
![All](https://github.com/wesleyadams001/Assessment/blob/master/images/dashboardGridMenu.png?raw=true)
![Filters](https://github.com/wesleyadams001/Assessment/blob/master/images/filters.png?raw=true)
![Grid](https://github.com/wesleyadams001/Assessment/blob/master/images/grid.png?raw=true)
![Home](https://github.com/wesleyadams001/Assessment/blob/master/images/home.png?raw=true)

Thanks again for the opportunity to interview.