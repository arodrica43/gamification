/* Javascript for GamificationXBlock. */
function GamificationXBlock(runtime, element) {

    
    var handlerUrl = runtime.handlerUrl(element, 'get_gmechanic_id');

    function post_success(result){
      fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + result["mech_id"] + "/?user=user2&dynamic_index=" + $("#local-id-param", element)[0].value.replace(/[\s\.\&\:\+\@]/g, "")) //&dynamic_index={self.scope_ids.def_id} 
      .then(response => response.json())
      .then(gmJson => ($('#main-embedded-content', element)[0].innerHTML = gmJson.html, 
                      $(gmJson.html).appendTo(element),
                      console.log("GMechanic successfully loaded")))
      .catch(error => console.log("Error: " + error)),
      console.log("POST done successfully!")
    }

    function get_gmechanic_id(){
       $.ajax({
            type: "POST",
            url: handlerUrl,
            data: JSON.stringify({ "data": 0 }),
            success: post_success
        });
    }

    $(function($) {
      get_gmechanic_id();
    });
}
