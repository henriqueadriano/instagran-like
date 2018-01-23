import { Component, OnInit } from '@angular/core';
import { NotificationService } from "../shared/notification.service";
import { MyFireService } from '../shared/myfire.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html'
})
export class MyPostsComponent implements OnInit {

  //constructor() { }
  constructor(private myFire: MyFireService, private notifier: NotificationService) { }

  ngOnInit() {
  }

  onFileSelection(event) {
    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.myFire.uploadFile(file)
        /*.then(data => {
          this.notifier.display('success', 'Picture Successfully uploaded!!');
          return this.myFire.handleImageUpload(data);
        })
        .catch(err => {
          this.notifier.display('error', err.message);
        });*/
    }


  }

}
