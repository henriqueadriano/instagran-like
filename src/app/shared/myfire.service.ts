import * as firebase from 'firebase'
import { UserService } from "./user.service"
import { Injectable } from "@angular/core"
import { reject } from 'q'

@Injectable()
export class MyFireService {

    constructor(private user: UserService) { }

    getUserFromDatabase(uid) {

        const ref = firebase.database().ref('users/' + uid)
        return ref.once('value')
            .then(snapshot => snapshot.val())

    }

    public uploadFile(file) {
        const fileName = this.generateRandomName()// + this.getFileType(file.type)
        const fileRef = firebase.storage().ref().child('images/' + fileName)
        const uploadTask = fileRef.put(file)
        return new Promise((resolve, regect) => {
            uploadTask.on('state_changed', snapshot => {
            }, error => {
                reject(error)
            }, () => {
                const fileUrl = uploadTask.snapshot.downloadURL
                const objectReturn = { fileName, fileUrl }
                resolve(objectReturn)
            })
        })
    }

    public generateRandomName(): string {
        let text = ""
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

        for (let i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length))
        }

        return text
    }

    public getFileType(fileType: string): string {
        if (fileType === 'image/jpeg') {
            return '.jpg'
        }
    }

    public handleImageUpload(data) {

        const user = this.user.getProfile();

        const newPersonalPostKey = firebase.database().ref().child('myposts').push().key;
        const personalPostDetails = {
            fileUrl: data.fileUrl,
            name: data.fileName,
            creationDate: new Date().toString()
        };

        const allPostKey = firebase.database().ref('allposts').push().key;
        const allPostsDetails = {
            fileUrl: data.fileUrl,
            name: data.fileName,
            creationDate: new Date().toString(),
            uploadedBy: user
        };

        const imageDetails = {
            fileUrl: data.fileUrl,
            name: data.fileName,
            creationDate: new Date().toString(),
            uploadedBy: user,
            favoriteCount: 0
        };

        const updates = {};
        updates['/myposts/' + user.uid + "/" + newPersonalPostKey] = personalPostDetails;
        updates['/allposts/' + allPostKey] = allPostsDetails;
        updates['/images/' + data.fileName] = imageDetails;

        return firebase.database().ref().update(updates);
    }

    public getUserPostsRef(uid) {
        return firebase.database().ref('myposts').child(uid);
    }
}