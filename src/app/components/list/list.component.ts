import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  recipes: any;
  api = 'https://api.github.com/users/';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  this.getRecipes('pasta');

  this.http.get(this.api + 'ivilinstoyanov').subscribe(data => console.log(data));
  }

  // tslint:disable-next-line: typedef
  getRecipes(recipe: string) {
    return this.http.get<any>(`https://forkify-api.herokuapp.com/api/search?&q=${recipe}`)
    .subscribe(data => { data = this.recipes; },
      error => {console.log(error); },
      () => { console.log(this.recipes); });
  }

  
}
