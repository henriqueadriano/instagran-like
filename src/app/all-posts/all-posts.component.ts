import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase';
import { MyFireService } from "../shared/myfire.service";
import { NotificationService } from "../shared/notification.service";
import _ from 'lodash';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css']
})
export class AllPostsComponent implements OnInit, OnDestroy {

  public allRef: any;
  public loadMoreRef: any;
  public all: any = [];

  constructor() { }

  ngOnInit() {
    this.allRef = firebase.database().ref('allposts').limitToFirst(3);
    this.allRef.on('child_added', data => {
      this.all.push({
        key: data.key,
        data: data.val()
      });
    });
  }

  public onLoadMore(): void {
    if (this.all.length > 0) {
      //const lastLoadedPost = _.last(this.all);
      const lastLoadedPost = this.all[this.all.length - 1]
      const lastLoadedPostKey = lastLoadedPost.key;

      this.loadMoreRef = firebase.database().ref('allposts')
        .startAt(null, lastLoadedPostKey).limitToFirst(3 + 1);

      this.loadMoreRef.on('child_added', data => {

        if (data.key === lastLoadedPostKey) {
          return;
        } else {
          this.all.push({
            key: data.key,
            data: data.val()
          });
        }
      });
    }

  }

  ngOnDestroy() {
    this.allRef.off();
    if (this.loadMoreRef) {
      this.loadMoreRef.off();
    }
  }

}
