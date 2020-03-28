import { DataService } from "./data.service";
import {
  AngularFireStorage,
  AngularFireUploadTask
} from "@angular/fire/storage";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { Observable } from "rxjs";
import { ISong } from "./song";
import { Data } from "@angular/router";
import { finalize, tap } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import "firebase/storage";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  songMetadata: FormGroup;
  selectedFile: File = null;
  isImageFileSelected: boolean;
  isImageURLEntered: boolean;
  isHovering: boolean;
  song: ISong;
  imagePreview: any;
  imageURL: string;

  // Uplaoding Image To Firebase
  task: AngularFireUploadTask;

  @ViewChild("formDirective") private formDirective: NgForm;

  constructor(
    private formBuilder: FormBuilder,
    private service: DataService,
    private storage: AngularFireStorage,
    private spinner: NgxSpinnerService
  ) {
    this.isImageFileSelected = false;
    this.isImageURLEntered = false;
    this.isHovering = false;
  }

  ngOnInit() {
    this.songMetadata = this.formBuilder.group({
      songName: ["", Validators.required],
      artistName: ["", Validators.required],
      albumName: ["", Validators.required],
      url: ["", Validators.required],
      description: ["", Validators.required],
      enteredURL: ""
    });

    // Delete All Previous Images in FireStorage If Any
    firebase
      .storage()
      .ref()
      .child("/")
      .listAll()
      .then(res => {
        res.items.forEach(item => {
          item.delete();
        });
      });
  }

  fileSelected(event: any) {
    this.isImageFileSelected = true;
    this.isImageURLEntered = false;
    this.selectedFile = event.target.files[0];
    this.loadPreview();
  }

  fileDropped(event: FileList) {
    this.isImageFileSelected = true;
    this.isImageURLEntered = false;
    this.selectedFile = event.item(0);
    this.loadPreview();
  }

  clearForm() {
    this.formDirective.resetForm();
    this.isImageFileSelected = false;
    this.isHovering = false;
    this.isImageURLEntered = false;
    /* Noty clearing selected fiel here  coz in submit function form is cleared before file is uploaded */
    // this.selectedFile = null;
  }

  changeIsHover(isHovering: boolean) {
    this.isHovering = isHovering;
  }

  loadPreview = () => {
    let reader = this.service.getReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onloadend = event => {
      this.imagePreview = reader.result;
    };
    return this.imagePreview;
  };

  loadPreviewFromURL(songMetadata: FormGroup) {
    if (songMetadata.value.enteredURL !== "") {
      this.isImageURLEntered = true;
      this.isImageFileSelected = false;
      this.imageURL = songMetadata.value.enteredURL;
    } else {
      this.isImageURLEntered = false;
      this.isImageFileSelected = false;
    }
  }

  onSubmit(songForm: FormGroup) {
    event.preventDefault();
    if (this.isImageFileSelected) {
      this.song = {
        name: songForm.value.songName,
        artist: songForm.value.artistName,
        album: songForm.value.albumName,
        url: songForm.value.url,
        description: songForm.value.description,
        image: ""
      };
      this.clearForm();

      let path =
        Math.random()
          .toString(36)
          .substr(2, 16) +
        Math.random()
          .toString(36)
          .substr(2, 16);
      this.spinner.show(undefined, {
        type: "ball-running-dots",
        size: "medium",
        bdColor: "rgba(191, 191, 191, .8)",
        color: "white"
      });
      let ref = this.storage.ref(path);
      this.storage
        .upload(path, this.selectedFile)
        .snapshotChanges()
        .pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(url => {
              this.song.image = url;
              this.service.addSong(this.song);
              this.spinner.hide();
            });
            this.selectedFile = null;
          })
        )
        .subscribe();
    } else {
      this.song = {
        name: songForm.value.songName,
        artist: songForm.value.artistName,
        album: songForm.value.albumName,
        url: songForm.value.url,
        description: songForm.value.description,
        image: this.imageURL
      };
      this.clearForm();
      this.selectedFile = null;
      this.service.addSong(this.song);
    }
  }
}
