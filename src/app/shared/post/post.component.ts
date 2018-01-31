import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as firebase from 'firebase'

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() imageName: string
  @Input() displayPostedBy: boolean = true
  @Input() displayFavoritesButton: boolean = true
  defaultImage: string = "http://via.placeholder.com/150X150"
  imageData: any = {}

  @Output() favoriteClicked = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    firebase.database().ref('images').child(this.imageName)
      .once('value')
      .then(snapshot => {
        this.imageData = snapshot.val()
        this.defaultImage = this.imageData.fileUrl
      })
  }

  onFavoritesClicked() {
    this.favoriteClicked.emit(this.imageData);
  }

}
