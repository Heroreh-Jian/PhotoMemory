
$("#photoSearch").on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all";
  }
$.get('/photos?' + search, function(result) {
   $('#photoResult').html('');
    result.forEach(function(photo) {
    $('#photoResult').append(`
        <div class="col-sm-6 col-md-4">
          <div class="thumbnail">
            <img src="${photo.image }">
            <div class="caption">
              <h4>${ photo.name }</h4>
            </div>
            <p>
              <a href="/photos/${ photo._id }" class="btn btn-primary">More Info</a>
            </p>
          </div>
        </div>
      `);
    });
  });
});

$('#photoSearch').submit(function(event) {
  event.preventDefault();
});