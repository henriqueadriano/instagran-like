import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    // Initialize Firebase
    const config = {
      apiKey: "AIzaSyDiIlnXSDHj0GgFaXeTTAclWsnFDhUHTaE",
      authDomain: "instagram-587a1.firebaseapp.com",
      databaseURL: "https://instagram-587a1.firebaseio.com",
      projectId: "instagram-587a1",
      storageBucket: "instagram-587a1.appspot.com",
      messagingSenderId: "916900051403"
    };
    firebase.initializeApp(config);
  }

}
