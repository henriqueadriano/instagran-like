import { Component, OnInit } from '@angular/core';
import { NotificationService } from "../shared/notification.service";
import { MyFireService } from '../shared/myfire.service';
import * as firebase from 'firebase'
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit, OnDestroy {

  postLists: any = []
  personalPostRef: any;

  constructor(private myFire: MyFireService, private notifier: NotificationService) { }

  ngOnInit() {

    const uid = firebase.auth().currentUser.uid
    this.personalPostRef = this.myFire.getUserPostsRef(uid)
    this.personalPostRef.on('child_added', data => {
      this.postLists.push({
        key: data.key,
        data: data.val()
      })
    })
  }

  onFileSelection(event) {
    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.myFire.uploadFile(file)
        .then(data => {
          this.notifier.display('success', 'Picture Successfully uploaded!!');
          this.myFire.handleImageUpload(data);
        })
        .catch(err => {
          if (err.message.includes('First argument contains an invalid key')) {
            this.notifier.display('success', 'Picture Successfully uploaded!!');
          } else {
            this.notifier.display('error', err.message);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.personalPostRef.off()
  }

}
