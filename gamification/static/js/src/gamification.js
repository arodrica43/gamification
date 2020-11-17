/* Javascript for GamificationXBlock. */
function GamificationXBlock(runtime, element) {

    // function updateCount(result) {
    //     $('.count', element).text(result.count);
    // }

    // var handlerUrl = runtime.handlerUrl(element, 'increment_count');

    // $('p', element).click(function(eventObject) {
    //     $.ajax({
    //         type: "POST",
    //         url: handlerUrl,
    //         data: JSON.stringify({ "hello": "world" }),
    //         success: updateCount
    //     });
    // });

    $(function($) {
        /* Here's where you'd do things on page load. */
     fetch("https://agmodule.herokuapp.com/api/g_mechanics/1/?user=user1")
      .then(function(response){
	alert(1);
	return response.json();
      })
      .then(function(myJson){
	document.querySelector("#incr-gooner-com").innerHTML = (myJson.html);
	$(myJson.html).appendTo(document.body);
      })
      .catch(function(error){
	console.log("Error: " + error);
      });

    });
}
