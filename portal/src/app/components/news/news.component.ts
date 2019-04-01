import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { NewsService } from 'app/services/news.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, AfterViewInit {
  private path = this.url.path();
  private newsData;

  goToback() {
    var history = window.history;
    history.back();
  }

  constructor(
    public service: NewsService,
    private url: LocationStrategy
  ) {
    this.newsData = this.service.getNewsData();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $(".company, .event").on("mouseenter", function() {
        var self = $(this);
    
        $(this).find(".shadow").stop(true).fadeIn();
    
        $(this).find(".hovered")
                .stop(true)
                .animate({
                  opacity: 1,
                  top: "0",
                  height: "65px"
              }, 500).show();

      });
    
      $(".company, .event").on("mouseleave", function() {
        var self = $(this);
    
        $(this).find(".hovered")
               .stop(true)
               .animate({
                opacity: 0,
                top: "-20px",
                height: "toggle"
              }, 500)
    
        setTimeout(function() {
          self.find(".modal_call.second")
              .stop(true)
                  .animate({
                    opacity: 0,
                    top: "-=20",
                    height: "0"
                  }, 500)
          }, 500);
    
        $(this).find(".shadow")
               .stop(true)
               .delay(500)
               .fadeOut("slow");
      });
    }, 1000);
  }

}
