import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'app/services/feedback.service';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  private feedbackData;

  constructor(
    public service: FeedbackService,
    private url: LocationStrategy
  ) {
    console.clear();
    this.feedbackData = this.service.getFeedbackData(this.getFeedbackId());
  }

  sendForm(name, email, feedback) {
    const body = new FormData();
    body.append('point', this.getFeedbackId());
    body.append('name', name);
    body.append('email', email);
    body.append('feedback', feedback);
    this.service.postFormValue(body);
  }

  goToback() {
    var history = window.history;
    history.back();
  }

  getFeedbackId() {
    var path = this.url.path();
    var pointId = path.substr(path.lastIndexOf('/') + 1);
    return pointId;
  }

  ngOnInit() {
  }

}
