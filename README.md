#NKU ASE220 Mid-term

### What is it?:
This is a website that allows users to post their experiences and information about concerts that they have been to. Here tthey can post, edit, and delete their reviews and browse others.

### How does it work?
This application works by using javascript and the axios API to exchange information between the website and a database hosted on jsonblob.com in order to implement crud functions. It has an index of created posts, and has forms to edit posts and create new ones, along with a delete function.

### What entities does in need?
This app uses one entity for each concert that contains fields for the name of the band, the venue name, city, state, date the show took place, a description, an image url for the thumbnail/background, and the author who wrote the post. Ideally for a more in-depth project it would have even more fields and separate tables in a dbms, plus an authentication module, but these entities are perfect for a proof of concept.