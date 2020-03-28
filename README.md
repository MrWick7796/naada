This is a simple App to push data into a Queue and on click of "Next" button, Data is pushed to a firebase document.
Subsequent Pushes overwrite to the same document.
On App Load the Firebase Storage is cleared.
Clear Button Clears the Queue.
An interesting Drag And Drop Zone is also implemented for Ease of Use.
All images uploaded by user are uploaded to FireBase Storage and the returned download URL is used in the Document Image field to generate all Thumbnail Previews.
Once the Document is overwritten by new data, its corresponding Image from(If Uploaded) Firebase Storage is also removed.

App Deployment is also done to Firebase

NOTE: To use the app after cloning, first go to src/environments and paste the firebase config(got from the firebase console) in both the files.
