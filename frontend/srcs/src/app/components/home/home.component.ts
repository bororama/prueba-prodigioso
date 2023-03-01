import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  name : string;
  greeting : string;

  constructor(private http: HttpClient, private route: ActivatedRoute, private cookieService : CookieService) { 
    this.name = "nameless";
    this.greeting = "Welcome home, "
  }

  ngOnInit() {
    if (this.cookieService.check('name'))  {
      this.greeting = "Welcome back, "
      this.name = this.cookieService.get('name');
    }
    else {
      this.route.queryParams.subscribe((params) => {
        this.name = params['name'];
        this.cookieService.set('name', this.name);
      });
    }
  }

}
