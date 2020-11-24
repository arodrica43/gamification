/* Javascript for GamificationXBlock. */
function GamificationXBlock(runtime, element) {


    var handlerUrl = runtime.handlerUrl(element, 'set_dynamic_id');

    function post_success(result){
      console.log(result["mech_id"])
      fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + result["mech_id"] + "/?user=user2&dynamic_index=" + $("#local-id-param", element)[0].value.replace(/[\s\.\&\:\+\@]/g, "")) //&dynamic_index={self.scope_ids.def_id} 
      .then(response => response.json())
      .then(gmJson => ($(gmJson.html).appendTo(element),
              console.log("GMechanic successfully loaded")))
      .catch(error => console.log("Error: " + error))
      console.log("POST done successfully!")
    }

    function set_dynamic_id(k){
       $.ajax({
            type: "POST",
            url: handlerUrl,
            data: JSON.stringify({ "mech_id": k }),
            success: post_success
        });
    }

    $(function($) {
      fetch("https://agmodule.herokuapp.com/api/g_mechancis/retrieve_adaptative_widget_id?user=user2")
      .then(response => response.json())
      .then(gmJson => (gmJson.gmechanic_id))
      .then(mech_id => (set_dynamic_id(mech_id)))
      .catch(error => console.log("Error: " + error))
    });
}
