const concerts={
	documentID:'1082262145357594624',
	index:function(){
		document.getElementById('concerts').innerHTML='Loading posts, please wait...';
		database.index(concerts.documentID,function(items){
			document.getElementById('concerts').innerHTML='';
			for(let i=0;i<items.length;i++){
				let concert=items[i];
				document.getElementById('concerts').innerHTML+=`
					<li class="one_third">
          				<figure><a class="imgover" href="detail.html?concert_id=${i}"><img src="${concert.imgurl}"></a>
							<figcaption>
								<h6 class="heading">${concert.band}</h6>
								<p>${concert.date} at ${concert.venue} in ${concert.city}, ${concert.state}</p>
							</figcaption>
          				</figure>
        			</li>`;
			}
		});
	},
	detail:function(index){
		database.detail(concerts.documentID,index,function(item){
			document.getElementById('bg').style=`background-image:url('${item.imgurl}');`
			document.getElementById('details').innerHTML+=`
				<h1>${item.band}</h1>
				<h2>Date: ${item.date}</h2>
				<h2>Venue: ${item.venue} in ${item.city}, ${item.state}</h2>
				<p>${item.desc}</p>
				<p>Author: ${item.author}</p>
				<a href="edit.html?concert_id=${index}"><button>Edit</button></a>
				<button href="delete.html?concert_id=${index}" id="btn-delete">Delete</button></br></br>
				<a href="index.html"><-- Back to Index</a>
			`;			
			let deleteButton=document.getElementById('btn-delete');
			deleteButton.addEventListener('click',function(){
				database.delete(concerts.documentID,index);
			});
		});
	},
	create:function(){
		document.querySelector('form').addEventListener('submit',function(e){
			e.preventDefault();
			let author=document.querySelector('form input[name=author]');
			let band=document.querySelector('form input[name=band]');
			let venue=document.querySelector('form input[name=venue]');
			let city=document.querySelector('form input[name=city]');
			let state=document.querySelector('form input[name=state]');
			let date=document.querySelector('form input[name=date]');
			let desc=document.querySelector('form textarea[name=desc]');
			let imgurl=document.querySelector('form input[name=imgurl]');
			let newPost={
				band:band.value,
				venue:venue.value,
				city:city.value,
				state:state.value,
				date:date.value,
				desc:desc.value,
				imgurl:imgurl.value,
				author:author.value
			}
			database.create(concerts.documentID,newPost);
		});
	},
	update:function(index){
		database.detail(concerts.documentID,index,function(item){
			document.getElementById('loading').style.display='none';
			document.querySelector('form input[name=author]').value=item.author;
			document.querySelector('form input[name=band]').value=item.band;
			document.querySelector('form input[name=venue]').value=item.venue;
			document.querySelector('form input[name=city]').value=item.city;
			document.querySelector('form input[name=state]').value=item.state;
			document.querySelector('form input[name=date]').value=item.date;
			document.querySelector('form textarea[name=desc]').value=item.desc;
			document.querySelector('form input[name=imgurl]').value=item.imgurl;

			document.querySelector('form').addEventListener('submit',function(e){
				e.preventDefault();
				let author=document.querySelector('form input[name=author]');
				let band=document.querySelector('form input[name=band]');
				let venue=document.querySelector('form input[name=venue]');
				let city=document.querySelector('form input[name=city]');
				let state=document.querySelector('form input[name=state]');
				let date=document.querySelector('form input[name=date]');
				let desc=document.querySelector('form textarea[name=desc]');
				let imgurl=document.querySelector('form input[name=imgurl]');
				let newPost={
					band:band.value,
					venue:venue.value,
					city:city.value,
					state:state.value,
					date:date.value,
					desc:desc.value,
					imgurl:imgurl.value,
					author:author.value
				}
				database.update(concerts.documentID,index,newPost);
			});
		});
	}
}